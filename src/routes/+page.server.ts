import { fetchAndFilterCalendar, generateIcs } from '$lib/calendarUtils'; // Import generateIcs
import { getSubscriptionLinkByCalendarUrl, insertCalendar } from '$lib/dbHelpers';
import crypto from 'crypto';
import ical from 'ical.js';

export const actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const calendarUrl = formData.get('calendar_url') as string;

            if (!calendarUrl) {
                return {
                    error: 'No calendar URL provided',
                };
            }

            // Check if the subscription link already exists
            const subscriptionLink = await getSubscriptionLinkByCalendarUrl(calendarUrl);

            if (subscriptionLink) {
                console.log(`Subscription link already exists: ${subscriptionLink}`);
                return {
                    subscriptionLink,
                };
            } else {
                // Generate a new subscription link
                const uuid = crypto.randomUUID();
                const newSubscriptionLink = `/${uuid}.ics`;

                // Fetch and filter the calendar events
                const filteredEvents = await fetchAndFilterCalendar(calendarUrl);

                // Fetch the original calendar to preserve its metadata (e.g., prodid, version)
                const originalResponse = await fetch(calendarUrl);
                const originalData = await originalResponse.text();
                const originalJcalData = ical.parse(originalData);
                const originalVcalendar = new ical.Component(originalJcalData); // Get the original vcalendar component

                // Generate the ICS file using the filtered events and original vcalendar
                const calendarData = generateIcs(filteredEvents, originalVcalendar);

                // Insert the new calendar into the database
                await insertCalendar(calendarUrl, newSubscriptionLink, calendarData);

                console.log(`Inserted new calendar with subscription link: ${newSubscriptionLink}`);
                return {
                    subscriptionLink: newSubscriptionLink,
                };
            }
        } catch (error) {
            return {
                error: error.message || 'Failed to process the calendar URL',
            };
        }
    }
};
