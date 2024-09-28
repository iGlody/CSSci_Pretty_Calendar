/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ["'Cabin'", 'sans-serif']
    },
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}