<script lang="ts">
    import { page } from '$app/stores';

    // Access the filtered events from the server
    let events = $page.data.events;
    let error = $page.data.error;
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
                    <strong>{event.summary}</strong><br>
                    {event.description} <br>
                    {event.start} - {event.end}
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
