import ical from 'ical.js';

export async function load() {
    const icalUrl = 'https://rooster.uva.nl/ical?66f12f8f&group=false&eu=MTUxMzk5MDVAdXZhLm5s&h=t6uR04Cywkn1uDMyfqO5oONEj8DKntnaD2mQdZ8YLko=';

    try {
        const response = await fetch(icalUrl);
        const calendarData = await response.text();

        // Parse the iCalendar data
        const jcalData = ical.parse(calendarData);
        const vcalendar = new ical.Component(jcalData);

        // Extract and filter events
        const events = vcalendar.getAllSubcomponents('vevent').filter((event) => {
            const description = event.getFirstPropertyValue('description');
            // Skip events with "Type: Self-study" in the description
            return !description?.startsWith('Type: Self-study');
        }).map((event) => {
            // Return only necessary details for each event
            return {
                summary: event.getFirstPropertyValue('summary'),
                description: event.getFirstPropertyValue('description'),
                start: event.getFirstPropertyValue('dtstart').toString(),
                end: event.getFirstPropertyValue('dtend').toString(),
            };
        });

        return {
            events // Pass the filtered events to the client
        };
    } catch (error) {
        return {
            error: 'Failed to fetch or process the calendar'
        };
    }
}
