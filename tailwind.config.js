/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  daisyui: {
    themes: [
      {
        customtheme: {
          primary: "#4CAF50",
          secondary: "#FF9800",
          accent: "#03A9F4",
          neutral: "#1E1E1E",
          "base-100": "#2E2E2E",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          error: "#F44336",
        },
      },
    ],
  },
  theme: {
    fontFamily: {
      sans: ["'Cabin'", "sans-serif"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
