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
      },
      backdropBlur: {
      xs: "2px",
    },
    animation: {
      fadeIn: "fadeIn 0.3s ease-in",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
