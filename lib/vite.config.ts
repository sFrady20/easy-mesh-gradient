import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
    }),
  ],
  build: {
    lib: {
      name: "easy-mesh-gradient",
      entry: "src/index.ts",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
  },
});
