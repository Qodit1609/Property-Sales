/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
],
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

      /* ✅ GLOBAL COLORS ADDED */
      colors: {
        b1: "var(--b1)",
        b2: "var(--b2)",
        fg: "var(--fg)",

        /* Semantic colors used by common components */
        primary: "var(--b1)",
        secondary: "var(--b2)",
        muted: "var(--muted)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
