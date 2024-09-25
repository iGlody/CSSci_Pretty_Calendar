import ical from 'ical.js';

function generateIcs(events: any[]) {
    const vcalendar = new ical.Component(['vcalendar', [], []]);
    vcalendar.updatePropertyWithValue('prodid', '-//Your App//Calendar//EN');
    vcalendar.updatePropertyWithValue('version', '2.0');

    events.forEach((event) => {
        const vevent = new ical.Component('vevent');
        vevent.updatePropertyWithValue('summary', event.summary);
        vevent.updatePropertyWithValue('description', event.description);
        vevent.updatePropertyWithValue('dtstart', ical.Time.fromJSDate(new Date(event.start), true));
        vevent.updatePropertyWithValue('dtend', ical.Time.fromJSDate(new Date(event.end), true));
        vcalendar.addSubcomponent(vevent);
    });

    return vcalendar.toString();
}

export async function GET() {
    const icalUrl = 'https://rooster.uva.nl/ical?66f12f8f&group=false&eu=MTUxMzk5MDVAdXZhLm5s&h=t6uR04Cywkn1uDMyfqO5oONEj8DKntnaD2mQdZ8YLko=';

    try {
        // Fetch the calendar data
        const response = await fetch(icalUrl);

        // Log the status and response
        console.log(`Fetched calendar from ${icalUrl}, Status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch calendar data, status: ${response.status}`);
        }

        const calendarData = await response.text();

        // Log the fetched calendar data (first 500 chars)
        console.log(`Calendar data: ${calendarData.slice(0, 500)}`);

        // Parse the calendar data
        const jcalData = ical.parse(calendarData);
        const vcalendar = new ical.Component(jcalData);

        // Filter and map events
        const events = vcalendar.getAllSubcomponents('vevent').filter((event) => {
            const description = event.getFirstPropertyValue('description');
            return typeof description === 'string' && !description.startsWith('Type: Self-study');
        }).map((event) => {
            return {
                summary: event.getFirstPropertyValue('summary'),
                description: event.getFirstPropertyValue('description'),
                start: event.getFirstPropertyValue('dtstart')?.toString() || '',
                end: event.getFirstPropertyValue('dtend')?.toString() || '',
            };
        });

        console.log(`Filtered events: ${JSON.stringify(events, null, 2)}`);

        // Generate the ICS file
        const icsData = generateIcs(events);

        // Log ICS file generation
        console.log('ICS file generated successfully');

        return new Response(icsData, {
            headers: {
                'Content-Type': 'text/calendar',
                'Content-Disposition': 'attachment; filename="filtered-calendar.ics"',
            },
        });
    } catch (error) {
        console.error(`Error generating calendar: ${error}`);
        return new Response('Failed to generate calendar', { status: 500 });
    }
}
