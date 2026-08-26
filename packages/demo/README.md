# @leuffen/demo

Reference package showing the standard configuration for packages in this monorepo.

## Usage

```ts
import { greet } from '@leuffen/demo';
import '@leuffen/demo/index.css';

greet('Leuffen');
```

During development, the entrypoints are available directly as `packages/demo/index.ts` and `packages/demo/index.css`.

## Development

From the repository root:

```bash
npx nx build @leuffen/demo
npx nx test @leuffen/demo
npx nx lint @leuffen/demo
npx nx typecheck @leuffen/demo
```

Build output is written to the package-local `packages/demo/dist/` directory so the same package can be published without a copy step.
