# Quality Gates

TableSpark uses layered automated checks so release confidence does not depend on a single test runner.

## Standard local gate

Run:

```bash
npm run check
```

The command executes, in order:

1. `npm run format:check` — verifies repository-formatted source/configuration files.
2. `npm run lint` — runs TypeScript-aware ESLint, React Hooks/refresh rules, JSX accessibility rules, and Node-script linting.
3. `npm run typecheck` — runs strict TypeScript project checks.
4. `npm run test` — runs Vitest domain, infrastructure, and React integration tests.
5. `npm run test:security` — tests the repository credential-pattern scanner.
6. `npm run test:docs` — tests the local documentation-link checker.
7. `npm run secret:scan` — scans repository text for supported high-risk credential signatures without printing matched values.
8. `npm run docs:check` — verifies local Markdown/HTML documentation links and image references resolve.
9. `npm run build` — creates the production PWA after TypeScript checking.

## Browser journey gate

Install Chromium once:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run test:e2e
```

Linux CI uses:

```bash
npx playwright install --with-deps chromium
```

The E2E suite covers primary learning/settings journeys plus unreadable local-state preservation, raw recovery download, and confirmed recovery discard.

## Production dependency gate

Run:

```bash
npm audit --omit=dev --audit-level=high
```

A high-severity production finding requires investigation before a release. Do not lower the threshold only to make a release pass.

## GitHub automation

`.github/workflows/ci.yml` runs the standard source/documentation/security checks and browser E2E on pushes and pull requests to `main`. `.github/workflows/codeql.yml` performs JavaScript/TypeScript static security analysis. The tagged release workflow runs `npm run check` again before packaging the web artifact.

## Release-candidate rule

Before tagging a release candidate:

```bash
npm run check
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Then complete the manual checks in `docs/release.md` and record exact outcomes in `what_changed.md`.

A queued, skipped, cancelled, or unavailable CI job is **not** a passing result. Record the exact external limitation when a platform runner prevents executable verification.
