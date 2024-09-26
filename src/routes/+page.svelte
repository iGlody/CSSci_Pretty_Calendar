<script lang="ts">
    let calendarUrl = '';
    let subscriptionLink = '';
    let fullSubscriptionLink = ''; // Full URL including the current URL
    let error = '';
    let loading = false;

    // Function to submit the calendar URL and fetch the subscription link
    async function submitCalendar(event: Event) {
        event.preventDefault(); // Prevent the default form behavior
        loading = true;
        error = ''; // Clear any previous error
        subscriptionLink = ''; // Clear previous link
        fullSubscriptionLink = ''; // Clear full subscription link

        const formData = new FormData();
        formData.append('calendar_url', calendarUrl);

        try {
            // Send the request to the backend API
            const response = await fetch('/submitCalendar', {
                method: 'POST',
                body: formData,
            });

            // Parse the response as JSON
            const data = await response.json();

            // Handle success or error based on the response
            if (response.ok && data.subscriptionLink) {
                subscriptionLink = data.subscriptionLink; // Set the subscription link
                fullSubscriptionLink = `${window.location.origin}${subscriptionLink}`; // Create full URL
            } else {
                error = data.error || 'An error occurred';
            }
        } catch (err) {
            error = 'Failed to fetch the subscription link';
        } finally {
            loading = false;
        }
    }

    // Copy the full subscription link
    function clipboardCopy() {
        if (fullSubscriptionLink) {
            navigator.clipboard.writeText(fullSubscriptionLink);
            alert('Link copied to clipboard!');
        } else {
            alert('No link available to copy.');
        }
    }
</script>

<div class="hero bg-white h-dvh">
    <div class="hero-content flex flex-col justify-center">
        <h1 class="text-4xl font-bold">Pretty Calendar CSSci</h1>
        <form on:submit={submitCalendar} class="flex">
            <input class="input input-bordered w-full max-w-xs"  bind:value={calendarUrl} placeholder="Enter Calendar URL" required>
            <button class="btn btn-primary" type="submit">Submit</button>
        </form>
    
        {#if loading}
            <p class="">Loading... Please wait for the subscription link.</p>
        {/if}
    
        {#if error}
            <p style="color: red;">{error}</p>
        {/if}
    
        {#if fullSubscriptionLink}
        <div class="flex flex-col text-center">
            <p>Your subscription link: </p>
            <p class="font-bold text-black">{fullSubscriptionLink}</p>
        </div>
        <button class="btn btn-shadow" on:click={clipboardCopy}>Copy Link</button>

        {/if}
    </div>
</div>
