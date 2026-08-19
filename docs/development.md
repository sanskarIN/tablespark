# Development Guide

## Development philosophy

TableSpark favors a small modular client over a complicated service architecture. Add behavior at the narrowest layer that owns the rule, test it there, and keep browser-specific concerns behind explicit adapters.

## Start the app

```bash
npm install
npm run dev
```

The development server uses Vite and port `5173`.

## Source map

```text
src/
├── components/
├── domain/
├── features/
│   ├── about/
│   ├── practice/
│   ├── progress/
│   ├── settings/
│   └── tables/
├── i18n/
├── infrastructure/
├── state/
├── test/
├── App.tsx
├── main.tsx
├── status.css
└── styles.css
scripts/
├── secret-scan.mjs
├── secret-scanner.mjs
└── secret-scanner.test.mjs
```

## Where a change belongs

### Multiplication, scoring, review, or progress rules

Put pure rules in `src/domain/` and add direct unit/property tests. Domain code must not depend on React or browser APIs.

### Browser storage, speech, random seed selection, preferences, or logging

Put platform integration in `src/infrastructure/`.

### User-facing workflow

Put feature UI in `src/features/<feature>/`. Avoid making `App.tsx` a collection of business rules.

### Cross-cutting visual state

Reusable application-wide UI boundaries such as onboarding, offline/persistence feedback, and fatal error handling belong in `src/components/`.

### Repository-only tooling

Put tooling that runs against repository files but is not shipped to the app under `scripts/`. Keep it dependency-light where practical and test it independently.

## TypeScript rules

The project enables strict TypeScript checks, unused-value checks, unchecked-index protection, and exact optional-property handling.

Run:

```bash
npm run typecheck
```

Do not silence a type error with `any` unless there is a documented external boundary that cannot be typed more accurately. Prefer narrowing `unknown` values.

## Formatting

Check formatting:

```bash
npm run format:check
```

Apply formatting:

```bash
npm run format
```

The configured formatter covers TypeScript/TSX, E2E TypeScript, repository `.mjs` scripts, root JS/TS/JSON configuration, and VS Code JSON settings. Stylesheets and documentation are kept manually readable rather than being rewritten by the current Prettier command.

## Linting

```bash
npm run lint
```

Linting includes TypeScript-aware rules, React hooks rules, React refresh safety, JSX accessibility rules, and Node-aware checks for repository scripts.

A lint pass is not a replacement for manual accessibility review.

## Application state

`AppStateProvider` is the explicit composition point for local application state.

When adding a state mutation:

1. decide whether it is a domain rule or application wiring;
2. keep domain calculations in pure functions;
3. update immutable state rather than mutating nested objects;
4. ensure runtime limits match persisted/imported validation limits;
5. preserve user-visible persistence-health behavior;
6. add tests for the new behavior.

The provider exposes `persistenceAvailable`. Do not remove this signal unless another mechanism reliably tells the user when browser storage refuses writes.

## Persistence changes

Current persisted schema version: `1`.

Current reliability constraints include:

- 2 MB serialized state/backup byte budget;
- 100 offline profile maximum;
- 100 recent mistakes per profile;
- validated active-profile identity;
- unique profile IDs;
- mastery and multiplication semantic invariants.

Never silently repurpose an existing persisted field. For an incompatible or shape-changing update:

1. update the type model;
2. increment the persisted schema version;
3. add migration logic;
4. update the Zod schema;
5. test old-to-new migration and corrupted input;
6. update privacy/backups documentation;
7. verify runtime creation/update paths cannot produce state the validator rejects.

## Internationalization

English product interface copy is centralized under `src/i18n/en.ts`, including dynamic copy factories for values such as scores, progress statistics, seeds, and profile capacity.

New user-facing UI strings should be added there rather than scattered through feature components. Domain validation/error contracts may remain beside domain rules where they are part of non-UI behavior and test contracts.

When a second locale is introduced, add a locale selection/provider architecture rather than branching on locale throughout feature components.

## CSS and design tokens

Global design tokens are CSS custom properties in `src/styles.css`:

- colors and surfaces;
- spacing scale;
- radius scale;
- shadows;
- theme overrides.

Prefer existing tokens over isolated hard-coded spacing/color values. Component-specific status/error/help styles are kept in `src/status.css`.

Print-only content uses `.print-only`, while interactive-only controls use `.no-print`. Do not put private learner data into a print-only template without an explicit product requirement and privacy review.

## Accessibility development checklist

For each new control:

- use a native semantic element when available;
- provide an accessible name;
- provide `aria-describedby` when support/error context is important;
- ensure keyboard operation;
- preserve visible focus;
- avoid relying on hover;
- keep touch targets comfortable;
- announce asynchronous result changes only when necessary;
- test at enlarged text/zoom;
- test both themes;
- respect reduced-motion behavior;
- provide a safe unsupported-platform state for progressive browser APIs.

## Logging

Use the structured logger for meaningful technical events only. Do not log learner answers, profile names, email addresses, backup contents, or other personal information.

The logger redacts both sensitive-looking field names and recognizable sensitive string values as defense in depth. This is not permission to log sensitive data.

## Secret scanning

Before release-level work run:

```bash
npm run test:security
npm run secret:scan
```

The scanner reports only file/line/type metadata and should never be changed to print matched credential values. Add a regression test when adding a new credential pattern.

If a real secret is committed, scanning is not remediation. Revoke or rotate the secret first, then clean history as appropriate.

## Adding a dependency

Before adding a dependency, ask:

- Can the platform or existing dependency already do this?
- Is the package maintained?
- Does it add runtime permissions or network activity?
- Is it large relative to the feature?
- Is the license compatible with MIT distribution?
- Can the behavior be tested deterministically?

Pin direct versions deliberately and let Dependabot propose reviewed updates.

## Before committing

For a small domain change, run the smallest relevant test first. Before a milestone or pull request, run:

```bash
npm run check
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Update `what_changed.md` for milestone-level work so another chat or contributor can resume precisely.
