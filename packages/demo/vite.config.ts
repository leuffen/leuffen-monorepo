import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    outDir: 'dist',
  },
  plugins: [
    dts({
      entryRoot: '.',
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
    environment: 'node',
    include: ['*.spec.ts'],
  },
});
