import { getAllCalendars } from '$lib/dbHelpers';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
    try {
        const calendars = await getAllCalendars(); // Retrieve all calendars from the database

        // Enqueue tasks for each calendar
        for (const calendar of calendars) {
            const { error } = await supabase
                .from('calendar_tasks')
                .insert({ calendar_url: calendar.calendar_url, cal_id: calendar.id });
            
            if (error) {
                console.error(`Failed to enqueue task for ${calendar.calendar_url}:`, error);
            }
        }

        return new Response('Calendars enqueued for processing', { status: 200 });
    } catch (error) {
        console.error('Error enqueuing calendar tasks:', error);
        return new Response('Failed to enqueue calendar tasks', { status: 500 });
    }
}
