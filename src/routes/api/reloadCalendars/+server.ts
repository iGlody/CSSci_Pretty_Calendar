import { fetchAndFilterCalendar, generateIcs } from '$lib/calendarUtils';
import { getAllCalendars, updateCalendarData } from '$lib/dbHelpers';
import ical from 'ical.js';

export async function POST() {
    try {
        const calendars = await getAllCalendars(); // Retrieve all calendars from the database

        for (const calendar of calendars) {
            const filteredEvents = await fetchAndFilterCalendar(calendar.calendar_url);
            
            // Fetch the original calendar to preserve its metadata (e.g., prodid, version)
            const originalResponse = await fetch(calendar.calendar_url);
            const originalData = await originalResponse.text();
            const originalJcalData = ical.parse(originalData);
            const originalVcalendar = new ical.Component(originalJcalData);

            // Generate the ICS file using the filtered events and original vcalendar
            const calendarData = generateIcs(filteredEvents, originalVcalendar);

            // Update the calendar data in the database
            await updateCalendarData(calendar.id, calendarData);
        }
        return new Response('All calendars reloaded and refiltered successfully', { status: 200 });
    } catch (error) {
        console.error('Error reloading calendars:', error);
        return new Response('Failed to reload calendars', { status: 500 });
    }
}
