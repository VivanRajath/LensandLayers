import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Main site plus the static legal pages (served as /privacy and /terms on Cloudflare Pages).
      input: {
        main: "index.html",
        privacy: "privacy.html",
        terms: "terms.html",
      },
    },
  },
});
