# TableSpark Command Reference

This document explains the repository commands, what each command actually does, when to use it, what it produces, and common failure modes. It is written for contributors who may be new to Node.js tooling as well as maintainers preparing a release.

## Command environment

Run project commands from the repository root, the directory that contains `package.json`.

Supported runtime baseline from `package.json`:

- Node.js `>=22.12.0`
- npm `>=10.0.0`

The repository also contains `.nvmrc` so Node version managers can select the intended Node release line.

Check your installed versions:

```bash
node --version
npm --version
```

The first command prints the active Node.js runtime. The second prints the npm package-manager version.

## Installation

### `npm install`

```bash
npm install
```

Meaning:

- reads `package.json`;
- resolves the declared application and development dependencies;
- installs them under `node_modules/`;
- creates/updates npm's local dependency metadata as applicable to the environment.

Use this after cloning the repository and whenever dependency declarations change.

CI intentionally uses:

```bash
npm install --no-fund --no-audit
```

`--no-fund` suppresses npm's funding-summary output during installation. `--no-audit` prevents the install step from performing a separate audit because the repository has an explicit production-audit gate later in CI.

## Development server

### `npm run dev`

```bash
npm run dev
```

Expands to:

```bash
vite
```

Purpose:

- starts Vite's development server;
- serves the application from source with fast development transforms;
- defaults to port `5173` because `vite.config.ts` fixes that port with `strictPort: true`.

Default development URL:

```text
http://localhost:5173
```

If port 5173 is already occupied, Vite fails instead of silently choosing another port because `strictPort` is enabled. Stop the conflicting process or intentionally change the configuration in a reviewed commit.

The development server is not release evidence. Production behavior should be checked through `npm run build` plus `npm run preview` or Playwright's production-preview server.

## Production build

### `npm run build`

```bash
npm run build
```

Expands to:

```bash
tsc -b && vite build
```

This is two commands joined with `&&`, which means Vite builds only if TypeScript succeeds.

Step 1 — `tsc -b`:

- runs TypeScript build mode;
- follows the project references declared in `tsconfig.json`;
- validates application and Node/config TypeScript projects;
- stops the build on type errors.

Step 2 — `vite build`:

- creates the optimized production web application;
- applies the PWA plugin configuration;
- emits static files into `dist/`;
- creates source maps because `vite.config.ts` enables `build.sourcemap`;
- targets modern ES2022-capable browsers/runtime behavior.

The `dist/` directory is generated output and must not be hand-edited.

## Production preview

### `npm run preview`

```bash
npm run preview
```

Expands to:

```bash
vite preview
```

Purpose:

- serves the already-built production output;
- defaults to port `4173` with `strictPort: true`;
- lets maintainers test the actual built application rather than the development transform pipeline.

Default preview URL:

```text
http://localhost:4173
```

Run `npm run build` first if no current `dist/` exists.

Playwright starts preview automatically through `playwright.config.ts`.

## Type checking

### `npm run typecheck`

```bash
npm run typecheck
```

Expands to:

```bash
tsc -b --pretty false
```

Purpose:

- checks the TypeScript project graph without relying on the production bundle step;
- uses plain machine-readable terminal formatting because `--pretty false` disables color/decorative output;
- catches invalid imports, type mismatches, unsupported object shapes, missing locale messages, invalid test fixtures, and strict-mode issues.

Run this after changing TypeScript domain types, persistence schemas, message catalogs, React props/state, or tooling configuration.

## Linting

### `npm run lint`

```bash
npm run lint
```

Expands to:

```bash
eslint . --max-warnings 0
```

Meaning:

- scans the repository files covered by `eslint.config.js`;
- applies JavaScript, TypeScript, React Hooks, React Refresh, and JSX accessibility rules;
- treats every warning as a failing result because `--max-warnings 0` is used.

Important lint configuration choices:

- strict type-aware TypeScript linting is enabled;
- consistent type-only imports are required;
- recommended `jsx-a11y` rules are enabled;
- test files may use non-null assertions where needed for focused fixtures;
- generated directories such as `dist`, coverage output, Playwright reports, and test results are ignored.

Do not solve lint errors by globally disabling rules unless the project has a documented reason. Prefer the smallest correct code change.

## Formatting

### `npm run format`

```bash
npm run format
```

Runs Prettier in write mode over the repository's TypeScript/TSX, E2E, script, root config, and VS Code JSON patterns.

Use this when a formatting check fails locally.

The command intentionally writes files, so review the diff afterward:

```bash
git diff
```

### `npm run format:check`

```bash
npm run format:check
```

Runs the same Prettier path patterns in verification mode instead of modifying files.

Use this before committing and in CI. A failure means one or more covered files differ from the project's formatting rules.

Markdown documentation is not currently part of the package-level Prettier command. Markdown quality is instead protected by repository review and local-link validation.

## Application tests

### `npm run test`

```bash
npm run test
```

Expands to:

```bash
vitest run
```

Meaning:

- starts Vitest once;
- uses the jsdom browser-like environment configured in `vitest.config.ts`;
- loads `src/test/setup.ts` before tests;
- runs domain, infrastructure, integration, localization, state/UI, and component tests;
- exits when the test suite finishes.

This is the normal non-watch test command used by `npm run check`.

### `npm run test:watch`

```bash
npm run test:watch
```

Expands to:

```bash
vitest
```

Purpose:

- keeps Vitest open;
- watches source files;
- reruns affected tests while developing.

Do not use watch mode as release verification because it is interactive and does not represent a single immutable pass.

### `npm run test:coverage`

```bash
npm run test:coverage
```

Expands to:

```bash
vitest run --coverage
```

Coverage configuration:

- V8-based coverage provider through the installed Vitest coverage package;
- text summary in the terminal;
- HTML coverage report;
- includes `src/**/*.{ts,tsx}`;
- excludes browser bootstrap/type declaration/test setup paths documented in `vitest.config.ts`.

Coverage is diagnostic evidence, not a substitute for meaningful assertions.

## Browser end-to-end tests

### Browser installation

On a new machine:

```bash
npx playwright install chromium
```

On Linux/CI where system libraries may also be missing:

```bash
npx playwright install --with-deps chromium
```

`npx` runs the locally installed Playwright command from the project dependency set.

### `npm run test:e2e`

```bash
npm run test:e2e
```

Expands to:

```bash
playwright test
```

Playwright behavior from `playwright.config.ts`:

- tests live in `e2e/`;
- Chromium is the configured project;
- Playwright starts `npm run build && npm run preview -- --host 127.0.0.1` automatically;
- the browser tests use `http://127.0.0.1:4173`;
- tests can run in parallel locally;
- CI uses one worker and up to two retries;
- a trace is retained on first retry;
- committed `test.only` is forbidden in CI.

Because Playwright builds and previews the production app, E2E failures can reveal integration problems that jsdom tests cannot.

### Run one E2E file

```bash
npx playwright test e2e/smoke.spec.ts
```

Replace the file with another spec as needed, for example:

```bash
npx playwright test e2e/print.spec.ts
npx playwright test e2e/localization.spec.ts
npx playwright test e2e/localized-errors.spec.ts
npx playwright test e2e/accessibility.spec.ts
```

### Run one named test

```bash
npx playwright test -g "Hindi interface selection persists across reload"
```

`-g` filters tests by title. Use a sufficiently specific title to avoid selecting unrelated tests.

## Visual release evidence

The release-evidence Playwright spec is intentionally skipped during normal E2E unless the explicit environment flag is set.

Generate the real browser screenshots locally with:

```bash
CAPTURE_RELEASE_EVIDENCE=1 npx playwright test e2e/release-evidence.spec.ts
```

On Windows PowerShell:

```powershell
$env:CAPTURE_RELEASE_EVIDENCE='1'
npx playwright test e2e/release-evidence.spec.ts
```

Generated screenshots are written under:

```text
test-results/release-evidence/
```

The GitHub workflow `.github/workflows/visual-evidence.yml` runs the same spec in Chromium and uploads the screenshots as an Actions artifact. These are real browser captures from the built application, not manually drawn release screenshots.

## Repository security tests

### `npm run test:security`

```bash
npm run test:security
```

Expands to:

```bash
node --test scripts/secret-scanner.test.mjs
```

Purpose:

- uses Node's built-in test runner;
- validates the dependency-free repository secret-scanner implementation;
- confirms supported credential signatures are detected;
- confirms ordinary text remains clean;
- verifies reported findings do not echo matched credential values.

This command tests the scanner implementation. It does not scan the repository itself.

### `npm run secret:scan`

```bash
npm run secret:scan
```

Expands to:

```bash
node scripts/secret-scan.mjs
```

Purpose:

- walks the intended repository files;
- uses `scripts/secret-scanner.mjs` to test supported credential patterns;
- reports safe finding metadata instead of printing the full matched secret.

A clean scan is defense in depth, not proof that no secret exists. Real exposed credentials must be revoked/rotated even if a later scanner run is clean.

## Documentation link checking

The repository includes the link-checker implementation and tests even though no dedicated package script is currently declared.

Run its tests directly:

```bash
node --test scripts/link-checker.test.mjs
```

Run the repository local-link check directly:

```bash
node scripts/link-check.mjs
```

The check focuses on local Markdown/documentation references. It is designed to catch broken repository paths without depending on remote network availability.

If these commands become a formal package-level gate later, update `package.json`, `docs/testing.md`, `docs/quality-gates.md`, CI, and this document together.

## Full local quality gate

### `npm run check`

```bash
npm run check
```

Expands to this exact sequence:

```text
npm run format:check
&& npm run lint
&& npm run typecheck
&& npm run test
&& npm run test:security
&& npm run secret:scan
&& npm run build
```

Because the steps use `&&`, the command stops at the first failure.

Interpretation:

1. formatting must be clean;
2. lint/accessibility rules must be clean;
3. TypeScript must compile under strict project settings;
4. application tests must pass;
5. secret-scanner tests must pass;
6. repository secret scan must pass;
7. the production PWA must build.

`npm run check` does **not** include Playwright E2E or a network-dependent dependency audit. CI runs those as separate gates.

Recommended pre-PR sequence:

```bash
npm run check
npm run test:e2e
```

## Dependency security audit

CI/release guidance uses:

```bash
npm audit --omit=dev --audit-level=high
```

Meaning:

- examines installed production dependency metadata;
- ignores development-only packages for this release-security gate;
- exits non-zero for high or critical findings covered by npm advisory data.

Do not lower the threshold merely to obtain a green check. Investigate the dependency and document a conscious risk decision if remediation is not immediately possible.

## Git commands used by this project

### Clone

```bash
git clone https://github.com/sanskarIN/tablespark.git
cd tablespark
```

`git clone` downloads repository history and creates a working tree. `cd tablespark` changes the terminal's current directory into the clone.

### Inspect working tree

```bash
git status
```

Shows the active branch and modified/untracked/staged files.

### Inspect recent history

```bash
git log -5 --oneline
```

Shows the five newest commits in compact form.

### Inspect changes

```bash
git diff
```

Shows unstaged changes.

```bash
git diff --staged
```

Shows changes already staged for the next local commit.

### Configure the intended project email

```bash
git config user.email "sanskarin@outlook.in"
```

This configures the current repository clone's commit email unless `--global` is used.

Check it with:

```bash
git config user.email
```

### Create a focused commit

```bash
git add <paths>
git commit -m "docs: explain example area"
```

`git add` stages selected changes. `git commit` creates a local commit containing the staged snapshot and message.

### Push the active branch

```bash
git push origin <branch-name>
```

`origin` is normally the GitHub remote created by cloning. The branch argument determines which branch is published.

## Release tag commands

For a version such as 0.1.0:

```bash
git tag -a v0.1.0 -m "TableSpark v0.1.0"
git push origin v0.1.0
```

`-a` creates an annotated tag. The pushed `v*.*.*` tag triggers `.github/workflows/release.yml`.

Do not reuse or silently move an already-public release tag. Publish a corrective patch version instead.

## Release checksum verification

On Linux/macOS or a compatible shell:

```bash
sha256sum -c tablespark-web.zip.sha256
```

A correct artifact reports:

```text
tablespark-web.zip: OK
```

On Windows PowerShell:

```powershell
Get-FileHash .\tablespark-web.zip -Algorithm SHA256
Get-Content .\tablespark-web.zip.sha256
```

Compare the hexadecimal digest values exactly.

The checksum verifies artifact integrity against the workflow-generated digest. It is not a digital signature and does not independently prove publisher identity.

## Common command failures

### `npm: command not found`

Node.js/npm is missing from PATH. Install/repair the supported Node.js version and open a new terminal.

### Engine warning

Your Node/npm version is older than `package.json` requires. Upgrade before debugging unrelated failures.

### Port 5173 or 4173 already in use

Because strict ports are enabled, stop the existing process rather than assuming Vite chose another port.

### Playwright browser missing

Run:

```bash
npx playwright install chromium
```

### Linux Playwright dependency error

Run:

```bash
npx playwright install --with-deps chromium
```

### Format check fails

Run:

```bash
npm run format
```

Then inspect the diff and rerun `npm run format:check`.

### Typecheck fails after schema/i18n changes

Update every typed fixture/catalog consumer rather than weakening the type. Schema and localization type failures are intentional safeguards.

### Secret scan reports a real credential

Do not simply delete the line and declare the incident resolved. Revoke/rotate the credential, remove it from current source, assess repository history exposure, and follow `SECURITY.md`.

## Maintainer rule

When adding, removing, or changing an npm script, update all of these together when relevant:

- `package.json`;
- `README.md`;
- `docs/development.md`;
- `docs/testing.md`;
- `docs/quality-gates.md`;
- `docs/commands-reference.md`;
- CI/release workflows;
- `what_changed.md`.

This prevents command documentation and automation from drifting apart.
