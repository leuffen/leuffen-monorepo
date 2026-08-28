/// <reference types="vitest" />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

const dirName = 'packages/demo';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: `../../node_modules/.vite/${dirName}`,
  css: {
    devSourcemap: true,
  },
  esbuild: {
    sourcemap: true,
  },
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md', '*.css', 'skills/**/*']),
    dts({
      entryRoot: '.',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: path.join(import.meta.dirname, 'index.ts'),
      name: '@leuffen/demo',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
  test: {
    passWithNoTests: true,
    watch: false,
    globals: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: `../../coverage/${dirName}`,
    },
    environment: 'node',
    include: ['*.spec.ts'],
    reporters: ['default'],
  },
}));
