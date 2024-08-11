import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCSS()],
  resolve: {
    alias: {
      "easy-mesh-gradient": join(__dirname, "../lib/src/index.ts"),
    },
  },
});
