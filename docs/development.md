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
```

## Where a change belongs

### Multiplication or scoring rules

Put pure rules in `src/domain/` and add direct unit/property tests.

### Browser storage, speech, or logging

Put platform integration in `src/infrastructure/`.

### User-facing workflow

Put feature UI in `src/features/<feature>/`. Avoid making `App.tsx` a collection of business rules.

### Cross-cutting visual state

Reusable application-wide UI boundaries such as offline feedback and fatal error handling belong in `src/components/`.

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

`format:check` is appropriate for CI because it verifies without rewriting files. `format` rewrites supported files according to `.prettierrc.json`.

## Linting

```bash
npm run lint
```

Linting includes TypeScript-aware rules, React hooks rules, React refresh safety, and JSX accessibility rules.

A lint pass is not a replacement for manual accessibility review.

## Application state

`AppStateProvider` is the explicit composition point for local application state.

When adding a state mutation:

1. decide whether it is a domain rule or application wiring;
2. keep domain calculations in pure functions;
3. update immutable state rather than mutating nested objects;
4. ensure persisted shape compatibility;
5. add tests for the new behavior.

## Persistence changes

Current persisted schema version: `1`.

Never silently repurpose an existing persisted field. For an incompatible or shape-changing update:

1. update the type model;
2. increment the persisted schema version;
3. add migration logic;
4. update the Zod schema;
5. test old-to-new migration and corrupted input;
6. update privacy/backups documentation.

## Internationalization

Initial English interface copy is under `src/i18n/en.ts`. New reusable product strings should not be scattered unnecessarily through infrastructure or domain code.

When a second locale is introduced, add a locale selection/provider architecture rather than branching on locale throughout feature components.

## CSS and design tokens

Global design tokens are CSS custom properties in `src/styles.css`:

- colors and surfaces;
- spacing scale;
- radius scale;
- shadows;
- theme overrides.

Prefer existing tokens over isolated hard-coded spacing/color values. Component-specific status/error styles are kept in `src/status.css`.

## Accessibility development checklist

For each new control:

- use a native semantic element when available;
- provide an accessible name;
- ensure keyboard operation;
- preserve visible focus;
- avoid relying on hover;
- keep touch targets comfortable;
- announce asynchronous result changes only when necessary;
- test at enlarged text/zoom;
- test both themes;
- respect reduced-motion behavior.

## Logging

Use the structured logger for meaningful technical events only. Do not log learner answers, profile names, email addresses, backup contents, or other personal information.

Sensitive-looking field names are redacted as a defense in depth, not as permission to log sensitive data.

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
```

Update `what_changed.md` for milestone-level work so another chat or contributor can resume precisely.
