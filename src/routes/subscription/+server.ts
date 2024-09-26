import { getSubscriptionLinkByCalendarUrl } from '$lib/dbHelpers';

export async function GET({ url }) {
    const calendarUrl = url.searchParams.get('calendar_url');

    if (!calendarUrl) {
        return new Response(JSON.stringify({ success: false, error: 'No calendar URL provided' }), { status: 400 });
    }

    // Fetch the subscription link from the database
    try {
        const subscriptionLink = await getSubscriptionLinkByCalendarUrl(calendarUrl);
        if (subscriptionLink) {
            return new Response(JSON.stringify({ success: true, subscriptionLink }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, error: 'Subscription link not found' }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Database error' }), { status: 500 });
    }
}
