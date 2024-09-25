import { fetchAndFilterCalendar, generateIcs } from '$lib/calendarUtils';

export async function GET() {
    try {
        const filteredEvents = await fetchAndFilterCalendar();

        // Generate the ICS file
        const icsData = generateIcs(filteredEvents);

        return new Response(icsData, {
            headers: {
                'Content-Type': 'text/calendar',
                'Content-Disposition': 'attachment; filename="filtered-calendar.ics"',
            },
        });
    } catch (error) {
        console.error(`Error generating ICS calendar: ${error}`);
        return new Response('Failed to generate calendar', { status: 500 });
    }
}
