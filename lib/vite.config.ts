import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      name: "easy-mesh-gradient",
      entry: "src/index.ts",
    },
  },
});
