<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import ShowCase from "$lib/components/showCase.svelte";
  import Tutorial from "$lib/components/tutorial.svelte";

  import { inject } from "@vercel/analytics";
  import { dev } from "$app/environment";

  import { particlesInit } from "@tsparticles/svelte";
  import { loadSlim } from "@tsparticles/slim";

  let ParticlesComponent;

  let showTut = false;

  // Function to automatically toggle between images
  function showTutorial() {
    showTut = !showTut;
  }

  onMount(async () => {
    inject({ mode: dev ? "development" : "production" });

    const module = await import("@tsparticles/svelte");

    ParticlesComponent = module.default;
  });

  let particlesUrl =
    "https://cdn.jsdelivr.net/npm/@tsparticles/preset-triangles@3/tsparticles.preset.triangles.bundle.min.js"; // placeholder, replace it with a real url

  let particlesConfig = {
    particles: {
      color: {
        value: "#2E2E2E",
      },
      links: {
        enable: true,
        color: "#03A9F4",
      },
      move: {
        enable: true,
      },
      number: {
        value: 100,
      },
    },
  };

  let onParticlesLoaded = (event) => {
    const particlesContainer = event.detail.particles;
  };

  void particlesInit(async (engine) => {
    await loadSlim(engine);
  });
</script>

<div class="hero w-full h-dvh">
  <svelte:component
    this={ParticlesComponent}
    id="tsparticles"
    class="put your classes here"
    style=""
    options={particlesConfig}
    on:particlesLoaded={onParticlesLoaded}
  />
  <div class="hero-content flex justify-center gap-12 flex-wrap">
    <div>
      <slot />
    </div>
    <div>
      <div class="mb-6 flex justify-center">
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
      {#if !showTut}
        <ShowCase />
      {:else}
        <Tutorial />
      {/if}
    </div>
  </div>
</div>
