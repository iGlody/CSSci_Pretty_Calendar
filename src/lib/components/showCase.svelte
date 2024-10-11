<script lang="ts">
  import { onMount } from "svelte";

  import oldCal from "$lib/img/old_small.png?enhanced";
  import newCal from "$lib/img/new_small.png?enhanced";

  let showNewCal = false; // Variable to track which calendar to show
  let interval: NodeJS.Timeout;
  let paused = false;

  // Function to switch between images based on the button press
  function manualSwitchCalendar(isNewCal: boolean) {
    // Set the appropriate image based on button press
    showNewCal = isNewCal;

    // Pause the automatic switching for 3 seconds
    if (!paused) {
      paused = true;
      clearInterval(interval);

      setTimeout(() => {
        paused = false;
        interval = setInterval(autoSwitchCalendar, 3000); // Resume automatic switching after 3 seconds
      }, 3000);
    }
  }

  // Function to automatically toggle between images
  function autoSwitchCalendar() {
    showNewCal = !showNewCal;
  }

  // Automatically switch images every 2 seconds
  onMount(() => {
    interval = setInterval(autoSwitchCalendar, 3000);

    return () => clearInterval(interval); // Cleanup interval on component destroy
  });
</script>

<div class="flex flex-col px-8">
  <!-- Image container with fixed position for both images -->
  <div class="relative max-w-md shadow-lg w-full">
    {#if showNewCal}
      <enhanced:img src={newCal} alt="" />
    {:else}
      <enhanced:img src={oldCal} alt="" />
    {/if}
  </div>
  <div class="flex justify-center join max-w-md mt-6">
    <button
      class="join-item btn btn-sm btn-outline"
      class:btn-error={!showNewCal}
      class:btn-outline={showNewCal}
      on:click={() => manualSwitchCalendar(false)}>Old</button
    >
    <button
      class="join-item btn btn-sm btn-outline"
      class:btn-accent={showNewCal}
      class:btn-outline={!showNewCal}
      on:click={() => manualSwitchCalendar(true)}>New</button
    >
  </div>
</div>
