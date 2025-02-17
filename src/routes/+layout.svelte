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
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "bubble",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 80,
            duration: 2,
            opacity: 1,
            size: 6,
          },
        },
      },
      links: {
        enable: true,
        color: "#03A9F4",
      },
      move: {
        enable: true,
        speed: 1,
      },
      size: {
        value: 5,
        random: {
          enable: true,
          minimumValue: 1,
        },
        animation: {
          enable: false,
          speed: 2.5,
          minimumValue: 1,
        },
      },
      opacity: {
        value: 0.2,
        random: {
          enable: true,
          minimumValue: 0.4,
        },
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
  <div class="hero-content flex flex-col lg:flex-row justify-center gap-12">
    <div class="">
      <slot />
    </div>
    <div class="max-w-xl  backdrop-blur-sm backdrop-opacity-60">
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
  <footer
    class="footer footer-center absolute text-base-content p-2 bottom-0 w-full text-xs"
  >
    <aside class="flex justify-between w-full">
      <p>
        Lukas Pesek - {new Date().getFullYear()}
      </p>
      <a
        class="link hidden"
        href="https://github.com/iGlody/CSSci_Pretty_Calendar"
        target="_blank"
      >
        Github
      </a>
    </aside>
  </footer>
</div>


<style>
	.hide {
		transform: translateY(-100%);
	}

	.show {
		transform: translateY(0%);
	}

	@keyframes -global-from-bottom {
		0% {
			transform: translateY(10vw);
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		75% {
			opacity: 0.5;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes -global-from-right {
		0% {
			transform: translateX(100vw);
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		75% {
			opacity: 0.5;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}
	@keyframes -global-from-left {
		0% {
			transform: rotateX(50deg) translateX(-200vw) skewX(-50deg);
			opacity: 1;
		}
		100% {
			transform: rotateX(0deg) translateX(0) skewX(0deg);
			opacity: 1;
		}
	}
</style>