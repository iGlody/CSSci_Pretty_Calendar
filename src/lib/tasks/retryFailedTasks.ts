import { createClient } from '@supabase/supabase-js';
import { fetchAndFilterCalendar, generateIcs } from '$lib/calendarUtils';
import { updateCalendarData } from '$lib/dbHelpers';
import ical from 'ical.js';

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function retryFailedTasks(batchSize = 10) {
    try {
        // Query the tasks with status 'failed', limiting to the batch size
        const { data: failedTasks, error } = await supabase
            .from('calendar_tasks')
            .select('*')
            .eq('status', 'failed')
            .limit(batchSize);

        if (error) {
            console.error('Error fetching failed tasks:', error);
            return;
        }

        // Process each failed task
        for (const task of failedTasks) {
            try {
                console.log(`Retrying task for calendar: ${task.calendar_url}`);

                // Mark task as processing
                await supabase
                    .from('calendar_tasks')
                    .update({ status: 'processing' })
                    .eq('id', task.id);

                // Fetch and process the calendar again
                const filteredEvents = await fetchAndFilterCalendar(task.calendar_url);
                const originalResponse = await fetch(task.calendar_url);
                const originalData = await originalResponse.text();
                const originalJcalData = ical.parse(originalData);
                const originalVcalendar = new ical.Component(originalJcalData);
                const calendarData = generateIcs(filteredEvents, originalVcalendar);

                // Update the calendar data in your database
                await updateCalendarData(task.id, calendarData);

                // Mark the task as completed
                await supabase
                    .from('calendar_tasks')
                    .update({ status: 'completed' })
                    .eq('id', task.id);

                console.log(`Successfully retried calendar task: ${task.calendar_url}`);
            } catch (retryError) {
                console.error(`Failed to retry task for calendar ${task.calendar_url}:`, retryError);

                // If retry fails again, leave the status as 'failed'
            }
        }
    } catch (globalError) {
        console.error('Error in retrying failed tasks:', globalError);
    }
}
