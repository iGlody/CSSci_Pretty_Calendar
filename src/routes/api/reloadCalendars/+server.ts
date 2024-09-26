import { fetchAndFilterCalendar } from '$lib/calendarUtils';
import { getAllCalendars, updateCalendarData } from '$lib/dbHelpers';

export async function POST() {
    try {
        const calendars = await getAllCalendars(); // Retrieve all calendars from the database
        for (const calendar of calendars) {
            const filteredEvents = await fetchAndFilterCalendar(calendar.calendar_url);
            const calendarData = JSON.stringify(
                filteredEvents.map(event => ({
                    summary: event.getFirstPropertyValue('summary'),
                    description: event.getFirstPropertyValue('description'),
                    start: event.getFirstPropertyValue('dtstart')?.toString() || '',
                    end: event.getFirstPropertyValue('dtend')?.toString() || '',
                    location: event.getFirstPropertyValue('location') || null,
                    organizer: event.getFirstPropertyValue('organizer') || null,
                    attendees: event.getAllProperties('attendee').map(att => att.getFirstValue()) || [],
                    status: event.getFirstPropertyValue('status') || null,
                    rrule: event.getFirstPropertyValue('rrule') || null
                }))
            );

            // Update the calendar data in the database
            await updateCalendarData(calendar.id, calendarData);
        }
        return new Response('All calendars reloaded and refiltered successfully', { status: 200 });
    } catch (error) {
        console.error('Error reloading calendars:', error);
        return new Response('Failed to reload calendars', { status: 500 });
    }
}
