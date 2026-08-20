# Testing Strategy

TableSpark uses layered verification so a passing web smoke test cannot hide broken domain/persistence/native configuration, and a successful native compile cannot be mistaken for a signed production release.

## Verification layers

```text
domain invariants
→ infrastructure/persistence/localization tests
→ React integration
→ repository security/docs/native-config gates
→ browser E2E
→ native desktop/mobile compilation
→ manual accessibility/language/print/device review
→ signed distribution verification
```

## Domain unit/property tests

Location: `src/domain/*.test.ts`.

Coverage includes:

- table range/order/step and 5,000-row budget;
- bounded practice responses;
- deterministic seeded questions and seed bounds;
- difficulty presets;
- canonical commutative mastery keys;
- mastery accuracy/streak/mistake behavior;
- deduplicated mistake review;
- progress search/filter/classification;
- worksheet modes/blank styles;
- session retention/prepend/trim;
- optional goal bounds.

`fast-check` expands bounded question-generation coverage beyond a small hand-written example set.

Run:

```bash
npm run test
```

## Persistence and infrastructure tests

Location: `src/infrastructure/*.test.ts` plus state/integration suites.

Important coverage:

- local-storage round trip;
- four startup outcomes: `empty`, `loaded`, `invalid`, `unavailable`;
- blocked startup read does not trigger known-invalid recovery and suppresses automatic writes;
- raw known-invalid value preservation/recovery;
- ordinary write failure;
- shared 2 MB state/import budget;
- schema-1-to-schema-2 migration;
- profile identity and 100-profile capacity;
- semantic mastery/question/attempt/mistake validation;
- session summary/retention/seed semantics;
- optional goal validation;
- transactional destructive backup replacement success/failure;
- browser preference resilience;
- PWA lifecycle/install-prompt adapters;
- structured logging redaction;
- speech fallback behavior.

The batched-profile regression verifies two additions fired from a 99-profile render still stop at 100 because capacity is enforced inside the current functional state updater.

## Localization tests

Tests verify:

- English/Hindi catalog shape parity;
- no blank static Hindi messages;
- stored/fallback locale recognition;
- locale-storage failure containment;
- runtime English/Hindi switching;
- persisted Hindi restoration;
- `<html lang>` updates;
- locale preference remains outside learner backup JSON;
- visible English/Hindi version remains synchronized with `package.json` (`2.0.12`).

Automation does not certify natural Hindi terminology quality. Fluent/native review remains manual evidence.

## Cross-platform runtime tests

`src/platform/runtime.test.ts` verifies the ordinary unit-test/non-Tauri environment safely resolves to:

```text
runtimePlatform = web
isNativeShell = false
isMobileNativeShell = false
PWA service worker registration = enabled
```

This regression matters because Vite/Tauri compile-time globals are not guaranteed to exist in every test/tooling context.

Native builds receive explicit platform metadata through Vite and disable PWA service-worker registration.

## React integration tests

Testing Library exercises the shared React application through accessible roles/labels.

Coverage includes:

- navigation;
- table/worksheet updates;
- print metadata;
- practice/mistake-review completion;
- mastery filtering/search;
- session-history persistence/retention;
- optional goals;
- persistence warnings/recovery;
- transactional backup replacement;
- keyboard shortcut help;
- speech unavailable fallback;
- PWA notices;
- English/Hindi switching/persistence;
- version presentation.

Because web and Tauri package the same React product, these tests protect shared behavior for every target. They do not replace host-webview/device verification.

## Repository secret-scanner tests

```bash
npm run test:security
npm run secret:scan
```

The scanner recognizes a bounded set of high-risk credential signatures and reports metadata without echoing matched values.

It is defense in depth. A real exposed credential/signing key must be revoked/rotated even if later removed from source.

## Documentation integrity tests

```bash
npm run test:docs
```

This:

1. tests the Markdown-link checker implementation;
2. validates supported repository-local Markdown links.

It does not crawl arbitrary external sites and cannot automatically determine whether a newly tracked file has received an explanatory entry in the manual exhaustive repository-file inventory.

## Native configuration tests

Files:

```text
scripts/native-config.mjs
scripts/native-config-check.mjs
scripts/native-config.test.mjs
```

Run:

```bash
npm run test:native-config
npm run native:config:check
```

The gate verifies maintained cross-platform invariants including:

- `package.json` / `src-tauri/Cargo.toml` version consistency;
- Tauri product version sourced from `../package.json`;
- application identifier `in.sanskar.tablespark`;
- Vite `frontendDist` and development URL;
- production/development native CSP presence;
- explicit selection of only `main-capability`;
- required TableSpark native icon declarations;
- required desktop/Android/iOS package scripts;
- Tauri CLI/opener package presence;
- Android minimum API 24;
- iOS minimum system version 14.0.

These checks run in ordinary `npm run check`, so native configuration drift can be caught even on a machine without Rust/Android/Xcode installed.

## Rust/native shell checks

On a host with Rust/Tauri prerequisites:

```bash
npm run native:fmt:check
npm run native:check
npm run check:native
```

`check:native` verifies Rust formatting plus `cargo check` against `src-tauri/Cargo.toml`.

Compile the current desktop host without installer bundling/signing:

```bash
npm run native:build:ci
```

Native build commands generate platform icons from `public/logo.svg` before compiling/package generation.

## Browser end-to-end tests

Location: `e2e/`.

Playwright runs against a production preview build.

Important specs:

- `smoke.spec.ts` — primary user journey;
- `accessibility.spec.ts` — stable semantic/keyboard invariants;
- `localization.spec.ts` — Hindi switching/persistence plus 2.0.12 About version presentation;
- `localized-errors.spec.ts` — localized table/practice/backup failures;
- `print.spec.ts` — Chromium print-media behavior;
- `release-evidence.spec.ts` — opt-in real screenshot capture.

Run:

```bash
npm run test:e2e
```

Install Chromium first when needed:

```bash
npx playwright install chromium
```

Minimal Linux:

```bash
npx playwright install --with-deps chromium
```

## Native Cross-Platform CI

Workflow:

```text
.github/workflows/native.yml
```

It is intentionally separate from ordinary web CI because native compilation requires platform SDKs/system packages and substantially more execution time.

### Desktop matrix

Runs on:

- `ubuntu-latest`;
- `windows-latest`;
- `macos-latest`.

Each job:

1. checks out source;
2. installs Node 22.12.0;
3. installs Linux native dependencies where needed;
4. selects stable Rust;
5. installs JavaScript dependencies;
6. runs `npm run check:native`;
7. runs `npm run native:build:ci`.

This establishes that the maintained native shell/frontend can compile on each desktop host without requiring production signing credentials.

### Android debug APK

The Android job:

- uses Ubuntu;
- configures Java 17;
- installs Rust Android targets;
- resolves the installed Android NDK;
- initializes generated Android project files;
- compiles a debug APK with `npm run android:build:debug`.

A debug APK proves build viability for the candidate. It is **not** a production-signed Play Store artifact.

### iOS simulator

The iOS job:

- uses macOS;
- verifies Xcode/CocoaPods tooling;
- adds `aarch64-apple-ios-sim` Rust target;
- initializes generated iOS project files;
- compiles the iOS simulator app with `npm run ios:build:simulator`.

A simulator build proves source/toolchain compilation. It does **not** prove physical-device signing/provisioning/App Store readiness.

## Standard web CI

`.github/workflows/ci.yml` retains two jobs.

### `quality`

Runs:

- formatting;
- lint;
- strict TypeScript;
- application tests;
- repository security tests/scan;
- documentation-link gate;
- native-configuration tests/check (through `npm run check` or its maintained steps);
- production web build;
- production dependency audit;
- `dist/` artifact upload.

### `e2e`

Installs Chromium/system dependencies and runs normal Playwright specs against a production preview server.

CodeQL and Release Visual Evidence remain separate workflows.

## `npm run check`

Current aggregate order:

```text
format:check
→ lint
→ typecheck
→ test
→ test:security
→ secret:scan
→ test:docs
→ test:native-config
→ native:config:check
→ build
```

Browser E2E, Rust/native compilation, and advisory auditing remain separate because they require additional environment/tooling.

## Coverage

```bash
npm run test:coverage
```

Coverage is a diagnostic, not a release-quality score. Critical logic requires behavior-focused assertions even when total line coverage is high.

## Manual platform verification boundary

Automated compile/tests cannot establish every platform behavior. Before calling a native package publicly released, perform the applicable real-host/device review.

### Windows installed application

Verify:

- install/start/restart;
- local data persistence;
- backup export/import;
- print/speech behavior;
- external link handoff;
- NVDA/Narrator as intended;
- signed publisher identity;
- update/reinstall/uninstall behavior.

### macOS installed application

Verify:

- signing/notarization or chosen distribution path;
- install/start/restart/local persistence;
- VoiceOver;
- print/speech/external links;
- replacement/upgrade behavior.

### Linux installed package

Verify representative intended distributions/package formats rather than extrapolating from one Ubuntu CI image.

### Android physical device

Verify:

- signed release APK/AAB identity;
- install/upgrade/restart/local persistence;
- backup transfer;
- printing/file behavior;
- touch/TalkBack/speech;
- external links/email;
- store privacy declarations if Play distribution is intended.

### iPhone/iPad physical devices

Verify:

- Apple signing/provisioning/team ownership;
- physical iPhone and iPad install;
- restart/local persistence;
- backup transfer;
- printing/file behavior;
- touch/VoiceOver/speech;
- external links/email;
- App Store metadata/privacy when applicable.

## Signing-security test boundary

Pull-request CI must not receive production signing credentials.

Do not use successful unsigned/debug/simulator compilation as proof that a platform signing/store configuration exists.

Signing evidence belongs to protected release operations and `docs/release-evidence.md`.

## Accessibility automation boundary

Browser semantic tests and shared React markup are useful signals, but they do not prove WCAG conformance or screen-reader success in every system webview.

Record NVDA/Narrator/VoiceOver/TalkBack results only after human-assisted execution.

## Localization automation boundary

Typed catalog/browser tests catch structural and selected rendering/error regressions. Fluent/native Hindi terminology, narrow native layout, print, and screen-reader pronunciation still need human review.

## Print automation boundary

Chromium print-media tests do not prove every native system webview/printer dialog. Verify print behavior on intended release platforms.

## Release-evidence rule

A result is valid only for the immutable final candidate SHA.

Do not count a workflow as passing when it is:

- queued;
- pending/in progress;
- cancelled;
- skipped;
- from an older SHA;
- a different debug/simulator/signed artifact than the one being claimed.

Record final evidence in PR/check/release metadata and `docs/release-evidence.md` without creating self-invalidating “final SHA” commits.

## Regression-test rule

When fixing a bug:

1. reproduce with an automated test when practical;
2. fix the smallest responsible layer;
3. keep the regression test;
4. run focused related checks;
5. run full relevant web/native gates before release.

For a native configuration/security regression, extend `scripts/native-config.test.mjs` when the invariant can be checked without platform SDKs.

## Determinism

Tests must not depend on:

- production credentials/signing keys;
- external learner APIs;
- real learner data;
- uncontrolled remote state;
- uncontrolled random values;
- unknown machine locale where a controlled test preference can be used.

Practice generation uses explicit seeds. Documentation/config tests remain local/offline. Native pull-request CI uses debug/unsigned/simulator-safe outputs rather than production signing material.
