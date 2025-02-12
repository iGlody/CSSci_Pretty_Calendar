<script lang="ts">
  import { fade } from "svelte/transition";
  import { getCalendarCount } from '$lib/dbHelpers';
  import { onMount } from "svelte";

  let calendarUrl = "";
  let subscriptionLink = "";
  let fullSubscriptionLink = ""; // Full URL including the current URL
  let error = "";
  let loading = false;
  let calendarCount = 0;

    // Function to get the count of calendars
    async function fetchCalendarCount() {
    try {
      calendarCount = await getCalendarCount();
    } catch (err) {
      console.error('Error fetching calendar count:', err);
      error = 'Failed to fetch calendar count';
    }
  }

  // Function to submit the calendar URL and fetch the subscription link
  async function submitCalendar(event: Event) {
    event.preventDefault(); // Prevent the default form behavior
    loading = true;
    error = ""; // Clear any previous error
    subscriptionLink = ""; // Clear previous link
    fullSubscriptionLink = ""; // Clear full subscription link

    const formData = new FormData();
    formData.append("calendar_url", calendarUrl);

    try {
      // Send the request to the backend API
      const response = await fetch("/submitCalendar", {
        method: "POST",
        body: formData,
      });

      // Parse the response as JSON
      const data = await response.json();

      // Handle success or error based on the response
      if (response.ok && data.subscriptionLink) {
        subscriptionLink = data.subscriptionLink; // Set the subscription link
        fullSubscriptionLink = `${window.location.origin}${subscriptionLink}`; // Create full URL
      } else {
        error = data.error || "An error occurred";
      }
    } catch (err) {
      error = "Failed to fetch the subscription link";
    } finally {
      loading = false;
    }
  }

  // Copy the full subscription link
  function clipboardCopy() {
    if (fullSubscriptionLink) {
      navigator.clipboard.writeText(fullSubscriptionLink);
      alert("Link copied to clipboard!");
    } else {
      alert("No link available to copy.");
    }
  }

  onMount(() => {
    fetchCalendarCount();
  });
</script>

<div class="flex flex-col gap-4 w-80">
  <div>
    <p class="text-xs">Taking care of {calendarCount} calendars</p>
    <h2 class="text-3xl font-bold">Pretty Calendar CSSci</h2>
    <h2 class="text-end text-sm hover:text-secondary">Now supporting 3rd-year students!</h2>
  </div>

  <form on:submit={submitCalendar} class="flex gap-4">
    <input
      class="input input-bordered w-full max-w-md"
      bind:value={calendarUrl}
      placeholder="Enter Calendar URL"
      required
    />
    <button class="btn btn-accent" type="submit">Submit</button>
  </form>

  {#if loading}
    <div class="flex flex-col text-center">
      <span class="loading loading-dots loading-lg"></span>
      <p class="text-md">Loading... Please wait for the subscription link.</p>
    </div>
  {/if}

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}

  {#if fullSubscriptionLink}
    <div class="flex flex-col text-center" transition:fade>
      <p>Your subscription link:</p>
      <p class="font-bold text-white text-sm max-w-80">
        {fullSubscriptionLink}
      </p>
    </div>
    <button
      class="btn btn-shadow btn-sm"
      on:click={clipboardCopy}
      transition:fade>Copy Link</button
    >
  {/if}
</div>
