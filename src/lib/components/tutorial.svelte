<script lang="ts">
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store"; // Helper to get store value and writable store
  import { fade, fly } from "svelte/transition";

  let interval: NodeJS.Timeout;
  const count = writable(1); // Store to keep track of count

  function addCount() {
    if ((get(count) as number) > 7) {
      count.set(0); // Reset count to 1
    } else {
      count.update((n: number) => n + 1); // Increment count
    }
  }

  onMount(() => {
    interval = setInterval(addCount, 2000);

    return () => clearInterval(interval); // Cleanup interval on component destroy
  });
</script>

<ul class="steps steps-vertical text-md w-full w-lg">
  <li class="step text-left" class:step-primary={$count > 0}>
    <span class="">
      Go to <a
        href="https://rooster.uva.nl/schedule"
        target="_blank"
        class="text-accent">Rooster UVA.</a
      >
    </span>
  </li>
  <li class="step text-left" class:step-primary={$count > 1}>
    <span>
      In the top-right corner, click on the Connect Calendar feature.
    </span>
  </li>
  <li class="step text-left" class:step-primary={$count > 2}>
    Click Nest and copy the provided subscription link
  </li>
  <li class="step text-left" class:step-primary={$count > 3}>
    Paste the calendar subscription link you copied
  </li>
  <li class="step text-left" class:step-primary={$count > 4}>
    Click Submit to generate a new, filtered calendar link.
  </li>
  <li class="step text-left" class:step-primary={$count > 5}>
    After submitting, you will receive a new subscription link.
  </li>
  <li class="step text-left" class:step-primary={$count > 6}>
    Copy this new link and use it in your preferred calendar app
  </li>
</ul>
