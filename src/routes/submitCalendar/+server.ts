import { fetchAndFilterCalendar, generateIcs } from '$lib/calendarUtils';
import { getSubscriptionLinkByCalendarUrl, insertCalendar } from '$lib/dbHelpers';
import crypto from 'crypto';
import ical from 'ical.js';

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const calendarUrl = formData.get('calendar_url') as string;

        if (!calendarUrl) {
            return new Response('No calendar URL provided', { status: 400 });
        }

        // Check if the subscription link already exists in the database
        const subscriptionLink = await getSubscriptionLinkByCalendarUrl(calendarUrl);

        if (subscriptionLink) {
            console.log(`Subscription link already exists: ${subscriptionLink}`);
            return new Response(JSON.stringify({
                success: true,
                subscriptionLink
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // Generate a new subscription link
            const uuid = crypto.randomUUID();
            const newSubscriptionLink = `/${uuid}.ics`;

            // Fetch and filter the calendar data
            const filteredEvents = await fetchAndFilterCalendar(calendarUrl);

            // Fetch the original calendar to preserve its metadata (e.g., prodid, version)
            const originalResponse = await fetch(calendarUrl);
            const originalData = await originalResponse.text();
            const originalJcalData = ical.parse(originalData);
            const originalVcalendar = new ical.Component(originalJcalData);

            // Generate the ICS file using the filtered events and original vcalendar
            const calendarData = generateIcs(filteredEvents, originalVcalendar);

            // Insert the new calendar into the database (store the .ics string)
            await insertCalendar(calendarUrl, newSubscriptionLink, calendarData); // Insert the .ics data directly

            console.log(`Inserted new calendar with subscription link: ${newSubscriptionLink}`);

            // Return the new subscription link
            return new Response(JSON.stringify({
                success: true,
                subscriptionLink: newSubscriptionLink
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to process the calendar URL',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
