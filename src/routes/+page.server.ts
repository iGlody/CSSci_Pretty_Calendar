import { fetchAndFilterCalendar } from '$lib/calendarUtils';

export async function load() {
    try {
        const filteredEvents = await fetchAndFilterCalendar();

        // Return all relevant event fields to the Svelte page
        return {
            events: filteredEvents.map(event => ({
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
        };
    } catch (error) {
        return {
            error: 'Failed to load calendar events'
        };
    }
}
