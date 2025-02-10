import { fetchAndFilterCalendar, generateIcs } from "$lib/calendarUtils";
import { updateCalendarData } from "$lib/dbHelpers";
import ical from "ical.js";

import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to set up Supabase Realtime subscription
export async function setupSubscription() {
  supabase
    .channel("public:calendar_tasks")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "calendar_tasks" },
      async (payload) => {
        const calendar_url = payload.new.calendar_url;

        try {
          // Mark task as processing
          await supabase
            .from("calendar_tasks")
            .update({ status: "processing" })
            .eq("id", payload.new.id);

          // Fetch and process the calendar
          const filteredEvents = await fetchAndFilterCalendar(calendar_url);
          const originalResponse = await fetch(calendar_url);
          const originalData = await originalResponse.text();
          const originalJcalData = ical.parse(originalData);
          const originalVcalendar = new ical.Component(originalJcalData);
          const calendarData = generateIcs(filteredEvents, originalVcalendar);

          // Update the calendar data in your database
          await updateCalendarData(payload.new.cal_id, calendarData);

          // Mark task as completed
          //await supabase
          //  .from('calendar_tasks')
          //  .update({ status: 'completed' })
          //  .eq('id', payload.new.id);

          await supabase
            .from("calendar_tasks")
            .delete()
            .eq("id", payload.new.id);

          console.log(`Successfully processed calendar: ${calendar_url}`);
        } catch (error) {
          console.error(`Failed to process calendar ${calendar_url}:`, error);

          // Mark task as failed
          await supabase
            .from("calendar_tasks")
            .update({ status: "failed" })
            .eq("id", payload.new.id);

          // Mark task as failed
          if (error instanceof Error) {
            await supabase
              .from("calendar_tasks")
              .update({ error_type: error.message })
              .eq("id", payload.new.id);
          } else {
            await supabase
              .from("calendar_tasks")
              .update({ error_type: "Unknown error" })
              .eq("id", payload.new.id);
          }
        }
      }
    )
    .subscribe();
}
