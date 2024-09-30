<script>
  import "../app.css";

  import ShowCase from "$lib/components/showCase.svelte";
  import Tutorial from "$lib/components/tutorial.svelte";

  let showTut = true;

  // Function to automatically toggle between images
  function showTutorial() {
    showTut = !showTut;
  }
</script>

<div class="hero w-full h-dvh">
  <div class="hero-content flex justify-center gap-12 flex-wrap">
    <div>
      <slot />
    </div>
    <div>
      {#if !showTut}
        <ShowCase />
      {:else}
        <Tutorial />
      {/if}
      <div class="mt-6 flex justify-center">
        <button
          class="btn btn-sm"
          class:btn-accent={showTut}
          class:btn-primary={!showTut}
          on:click={showTutorial}
        >
          {#if !showTut}
            How to set up the calendar?
          {:else}
            Show Example
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
