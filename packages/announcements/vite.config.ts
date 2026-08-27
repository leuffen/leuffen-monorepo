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
    rollupOptions: {
      external: ['@nextrap/nte-dialog-component', 'lit', 'temporal-polyfill'],
    },
  },
  plugins: [
    dts({
      entryRoot: '.',
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  test: {
    alias: {
      '@nextrap/nte-dialog-component': resolve(
        import.meta.dirname,
        'test/nte-dialog-component.stub.ts',
      ),
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
  },
});
