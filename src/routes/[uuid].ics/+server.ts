import { createClient } from '@supabase/supabase-js';
import { modifyIcsData } from '$lib/icalUtils'; // Import the modification function

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET({ params }) {
    const { uuid } = params;

    // Fetch the calendar data by UUID from the database
    const { data, error } = await supabase
        .from('calendars')
        .select('calendar_data')
        .eq('subscription_link', `/${uuid}.ics`)
        .single();

    if (error || !data) {
        return new Response('Calendar not found', { status: 404 });
    }

    try {
        // Modify the calendar data using the function that works directly on the iCal string
        const modifiedIcsData = modifyIcsData(data.calendar_data);

        // Serve the modified calendar data as an .ics file
        return new Response(modifiedIcsData, {
            headers: {
                'Content-Type': 'text/calendar',
                'Content-Disposition': `attachment; filename="${uuid}.ics"`,
            },
        });
    } catch (error) {
        return new Response(`Error processing calendar: ${error.message}`, { status: 500 });
    }
}
