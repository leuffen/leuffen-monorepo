/// <reference types="vitest" />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

const dirName = 'packages/announcements';

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
    nxCopyAssetsPlugin(['*.md', '.ai-usage-info.md', 'skills/**/*', '.agents/skills/**/*']),
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
      name: '@leuffen/announcements',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['@nextrap/nte-dialog-component', 'lit', /^lit\//],
    },
  },
  test: {
    passWithNoTests: true,
    watch: false,
    globals: true,
    alias: {
      '@nextrap/nte-dialog-component': path.join(
        import.meta.dirname,
        'test/nte-dialog-component.stub.ts',
      ),
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: `../../coverage/${dirName}`,
    },
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
  },
}));
