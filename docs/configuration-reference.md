# TableSpark Configuration Reference

This document explains the repository's configuration files as one system. It covers what each file controls, why the current choices exist, and what should be updated together when a setting changes.

## Configuration hierarchy

TableSpark configuration can be grouped into seven areas:

1. runtime/toolchain requirements;
2. TypeScript compilation and strictness;
3. Vite/PWA build behavior;
4. unit/integration testing;
5. browser E2E testing;
6. linting/formatting/editor behavior;
7. Git/environment/repository automation behavior.

A configuration change can affect several areas at once. For example, changing the Node version requires updates to `.nvmrc`, `package.json`, GitHub Actions setup steps, and documentation.

## `package.json`

`package.json` is the central Node project manifest.

### Project metadata

Current metadata identifies:

- package name: `tablespark`;
- package version: `0.1.0`;
- package type: ES modules (`"type": "module"`);
- MIT license;
- author/contact metadata;
- GitHub repository and issue links;
- optional Buy Me a Coffee funding link.

`"private": true` prevents accidental publication to the npm public registry. TableSpark is distributed as a web application/repository, not as a published npm package.

### Runtime engines

```json
"engines": {
  "node": ">=22.12.0",
  "npm": ">=10.0.0"
}
```

These values document the minimum supported local/CI toolchain.

When changing the supported Node version, update:

- `package.json` engines;
- `.nvmrc`;
- `.github/workflows/ci.yml`;
- `.github/workflows/codeql.yml` if its setup depends on Node;
- `.github/workflows/release.yml`;
- `.github/workflows/visual-evidence.yml`;
- `README.md`;
- `docs/setup.md`;
- `docs/development.md`;
- `docs/commands-reference.md`;
- `what_changed.md`.

### Scripts

The manifest defines development, build, formatting, linting, unit/integration testing, E2E testing, repository secret scanning, and the aggregate `check` command. See `docs/commands-reference.md` for a command-by-command explanation.

### Dependencies

Runtime dependencies are intentionally small:

- React;
- React DOM;
- Zod.

Development dependencies cover TypeScript, Vite/PWA build tooling, ESLint/Prettier, Testing Library, Vitest, fast-check, Playwright, type declarations, and coverage tooling.

Adding a dependency should have a clear product/testing/build reason. Prefer a small local function over a new third-party package when the package would add more maintenance/security surface than value.

## `.nvmrc`

Current value:

```text
22.12.0
```

Node version managers such as nvm can use this file to activate the intended development runtime.

Typical nvm workflow:

```bash
nvm install
nvm use
```

The first command installs the version named in `.nvmrc` if missing; the second activates it.

`.nvmrc` is a convenience pin. `package.json` engines remains the broader compatibility contract.

## TypeScript project graph

### `tsconfig.json`

The root TypeScript file is a project-reference coordinator:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

It does not compile source directly. `tsc -b` follows the two referenced projects.

### `tsconfig.app.json`

Purpose: browser application and jsdom-based tests under `src/`.

Important choices:

- target: ES2022;
- libraries: ES2022 + DOM + DOM iterable APIs;
- JSX transform: `react-jsx`;
- module mode: ESNext;
- module resolution: Bundler;
- `strict: true`;
- `noEmit: true` because Vite emits production code;
- no unused locals/parameters;
- no fallthrough switch cases;
- `noUncheckedIndexedAccess: true`;
- `exactOptionalPropertyTypes: true`;
- consistent file-name casing;
- Vite, Vitest, and Testing Library types available.

Why strict settings matter in this project:

- persistence schema changes should break incompatible typed fixtures during development;
- translated message catalogs should expose structural mistakes;
- browser API adapters should not silently treat absent values as present;
- profile/session data access should acknowledge possibly missing indexed entries.

Do not disable strict options to make a feature compile. Fix the actual type relationship or update all affected fixtures/contracts.

### `tsconfig.node.json`

Purpose: Node/tooling and Playwright TypeScript.

Included files:

- `vite.config.ts`;
- `vitest.config.ts`;
- `playwright.config.ts`;
- `e2e/**/*.ts`.

Important choices:

- ES2023 target/library;
- Node types;
- strict checking;
- bundler-style module resolution;
- no emit;
- no unchecked indexed access;
- unused-code/fallthrough checks.

This separation prevents browser globals from being assumed in Node-only config code and keeps Node/E2E typing explicit.

## `vite.config.ts`

Vite is the development and production bundler.

### Plugins

#### React plugin

`@vitejs/plugin-react` enables the React/Vite transform pipeline.

#### `vite-plugin-pwa`

The PWA plugin configures:

- generated service-worker support;
- automatic service-worker update registration behavior;
- inclusion of `logo.svg`;
- the web app manifest;
- Workbox precaching/navigation fallback.

### Manifest settings

The manifest currently defines:

- name/short name: TableSpark;
- description for offline-first multiplication learning;
- theme/background colors;
- standalone display mode;
- root start URL;
- SVG logo as an `any`-sized, maskable-capable icon.

If a production deployment uses a non-root path such as a GitHub Pages project URL, review **all** root-relative paths, `start_url`, Vite `base`, service-worker scope, manifest icon URL, and Workbox fallback before enabling deployment.

### Workbox

Current navigation fallback:

```text
/index.html
```

Current precache glob types:

```text
js, css, html, svg, woff2
```

Core product behavior remains client-side. No runtime remote API cache is configured because the current application has no core remote API.

### Ports

Development:

```text
5173
```

Production preview:

```text
4173
```

Both use `strictPort: true` so tooling fails clearly on a port collision rather than silently changing URLs and confusing browser tests/documentation.

### Production build

- source maps enabled;
- ES2022 build target.

Source maps help debugging but can expose original source structure in a deployed artifact. That is acceptable for this open-source repository; if the threat/distribution model changes, revisit the tradeoff explicitly.

## `vitest.config.ts`

Vitest runs application tests.

Key settings:

- React plugin enabled;
- jsdom environment;
- `src/test/setup.ts` runs before tests;
- mocks are cleared automatically between tests;
- coverage outputs text and HTML reports;
- coverage includes application TypeScript/TSX;
- bootstrap/type declaration/test setup paths are excluded from coverage.

The jsdom environment provides browser-like DOM APIs but is not a real browser engine. Behaviors involving actual service workers, print media, PWA installation, layout engines, or browser navigation must be covered by Playwright/manual testing where meaningful.

## `playwright.config.ts`

Playwright is the production-browser test layer.

### Test location

```text
./e2e
```

### Browser project

Current automated browser project:

```text
chromium
```

It uses Playwright's Desktop Chrome device profile.

### CI behavior

When `CI` is truthy:

- `test.only` is forbidden;
- two retries are permitted;
- one worker is used for determinism/resource control;
- GitHub reporter is used.

Locally:

- no retries by default;
- up to 50% of available workers;
- list reporter.

### Trace behavior

```text
on-first-retry
```

This preserves diagnostic traces when an initially failing test is retried.

### Production preview server

Before E2E, Playwright runs:

```bash
npm run build && npm run preview -- --host 127.0.0.1
```

and waits for:

```text
http://127.0.0.1:4173
```

Locally it may reuse an existing compatible server. CI does not rely on an existing server.

## `eslint.config.js`

The repository uses ESLint flat configuration.

### Ignored generated output

- `dist`;
- `coverage`;
- `playwright-report`;
- `test-results`.

### JavaScript scripts

`scripts/**/*.mjs` uses Node + ES2023 globals.

### TypeScript/TSX

Type-aware strict/stylistic TypeScript configurations are enabled, plus:

- JSX accessibility recommended rules;
- React Hooks recommended rules;
- React Refresh Vite rules;
- consistent type-only imports.

Project-specific adjustments include:

- browser TypeScript uses browser/ES2023 globals;
- `no-undef` is disabled in the typed section because TypeScript provides stronger symbol analysis;
- confusing-void-expression is disabled for project ergonomics;
- misused-promises allows void-returning JSX attributes;
- test files may use non-null assertions.

Changing lint rules should include a repository-wide impact check. Avoid disabling an accessibility rule because one component is difficult to implement correctly.

## Prettier

### `.prettierrc.json`

Current style:

- single quotes;
- trailing commas where supported;
- 100-character print width;
- semicolons.

### `.prettierignore`

Ignored paths currently include:

- generated build/coverage/dependency/test output;
- SVG assets;
- `src/styles.css`;
- `src/status.css`.

Those CSS files are intentionally outside package-script Prettier enforcement. Keep manual edits consistent with the existing style and review them carefully.

### Package formatting scope

`package.json` chooses the exact file globs run by `npm run format` and `npm run format:check`. If a new source/config file type is introduced, decide whether it must be added to those globs.

## `.editorconfig`

EditorConfig provides editor-independent basics:

- UTF-8;
- LF line endings;
- final newline;
- spaces;
- two-space indentation;
- trailing-whitespace removal for ordinary files.

Markdown is the exception:

```ini
[*.md]
trim_trailing_whitespace = false
```

This avoids editors automatically breaking intentional Markdown hard-line-break spacing.

`root = true` prevents a parent-directory EditorConfig from overriding the project unexpectedly.

## `.vscode/extensions.json`

Recommended VS Code extensions:

- `dbaeumer.vscode-eslint`;
- `esbenp.prettier-vscode`.

These are recommendations, not application runtime dependencies. Contributors may use another editor if it can satisfy the repository checks.

## `.vscode/settings.json`

Workspace defaults:

- format on save;
- Prettier as default formatter;
- ESLint flat config enabled;
- ESLint fix-all available explicitly on save;
- VS Code TypeScript uses the workspace `node_modules/typescript/lib` version.

Using the workspace TypeScript version avoids editor diagnostics drifting from CI because of a globally bundled editor TypeScript version.

## `.env.example`

Current content documents that TableSpark requires no secrets or remote services.

The only placeholder is:

```text
VITE_APP_ENV=production
```

Important rules:

- `.env.example` must never contain a real secret;
- `.env` and local variants are ignored by Git;
- any variable starting with `VITE_` can become visible in the browser bundle when referenced by client code;
- therefore **never place credentials, private API keys, passwords, or server-only tokens in a Vite client variable**.

If a future backend is introduced, server secrets need a server-side secret store/environment boundary, not this browser project.

## `.gitignore`

Ignored categories include:

- `node_modules/`;
- production build output (`dist/`);
- coverage/tool caches;
- TypeScript build metadata;
- local environment files;
- OS/editor junk;
- Playwright report/test-result output;
- logs.

The `.vscode/` directory is ignored by default **except** the two intentionally tracked workspace files:

- `.vscode/extensions.json`;
- `.vscode/settings.json`.

Do not force-add ignored generated output without a documented reason.

## `.gitattributes`

Current Git attribute policy:

```text
* text=auto eol=lf
```

This normalizes text files to LF in the repository.

Common raster image types are explicitly marked binary so Git does not attempt text line-ending/diff behavior on them.

If a new binary format is added and Git starts treating it as text, add the format intentionally.

## `index.html`

`index.html` is the Vite HTML entry point. It supplies the application root element and baseline page metadata loaded before React starts.

Changes here affect every page load and should be tested with:

```bash
npm run build
npm run test:e2e
```

Avoid adding remote scripts, analytics, trackers, or third-party runtime dependencies without explicit privacy/security review.

## `src/vite-env.d.ts`

Provides Vite client type declarations to the application TypeScript project.

This is a type-only declaration boundary; it does not execute at runtime.

## GitHub configuration

### `.github/dependabot.yml`

Controls automated dependency-update proposals. Changes affect maintenance traffic and should be reviewed for cadence, ecosystem, target branch, and grouping behavior.

### `.github/release.yml`

Controls GitHub's generated release-note categorization/label mapping. This is different from `.github/workflows/release.yml`, which performs the actual tagged build/package/release automation.

### `.github/FUNDING.yml`

Controls GitHub's repository funding link UI. Funding must remain optional and separate from core learning functionality.

### `.github/ISSUE_TEMPLATE/*`

Controls issue forms/templates and blank-issue/contact-link policy. Templates should never ask users to paste private learner backups or recovery files.

### `.github/pull_request_template.md`

Defines review reminders for contributors. Keep it synchronized with actual quality/security/documentation expectations.

### `.github/workflows/*`

Controls CI, CodeQL, tagged release packaging, and browser release-evidence capture. See `docs/ci-cd.md`.

## Configuration-change checklist

Before committing a configuration change:

1. identify every tool that reads the file;
2. identify duplicated values elsewhere (Node version, ports, paths, release names, etc.);
3. update documentation in the same change series;
4. run the smallest direct check for that config;
5. run `npm run check`;
6. run `npm run test:e2e` for Vite/Playwright/browser-impacting changes;
7. review generated `dist/` behavior without committing `dist/`;
8. update `what_changed.md` if the change affects maintenance/release behavior.

## Values that should stay synchronized

| Concept | Primary locations |
| --- | --- |
| Node version | `.nvmrc`, `package.json`, Actions workflows, setup docs |
| Dev port 5173 | `vite.config.ts`, setup/development docs |
| Preview/E2E port 4173 | `vite.config.ts`, `playwright.config.ts`, testing docs |
| App version | `package.json`, visible About/version copy, changelog/release docs |
| PWA name/description | `vite.config.ts`, README/product copy where appropriate |
| Persistence schema version | `src/domain/types.ts`, migrations, storage validator, schema/privacy docs |
| Session retention options | `src/domain/sessions.ts`, storage validator, Settings UI/copy, docs |
| Supported locales | locale preference/catalog provider, localization docs, tests |
| Release ZIP/checksum names | release workflow, release docs/evidence docs |
| Required checks | CI workflows, repository-settings docs, quality-gates docs |

Treat a mismatch in these synchronized values as a maintenance defect even if the application still compiles.
