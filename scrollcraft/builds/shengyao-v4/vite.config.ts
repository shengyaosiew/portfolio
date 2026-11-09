import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" keeps every asset path relative, so the build works from any
// GitHub Pages sub-path (e.g. /portfolio/) without a rebuild.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
