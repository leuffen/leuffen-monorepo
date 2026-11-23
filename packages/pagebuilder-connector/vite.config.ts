/// <reference types="vitest" />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

const dirName = 'packages/pagebuilder-connector';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: `../../node_modules/.vite/${dirName}`,
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md', '.ai-usage-info.md']),
    dts({
      entryRoot: '.',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.join(import.meta.dirname, 'index.ts'),
      name: '@leuffen/pagebuilder-connector',
      fileName: 'index',
      formats: ['es'],
    },
  },
  test: {
    passWithNoTests: true,
    watch: false,
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
  },
}));
