import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/LensandLayers/ on GitHub Pages
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/LensandLayers/" : "/",
  plugins: [react()],
}));
