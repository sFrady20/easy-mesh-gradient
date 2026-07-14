import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Point to source files for hot reload during development
      "easy-mesh-gradient": resolve(__dirname, "../lib/src/index.ts"),
    },
  },
  optimizeDeps: {
    // Exclude from pre-bundling to use source files directly
    exclude: ["easy-mesh-gradient"],
  },
  server: {
    watch: {
      // Watch the lib directory for changes
      ignored: ["!**/lib/**"],
    },
  },
});
