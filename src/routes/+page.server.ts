import { fetchAndFilterCalendar } from '$lib/calendarUtils';
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
                // Generate a new subscription link and insert the new calendar
                const uuid = crypto.randomUUID();
                const newSubscriptionLink = `/${uuid}.ics`;

                // Fetch and filter the calendar data
                const filteredEvents = await fetchAndFilterCalendar(calendarUrl);

                // Create an ICS file using ical.js
                const vcalendar = new ical.Component(['vcalendar', [], []]);
                vcalendar.updatePropertyWithValue('prodid', '-//Your App//Calendar//EN');
                vcalendar.updatePropertyWithValue('version', '2.0');

                // Add filtered events to the calendar
                filteredEvents.forEach(event => {
                    const vevent = new ical.Component('vevent');
                    vevent.updatePropertyWithValue('summary', event.getFirstPropertyValue('summary'));
                    vevent.updatePropertyWithValue('description', event.getFirstPropertyValue('description'));
                    vevent.updatePropertyWithValue('dtstart', event.getFirstPropertyValue('dtstart'));
                    vevent.updatePropertyWithValue('dtend', event.getFirstPropertyValue('dtend'));
                    vevent.updatePropertyWithValue('location', event.getFirstPropertyValue('location'));
                    vevent.updatePropertyWithValue('organizer', event.getFirstPropertyValue('organizer'));

                    // Add attendees, status, rrule, etc.
                    const attendees = event.getAllProperties('attendee');
                    attendees.forEach(attendee => {
                        vevent.addProperty(attendee);
                    });

                    vevent.updatePropertyWithValue('status', event.getFirstPropertyValue('status'));
                    vevent.updatePropertyWithValue('rrule', event.getFirstPropertyValue('rrule'));

                    // Add the event to the calendar
                    vcalendar.addSubcomponent(vevent);
                });

                // Convert the calendar to ICS format
                const calendarData = vcalendar.toString();

                // Insert the new calendar into the database (as ICS)
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
