# @leuffen/demo

Reference package showing the standard configuration for packages in this monorepo.

## Usage

```ts
import { greet } from '@leuffen/demo';

greet('Leuffen');
```

## Development

From the repository root:

```bash
npx nx build @leuffen/demo
npx nx test @leuffen/demo
npx nx lint @leuffen/demo
npx nx typecheck @leuffen/demo
```

The package uses Vite for its distributable ESM build, Vitest for tests, and TypeScript project references for type checking.
