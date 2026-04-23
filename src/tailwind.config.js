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

        /* Semantic colors used by common components (Button, Input, admin forms) */
        primary: "var(--b1)",
        secondary: "var(--b2)",
        muted: "var(--muted)",
        foreground: "var(--b1)",
        border: "var(--b2)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  /* line-clamp utilities are built into Tailwind v4 */
  plugins: [],
};
