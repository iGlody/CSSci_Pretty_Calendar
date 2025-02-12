import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch the subscription link by calendar URL
export async function getSubscriptionLinkByCalendarUrl(calendarUrl: string) {
  const { data, error } = await supabase
    .from("calendars")
    .select("subscription_link")
    .eq("calendar_url", calendarUrl)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Database error");
  }

  return data ? data.subscription_link : null;
}

// Function to insert a new calendar into the database
export async function insertCalendar(
  calendarUrl: string,
  subscriptionLink: string,
  calendarData: string
) {
  const { error } = await supabase.from("calendars").insert([
    {
      calendar_url: calendarUrl,
      subscription_link: subscriptionLink,
      calendar_data: calendarData,
      last_updated: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw new Error("Error inserting into database");
  }
}

// Function to fetch all calendars from the database
export async function getAllCalendars() {
  const { data, error } = await supabase.from("calendars").select("*"); // Selects all fields from the 'calendars' table

  if (error) {
    throw new Error("Error fetching calendars");
  }

  return data || [];
}

// Function to update calendar data for a specific calendar
export async function updateCalendarData(
  calendarId: string,
  calendarData: string
) {
  const { error } = await supabase
    .from("calendars")
    .update({ calendar_data: calendarData })
    .eq("id", calendarId);

  if (error) {
    throw new Error("Error updating calendar data");
  } else {
    console.log(`Calendar ${calendarId} updated`);

    const { data, error } = await supabase
      .from("calendars")
      .update({ last_updated: new Date().toISOString() }) // Set to current timestamp
      .eq("id", calendarId);
  }
}

export async function getCalendarCount() {
  try {
    const { count, error } = await supabase
      .from("calendars")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (err) {
    console.error("Error fetching calendar count:", err);
    throw err;
  }
}
