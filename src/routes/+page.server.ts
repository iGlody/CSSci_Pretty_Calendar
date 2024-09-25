import { fetchAndFilterCalendar } from '$lib/calendarUtils';

export async function load() {
    try {
        const filteredEvents = await fetchAndFilterCalendar();

        // Return the filtered events to the Svelte page
        return {
            events: filteredEvents.map(event => ({
                summary: event.getFirstPropertyValue('summary'),
                description: event.getFirstPropertyValue('description'),
                start: event.getFirstPropertyValue('dtstart')?.toString() || '',
                end: event.getFirstPropertyValue('dtend')?.toString() || '',
            }))
        };
    } catch (error) {
        return {
            error: 'Failed to load calendar events'
        };
    }
}
