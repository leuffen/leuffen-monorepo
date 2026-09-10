import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    nxCopyAssetsPlugin(["README.md"]),
    dts({
      entryRoot: ".",
      tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.join(import.meta.dirname, "index.ts"),
      name: "ViteJekyllHmrManager",
      fileName: (format) => format === "cjs" ? "index.cjs" : "index.js",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vite", "node:path", "node:fs/promises"],
    },
  },
});
