import ical from 'ical.js';

export async function fetchAndFilterCalendar() {
    const icalUrl = 'https://rooster.uva.nl/ical?66f12f8f&group=false&eu=MTUxMzk5MDVAdXZhLm5s&h=t6uR04Cywkn1uDMyfqO5oONEj8DKntnaD2mQdZ8YLko=';

    try {
        const response = await fetch(icalUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch calendar data, status: ${response.status}`);
        }

        const calendarData = await response.text();
        const jcalData = ical.parse(calendarData);
        const vcalendar = new ical.Component(jcalData);

        // Filter and modify events while preserving all attributes
        const filteredEvents = vcalendar.getAllSubcomponents('vevent').filter((event) => {
            const description = event.getFirstPropertyValue('description');
            return typeof description === 'string' && !description.startsWith('Type: Self-study');
        }).map((event) => {
            let summary = event.getFirstPropertyValue('summary');
            const description = event.getFirstPropertyValue('description');
            const location = event.getFirstPropertyValue('location');

            // Modify the summary if it's the specific event
            if (summary === 'FOUNDATION: Appreciating the complexity of social challenges' && description) {
                const typeMatch = description.match(/Type:\s*(.*)/);
                if (typeMatch && typeMatch[1]) {
                    // Replace the summary with the extracted type
                    summary = typeMatch[1].trim();
                }
            }

            // Extract location if it starts with "REC "
            let extractedLocation = '';
            if (location && location.startsWith('REC ')) {
                extractedLocation = location.slice(4); // Take everything after "REC "
            }

            // If a location was extracted, append it to the summary
            if (extractedLocation) {
                summary += ` (${extractedLocation})`; // Append the extracted location to the summary
            }

            // Update the event with the new summary
            event.updatePropertyWithValue('summary', summary);

            // Return the full event, preserving all properties
            return event;
        });

        return filteredEvents;

    } catch (error) {
        console.error(`Error fetching and filtering calendar: ${error}`);
        throw error;
    }
}

// Function to generate ICS data from filtered events
export function generateIcs(events: any[]) {
    const vcalendar = new ical.Component(['vcalendar', [], []]);
    vcalendar.updatePropertyWithValue('prodid', '-//Your App//Calendar//EN');
    vcalendar.updatePropertyWithValue('version', '2.0');

    // Add filtered events back to the new calendar
    events.forEach((event) => {
        vcalendar.addSubcomponent(event);
    });

    return vcalendar.toString();
}
