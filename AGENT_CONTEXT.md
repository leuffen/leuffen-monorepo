# Agent Context Cache

Last updated: 2026-08-28

> This file was created automatically by a coding agent as an onboarding context cache.
> Cached repository facts for coding agents. Use this as a baseline before
> running broad discovery commands. Verify and update focused sections when
> errors or task requirements indicate stale information.

## Project identity

| Key | Value |
| --- | --- |
| Repository root | `/opt` |
| Git remote | `git@github.com:leuffen/leuffen-monorepo.git` |
| Default branch | `main` |
| Package manager | `npm` |
| Lockfile | `package-lock.json` |
| Node requirement | `>=22` |

Last verified: 2026-08-28

## Workspace and tools

| Tool | Configuration |
| --- | --- |
| Nx schema | `./node_modules/nx/schemas/nx-schema.json` |
| Nx preset | `nx/presets/npm.json` |
| Workspace packages | `packages/*` |
| Workspace libs dir | `packages` |
| Release relationship | `independent` |
| Release projects | `packages/*` |
| Release pre-version command | `npx nx run-many -t build` |
| Release update dependents | `never` |
| Package project configs | `packages/*/project.json` |
| Package build output | `dist/{projectRoot}` (for example `dist/packages/announcements`) |
| Release publish package root | `dist/{projectRoot}` via `nx-release-publish` targets |
| Publish workflow | `.github/workflows/publish.yml` |
| CI workflow | `.github/workflows/ci.yml` |

Last verified: 2026-08-28

## Packages

| Package | Path | Version | Publish notes |
| --- | --- | --- | --- |
| `@leuffen/announcements` | `packages/announcements` | `0.2.0` | public package; minor release tag `@leuffen/announcements@0.2.0` created locally on 2026-08-28; first npm publish completed and trusted publishing configured on 2026-08-28 |
| `@leuffen/demo` | `packages/demo` | `0.0.0` | public package metadata; reference/demo package |

Last verified: 2026-08-28

## Workflows

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `.github/workflows/publish.yml` | push tags matching `**@*.*.*` | install, verify tagged package, publish with `nx release publish --provenance` |
| `.github/workflows/ci.yml` | verify file when CI behavior matters | CI workflow exists |

Last verified: 2026-08-28

## Frequently used files

| Purpose | Path | Notes |
| --- | --- | --- |
| Root package manifest | `package.json` | npm workspaces, scripts, dev dependencies, `nx.includedScripts` |
| npm lockfile | `package-lock.json` | required so Nx external dependency resolution works reliably |
| Nx config | `nx.json` | workspace layout, inferred target names, release setup |
| Nx ignore file | `.nxignore` | excludes `.agents`, `dist`, `coverage`, and `node_modules` from project graph scanning |
| Vitest workspace | `vitest.workspace.ts` | includes package Vite/Vitest configs |
| Root TypeScript config | `tsconfig.base.json` | shared TS compiler options and paths |
| ESLint config | `eslint.config.mjs` | repository lint setup with Nx dependency checks |
| Publish workflow | `.github/workflows/publish.yml` | tag-based npm publish workflow; tag pattern must use `**` because scoped package tags contain `/` |
| Announcements manifest | `packages/announcements/package.json` | package metadata for dist-root publishing (`main`/`types` point to root files) |
| Announcements Nx project config | `packages/announcements/project.json` | build to `dist/packages/announcements`, publish from that dist root |
| Announcements usage info | `packages/announcements/.ai-usage-info.md` | usage examples and constraints |
| Announcements README | `packages/announcements/README.md` | package documentation |
| Announcements entrypoint | `packages/announcements/index.ts` | public exports and component registration |

Last verified: 2026-08-28

## Monorepo package/component paths

| Name | Path | Description |
| --- | --- | --- |
| `@leuffen/announcements` | `packages/announcements` | time-bound announcements and vacation modal package |
| `OfficeHours` | `packages/announcements/src/office-hours.ts` | vacation/open-hours business logic |
| `leuffen-announcements` | `packages/announcements/src/leuffen-announcements.ts` | announcement list web component |
| `leuffen-vacation-modal` | `packages/announcements/src/leuffen-vacation-modal.ts` | hidden controller that opens the vacation dialog |
| `LeuffenVacationDialog` | `packages/announcements/src/leuffen-vacation-dialog.ts` | programmatic vacation dialog presentation |
| Announcement tests | `packages/announcements/src/components.spec.ts` | component behavior tests |
| OfficeHours tests | `packages/announcements/src/office-hours.spec.ts` | business logic tests |
| `@leuffen/demo` | `packages/demo` | reference/demo package |
| Demo Nx project config | `packages/demo/project.json` | build to `dist/packages/demo`, publish from that dist root |

Last verified: 2026-08-28

## Useful commands

```bash
# list Nx projects
npx nx show projects

# verify announcements package
npx nx run-many -p @leuffen/announcements -t lint typecheck test build

# dry-run npm package contents after build
cd dist/packages/announcements
npm pack --dry-run

# first/manual publish for announcements from build output, after the user ran npm login
cd dist/packages/announcements
npm publish --access public

# verify trusted publishing
npm trust list @leuffen/announcements

# configure trusted publishing after first publish, if missing
npm trust github @leuffen/announcements \
  --repo leuffen/leuffen-monorepo \
  --file publish.yml \
  --allow-publish \
  --yes
```

## Known facts from previous sessions

- `npm login` is the correct user command for npm authentication in this environment.
- `@leuffen/announcements` first manual publish was completed on 2026-08-28.
- `@leuffen/announcements@0.1.1` patch release commit/tag was created locally on 2026-08-28 with `npx nx release patch --skip-publish -p @leuffen/announcements`.
- `@leuffen/announcements@0.2.0` minor release commit/tag was created locally on 2026-08-28 with `npx nx release minor --skip-publish -p @leuffen/announcements`; push with tags to trigger publishing.
- Trusted publishing for `@leuffen/announcements` was configured on 2026-08-28:
  - type: `github`
  - id: `7c11ff5b-722b-481f-9a2e-bc739e395b2b`
  - repository: `leuffen/leuffen-monorepo`
  - workflow file: `publish.yml` (verify with `npm trust list`; previous cache may have referred to `publish-tags.yml`)
  - permissions: `publish`
- After publish/trust setup, `npm dist-tag ls @leuffen/announcements` returned `latest: 0.1.0` and `npm access get status` returned `public`; `npm view` and `npm owner ls` still returned `404` at 2026-08-28 11:17 UTC, likely registry/API propagation or npm endpoint inconsistency. Recheck later if needed.
- `packages/announcements/package.json` should include repository metadata:
  - `type`: `git`
  - `url`: `git+https://github.com/leuffen/leuffen-monorepo.git`
  - `directory`: `packages/announcements`
- `@leuffen/announcements` verification succeeded on 2026-08-28 for lint, typecheck, test, and build.
- `npm install --package-lock-only --ignore-scripts` may be needed after dependency install if Nx cannot resolve external dependencies because no lockfile exists.

## Cache maintenance notes

- Update package versions after `nx release` or manual version changes.
- Update npm publish/trust status after npm commands succeed.
- Update workflow names when files under `.github/workflows/` change.
- Keep frequently used file and component paths current after moves or renames.
- Keep this file at or below 500 lines; if it exceeds that, suggest trimming or moving details to package-local skills.
- Keep this file concise; remove stale facts instead of adding contradictory history.
