# Testing Strategy

TableSpark uses multiple test layers so a passing UI smoke test cannot hide broken multiplication rules, and isolated unit tests cannot hide broken user journeys.

## Test layers

### Domain unit tests

Location: `src/domain/*.test.ts`

These verify:

- table generation order and step sizes;
- input validation;
- equation formatting;
- deterministic question generation;
- mastery-key normalization;
- mastery accuracy, streak, and mistake behavior.

Run:

```bash
npm run test
```

### Property-based tests

`src/domain/questions.test.ts` uses `fast-check` to generate many bounded numeric cases and verify that generated operands remain in range and products remain mathematically correct.

Property tests are useful where the input space is larger than a small hand-written example set.

### Persistence and migration tests

Location: `src/infrastructure/*.test.ts`

These cover:

- local-storage round trips;
- portable JSON export/import;
- corrupted storage handling;
- malformed backup rejection;
- unsupported schema versions;
- migration boundary behavior.

### React integration tests

Location: `src/App.test.tsx`

Testing Library verifies the application through accessible roles and labels rather than implementation details. Current coverage includes primary navigation and generator updates.

### Browser end-to-end tests

Location: `e2e/`

Playwright starts a production preview server and verifies primary user journeys in Chromium:

- generate a table;
- configure and complete a deterministic practice session;
- create an offline profile;
- change large-text accessibility settings.

Run:

```bash
npm run test:e2e
```

Install Chromium first on a new development machine:

```bash
npx playwright install chromium
```

## Coverage

Generate coverage:

```bash
npm run test:coverage
```

Coverage is a diagnostic, not a substitute for meaningful assertions. New critical domain logic should have direct behavior-focused tests even when overall line coverage is already high.

## Full quality check

```bash
npm run check
```

This runs, in order:

1. Prettier formatting check;
2. ESLint;
3. TypeScript type checking;
4. Vitest tests;
5. production build.

Browser E2E is intentionally a separate script because it requires a browser binary.

## CI behavior

The CI workflow has two jobs:

### `quality`

- installs dependencies;
- verifies formatting;
- runs lint;
- runs TypeScript checks;
- runs Vitest;
- builds the PWA;
- audits production dependencies for high-severity findings;
- uploads the built `dist/` directory as an artifact.

### `e2e`

- installs dependencies;
- installs Chromium and required CI libraries;
- runs Playwright against a production preview build.

CodeQL is maintained in a separate security workflow.

## Regression-test rule

When fixing a bug:

1. reproduce it with a failing automated test when practical;
2. fix the smallest responsible layer;
3. keep the regression test;
4. run related tests;
5. run the full quality suite before release-level work.

## Determinism

Tests must not depend on:

- production credentials;
- external APIs;
- real learner data;
- clock-sensitive remote state;
- random values without a controlled seed.

Practice generation supports a seed specifically so sessions can be reproduced.

## Manual release checks

Automated tests do not replace final manual checks. Before a release, inspect:

- keyboard navigation;
- light/dark/system themes;
- large-text mode;
- reduced motion;
- narrow and wide layouts;
- print preview;
- offline behavior after initial load;
- PWA installability on the release origin;
- backup export and re-import;
- text-to-speech availability/fallback behavior.

Record release-candidate results in `what_changed.md`.
