import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      outDirs: ["dist", { dir: "dist", moduleFormat: "cjs" }],
      beforeWriteFile: (filePath, content) =>
        filePath.endsWith(".d.cts")
          ? {
              content: content.replace(
                /(["'])(\.\.?\/[^"']+)\.js\1/g,
                "$1$2.cjs$1"
              ),
            }
          : undefined,
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
        exports: "named",
      },
    },
  },
});
