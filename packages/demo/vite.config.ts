import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    outDir: '../../dist/packages/demo',
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/packages/demo',
    },
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
