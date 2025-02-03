import ical from "ical.js";

export async function fetchAndFilterCalendar(icalUrl: string) {
  try {
    const response = await fetch(icalUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch calendar data, status: ${response.status}`
      );
    }

    const calendarData = await response.text();
    const jcalData = ical.parse(calendarData);
    const vcalendar = new ical.Component(jcalData);

    // Filter and modify events while preserving all attributes
    const filteredEvents = vcalendar
      .getAllSubcomponents("vevent")
      .filter((event) => {
        const description = event.getFirstPropertyValue("description");
        return (
          typeof description === "string" &&
          !description.startsWith("Type: Self-study")
        );
      })
      .map((event) => {
        let summary = event.getFirstPropertyValue("summary");
        const description = event.getFirstPropertyValue("description");
        const location = event.getFirstPropertyValue("location");
        // Modify the summary only if it is "FOUNDATION: Appreciating the complexity of social challenges"
        if (
          summary ===
            "FOUNDATION: Appreciating the complexity of social challenges" ||
          summary ===
            "CONNECTIONS: Linking data for better interventions in health or mobility systems" ||
          summary ===
            "BUILDING BLOCKS: Experimenting with digital interventions for behavioural changeBUILDING BLOCKS: Experimenting with digital interventions for behavioural change"
        ) {
          const typeMatch =
            typeof description === "string"
              ? description.match(/Type:\s*(.*)/)
              : null;
          if (typeMatch && typeMatch[1]) {
            // Replace the summary with the extracted type
            summary = typeMatch[1].trim();
          }

          // Extract location if it starts with "REC "
          let extractedLocation = "";
          if (location && location.startsWith("REC ")) {
            extractedLocation = location.slice(4); // Take everything after "REC "
          }

          // If a location was extracted, append it to the summary
          if (extractedLocation) {
            summary += ` (${extractedLocation})`; // Append the extracted location to the summary
          }

          // Update the event with the new summary
          event.updatePropertyWithValue("summary", summary);
        }

        // Return the full event, preserving all properties, and keeping original summary if it's not modified
        return event;
      });

    return filteredEvents;
  } catch (error) {
    console.error(`Error fetching and filtering calendar: ${error}`);
    throw error;
  }
}

// Function to generate ICS data from filtered events and the original calendar
export function generateIcs(events: any[], originalVcalendar: any) {
  // Create a new vcalendar component to hold the filtered events
  const vcalendar = new ical.Component(["vcalendar", [], []]);
  vcalendar.updatePropertyWithValue("prodid", "-//Your App//Calendar//EN");
  vcalendar.updatePropertyWithValue("version", "2.0");
  vcalendar.updatePropertyWithValue("X-WR-CALNAME", `CSSci Calendar by Lukas`);

  // Copy over all non-event properties (e.g., prodid, version, etc.) from the original calendar
  //originalVcalendar.getAllProperties().forEach((prop) => {
  //    vcalendar.addProperty(prop); // Add each property to the new calendar
  //});

  // Add the filtered events back into the new calendar
  events.forEach((event) => {
    vcalendar.addSubcomponent(event); // Add each filtered event
  });

  // Return the new ICS calendar as a string
  return vcalendar.toString();
}
