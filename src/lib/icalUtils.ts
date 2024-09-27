// src/lib/icalUtils.ts

// Function to modify the raw iCal string directly
export function modifyIcsData(icsData: string): string {
    const lines = icsData.split('\r\n'); // Split the iCal data into lines
    const filteredLines: string[] = [];
    let skipEvent = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Start of a new event
        if (line.startsWith('BEGIN:VEVENT')) {
            skipEvent = false;
        }

        // Check for specific conditions to skip an event or modify its content
        if (line.startsWith('SUMMARY:FOUNDATION: Appreciating the complexity of social challenges')) {
            skipEvent = true;
        }

        // Add to filtered lines if not skipping the event
        if (!skipEvent) {
            filteredLines.push(line);
        }

        // End of an event
        if (line.startsWith('END:VEVENT')) {
            skipEvent = false;
        }
    }

    return filteredLines.join('\r\n'); // Re-join the lines to create a valid iCal format
}
