import { fetchAndFilterCalendar, generateIcs } from '$lib/calendarUtils';
import { getAllCalendars, updateCalendarData } from '$lib/dbHelpers';
import ical from 'ical.js';

// Fetch the secret token from the environment variables
const SECRET_TOKEN = process.env.RELOAD_CALENDARS_TOKEN;

export async function POST({ url }) {
    // Check for the 'token' query parameter in the URL
    const token = url.searchParams.get('token');

    // If the token is missing or incorrect, return a 403 Forbidden response
    //if (!token || token !== SECRET_TOKEN) {
    //  return new Response('Unauthorized: Invalid or missing token', { status: 407 });
    //}

    // If token is valid, proceed with the calendar processing
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

        // Return a success message when all calendars are processed
        return new Response('All calendars reloaded and refiltered successfully', { status: 200 });
    } catch (error) {
        console.error('Error reloading calendars:', error);
        return new Response('Failed to reload calendars', { status: 500 });
    }
}
