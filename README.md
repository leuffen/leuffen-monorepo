# @leuffen/source

Nx monorepo for packages in the `@leuffen` scope.

## Requirements

- Node.js 22 or newer
- npm

## Setup

```bash
npm install
```

## Structure

All projects live directly below `packages/`. There are intentionally no separate app, demo, or experimental roots.

```text
packages/
└── <package-name>/
```

## Common commands

```bash
npm run build
npm run test
npm run lint
npm run typecheck
npm run graph
npm run format
```

Run a target for a single package with `npx nx <target> <package-name>`.

## Create a package

```bash
npx nx g @nx/js:library packages/<package-name> --bundler=tsc --unitTestRunner=none
```

Nx infers standard targets from package configuration. Add a `project.json` only when a package needs targets or options that cannot be inferred.

## Releases

Packages are versioned independently:

```bash
npx nx release --skip-publish -p <package-name>
```

Publishing automation should be added together with the first publishable package so its registry, scope, and test requirements are explicit.
