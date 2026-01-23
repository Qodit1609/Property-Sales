/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: [
          "DomineWebRegular",
          "Georgia",
          "Palatino Linotype",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};
