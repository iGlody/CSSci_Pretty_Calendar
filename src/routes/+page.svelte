<script lang="ts">
    import { page } from '$app/stores';

    // Use the $page store to access the data returned from the load function
    let events = $page.data.events;
    let error = $page.data.error;

    // Helper function to format date-time
    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleString(); // Customize date formatting as needed
    }
</script>

<main>
    <h1>Filtered iCalendar Events</h1>

    {#if error}
        <p style="color: red;">{error}</p>
    {/if}

    {#if events && events.length > 0}
        <ul>
            {#each events as event}
                <li>
                    <strong>{event.summary || 'No Title'}</strong><br>
                    <em>{event.description || 'No Description'}</em><br>

                    <!-- Date and time -->
                    <div>
                        <strong>Start:</strong> {formatDate(event.start)}<br>
                        <strong>End:</strong> {formatDate(event.end)}<br>
                    </div>

                    <!-- Location -->
                    {#if event.location}
                        <div>
                            <strong>Location:</strong> {event.location}
                        </div>
                    {/if}

                    <!-- Organizer -->
                    {#if event.organizer}
                        <div>
                            <strong>Organizer:</strong> {event.organizer}
                        </div>
                    {/if}

                    <!-- Attendees -->
                    {#if event.attendees && event.attendees.length > 0}
                        <div>
                            <strong>Attendees:</strong>
                            <ul>
                                {#each event.attendees as attendee}
                                    <li>{attendee}</li>
                                {/each}
                            </ul>
                        </div>
                    {/if}

                    <!-- Status -->
                    {#if event.status}
                        <div>
                            <strong>Status:</strong> {event.status}
                        </div>
                    {/if}

                    <!-- Recurrence (if applicable) -->
                    {#if event.rrule}
                        <div>
                            <strong>Recurs:</strong> {event.rrule}
                        </div>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <p>No events found.</p>
    {/if}
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        margin: 20px;
    }

    h1 {
        color: #333;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
    }

    strong {
        font-size: 1.1em;
    }
</style>
