import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess(),

  kit: {
    adapter: adapter()
  }
};

export default config;
