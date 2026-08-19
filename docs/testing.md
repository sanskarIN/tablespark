# Testing Strategy

TableSpark uses multiple test layers so a passing UI smoke test cannot hide broken multiplication/persistence rules, and isolated unit tests cannot hide broken user journeys.

## Test layers

### Domain unit tests

Location: `src/domain/*.test.ts`

These verify:

- table generation order, step sizes, and output budget;
- input validation;
- equation formatting;
- bounded practice-response validation;
- deterministic question generation and seed bounds;
- random-session seed helpers;
- difficulty-preset progression and bounds;
- mastery-key normalization;
- mastery accuracy, streak, and mistake behavior;
- preservation of profile session/goal metadata during attempt updates;
- deduplicated mistake-review selection;
- mastery search/filter rules and mastery classification;
- worksheet prompt construction and configurable blank styles;
- supported session-history retention values;
- prepend/trim behavior for bounded session summaries.

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
- schema-1-to-schema-2 migration;
- corrupted storage classification without raw-value destruction;
- raw recovery-state reads;
- storage write failures;
- malformed and oversized backup rejection;
- profile identity validation;
- canonical mastery keys and mastery-counter invariants;
- multiplication-answer and attempt-correctness invariants;
- mistake-history semantics;
- session-summary count/correctness bounds;
- generated-session replay-seed semantics;
- mistake-review null-seed semantics;
- supported session-retention values and retained-history length;
- optional mastery-goal bounds;
- unsupported schema versions;
- migration boundary behavior;
- safe lightweight browser preference flags;
- structured log redaction;
- progressive speech-synthesis behavior.

### React integration tests

Testing Library verifies the application through accessible roles and labels rather than implementation details.

Current integration coverage includes:

- primary navigation;
- generator updates;
- worksheet composer output modes;
- worksheet blank-style changes;
- solved/practice/answer-key print metadata;
- mastery search and filters;
- mistake-review completion behavior;
- completed-drill session-summary persistence;
- session-retention trimming;
- optional mastery-goal display;
- unavailable speech fallback UI;
- PWA update/offline-ready/install notices;
- keyboard shortcut help and editable-field shortcut guards;
- English-to-Hindi interface switching;
- persisted Hindi locale restoration and `<html lang>` changes;
- separation of interface locale preference from learner-state storage;
- user-visible persistence-write failure warning;
- unreadable local-state preservation and explicit discard recovery.

Relevant files include `src/App.test.tsx`, `src/learningRecords.test.tsx`, `src/localization.test.tsx`, `src/keyboardShortcuts.test.tsx`, and component-specific test files.

The unreadable-state regression specifically verifies that an invalid stored value survives initial render unchanged until the user confirms discard.

### Security-scanner tests

The dependency-free repository secret scanner has its own Node test suite:

```bash
npm run test:security
```

The tests verify ordinary text stays clean, supported credential patterns are recognized, and findings do not echo the matched credential value.

Scan the repository itself with:

```bash
npm run secret:scan
```

The scanner is defense in depth, not a replacement for secret rotation or repository-history cleanup after an accidental real-secret commit.

### Browser end-to-end tests

Location: `e2e/`

Playwright starts a production preview server and verifies user journeys in Chromium.

`e2e/smoke.spec.ts` covers:

- generate a table;
- compose a practice worksheet and change its blank style;
- configure and complete a deterministic practice session;
- create an offline profile;
- change large-text accessibility settings;
- preserve unreadable local data until confirmed discard.

`e2e/accessibility.spec.ts` covers stable semantic invariants:

- named primary navigation;
- one main landmark;
- skip-link target;
- labels for form controls across major views;
- image `alt` attributes;
- keyboard reachability/dismissal of the shortcut reference.

`e2e/localization.spec.ts` covers:

- switching the browser UI to Hindi;
- Hindi navigation/heading rendering;
- document-language update;
- language persistence across reload.

Run:

```bash
npm run test:e2e
```

Install Chromium first on a new development machine:

```bash
npx playwright install chromium
```

On Linux CI or a minimal Linux machine, Playwright may require:

```bash
npx playwright install --with-deps chromium
```

## Accessibility automation boundary

Automated browser invariants intentionally do not claim WCAG conformance or successful screen-reader operation. Manual NVDA, Narrator, VoiceOver, and TalkBack release-candidate checks remain documented in `docs/accessibility.md` and should be recorded only after a real human-assisted pass.

## Localization automation boundary

Typed catalog shape checks and browser smoke tests catch missing keys, switching regressions, and persistence problems. They do not prove natural translation quality. A fluent/native-speaker terminology review remains a manual release-quality check for the Hindi interface.

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
2. ESLint and JSX accessibility rules;
3. TypeScript type checking;
4. Vitest application tests;
5. Node security-scanner tests;
6. repository secret scan;
7. production build.

Browser E2E is intentionally a separate script because it requires a browser binary. Production dependency auditing is an additional CI/release gate because it depends on installed package metadata.

## CI behavior

The CI workflow has two jobs.

### `quality`

- installs dependencies;
- verifies formatting;
- runs lint;
- runs TypeScript checks;
- runs Vitest;
- tests the repository secret scanner;
- scans repository files for supported credential patterns;
- builds the PWA;
- audits production dependencies for high-severity findings;
- uploads the built `dist/` directory as an artifact.

### `e2e`

- installs dependencies;
- installs Chromium and required CI libraries;
- runs Playwright against a production preview build, including smoke, accessibility-invariant, and localization specs.

CodeQL is maintained in a separate security workflow.

## Release workflow verification

The tagged release workflow runs `npm run check`, rebuilds the PWA, packages `dist/` as `tablespark-web.zip`, and generates `tablespark-web.zip.sha256`. This adds integrity metadata to the packaged artifact but does not replace normal CI/E2E/manual release-candidate review.

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
- random values without a controlled source/seed.

Practice generation supports a seed specifically so sessions can be reproduced. Random-seed helper tests inject a deterministic random function instead of depending on `Math.random()` output.

Locale tests set or use a controlled local preference rather than depending on an unknown developer-machine browser language.

## Manual release checks

Automated tests do not replace final manual checks. Before a release, inspect:

- keyboard navigation and shortcut help;
- light/dark/system themes;
- English and Hindi interfaces;
- native/fluent review of Hindi terminology;
- large-text mode;
- reduced motion;
- narrow and wide layouts;
- worksheet composer output/blank/paper/column combinations;
- print preview including blank Name/Date learner metadata and answer-key omission;
- recent session history and retention changes;
- optional mastery goals;
- offline behavior after initial load;
- PWA installability on the real release origin;
- non-blocking update behavior after deploying a newer build;
- backup export and re-import, including supported schema migration;
- persistence-write failure warning behavior where practical;
- unreadable-state recovery download/import/discard behavior;
- text-to-speech availability/fallback behavior;
- manual assistive-technology matrix rows from `docs/accessibility.md`;
- real light/dark and compact/wide browser screenshots from the verified release candidate.

Record release-candidate results in `what_changed.md` without marking unexecuted checks as passed.
