import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to source files for hot reload during development
      "easy-mesh-gradient": resolve(__dirname, "../lib/src/index.ts"),
      "easy-mesh-gradient/types": resolve(__dirname, "../lib/src/types.ts"),
      "easy-mesh-gradient/easings": resolve(__dirname, "../lib/src/easings.ts"),
      "easy-mesh-gradient/generators": resolve(__dirname, "../lib/src/generators.ts"),
      "easy-mesh-gradient/validation": resolve(__dirname, "../lib/src/validation.ts"),
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
