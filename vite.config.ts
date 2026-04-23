import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const devApiTarget =
  process.env.VITE_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "http://localhost:5000";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: devApiTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});