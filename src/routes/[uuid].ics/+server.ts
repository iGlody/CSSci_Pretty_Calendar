import { createClient } from '@supabase/supabase-js';

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

    // Serve the calendar data as an .ics file
    return new Response(data.calendar_data, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': `attachment; filename="${uuid}.ics"`,
        },
    });
}
