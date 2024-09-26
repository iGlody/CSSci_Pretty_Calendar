import { fetchAndFilterCalendar } from '$lib/calendarUtils';
import { getSubscriptionLinkByCalendarUrl, insertCalendar } from '$lib/dbHelpers';
import crypto from 'crypto';

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
                // Generate a new subscription link and insert the new calendar
                const uuid = crypto.randomUUID();
                const newSubscriptionLink = `/${uuid}.ics`;

                // Fetch and filter the calendar data
                const filteredEvents = await fetchAndFilterCalendar(calendarUrl);
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
