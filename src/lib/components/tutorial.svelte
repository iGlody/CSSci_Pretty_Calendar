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

  function setCount(value: number) {
    count.set(value); // Set the count based on hover
  }

  onMount(() => {
    //interval = setInterval(addCount, 2000);
    //return () => clearInterval(interval); // Cleanup interval on component destroy
  });
</script>

<ul class="steps steps-vertical sm:text-md w-full">
  <li
    class="step text-left hover:font-bold"
    class:step-primary={$count > 0}
    on:mouseenter={() => setCount(1)}
  >
    <span class="">
      Go to <a
        href="https://rooster.uva.nl/schedule"
        target="_blank"
        class="text-accent">Rooster UVA.</a
      >
    </span>
  </li>
  <li
    class="step text-left hover:font-bold mr-8 hover:mr-0"
    class:step-primary={$count > 1}
    on:mouseenter={() => setCount(2)}
  >
    <span>
      In the top-right corner, click on the Connect Calendar feature
    </span>
  </li>
  <li
    class="step text-left hover:font-bold"
    class:step-primary={$count > 2}
    on:mouseenter={() => setCount(3)}
  >
    Click Next and copy the provided subscription link
  </li>
  <li
    class="step text-left hover:font-bold"
    class:step-primary={$count > 3}
    on:mouseenter={() => setCount(4)}
  >
    Paste the calendar subscription link you copied
  </li>
  <li
    class="step text-left hover:font-bold"
    class:step-primary={$count > 4}
    on:mouseenter={() => setCount(5)}
  >
    Click Submit to generate a new, filtered calendar link.
  </li>
  <li
    class="step text-left hover:font-bold"
    class:step-primary={$count > 5}
    on:mouseenter={() => setCount(6)}
  >
    After submitting, you will receive a new subscription link.
  </li>
  <li
    class="step text-left hover:font-bold"
    class:step-primary={$count > 6}
    on:mouseenter={() => setCount(7)}
  >
    Copy this new link and use it in your preferred calendar app
  </li>
</ul>
