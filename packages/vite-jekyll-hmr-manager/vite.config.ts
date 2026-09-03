import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: ".",
      tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    lib: {
      entry: path.join(import.meta.dirname, "index.ts"),
      name: "ViteJekyllHmrManager",
      fileName: (format) => format === "cjs" ? "index.cjs" : "index.js",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vite", "node:path"],
    },
  },
});
