# Architecture

## Goals

TableSpark uses one modular local-first learning application across web/PWA and native Windows, macOS, Linux, Android, and iOS/iPadOS targets.

The architecture aims to:

- keep multiplication/learning rules independent of UI/runtime;
- keep persistence and platform APIs behind explicit adapters;
- avoid duplicating product logic per operating system;
- keep native permissions minimal;
- preserve one learner-data schema and backup format across targets;
- keep web/PWA support fully functional alongside native packaging;
- avoid remote infrastructure that the product does not need.

## Delivery architecture

```text
                       shared TypeScript / React product
                                   │
             ┌─────────────────────┴─────────────────────┐
             │                                           │
         Web / PWA                                   Tauri 2
             │                                           │
      browser runtime                           Rust + system webview
             │                                           │
   service worker optional          ┌────────┬────────┬───┴────┬────────┐
                                    │        │        │        │        │
                                  Windows   macOS    Linux   Android   iOS/iPadOS
```

The Tauri layer packages the existing frontend and provides only narrowly scoped native bridging. It is not a second feature implementation.

## Repository structure

```text
src/
├── components/       Cross-cutting UI states and boundaries
├── domain/           Pure business rules and domain types
├── features/         User-facing feature modules
├── i18n/             Typed message catalogs and locale provider
├── infrastructure/   Runtime-neutral/browser-facing adapters
├── platform/         Web/native platform detection and bridges
├── state/            Application state composition
├── App.tsx           Shared product shell/navigation
└── main.tsx          Shared bootstrap with runtime-aware PWA registration

src-tauri/
├── Cargo.toml        Rust package/dependencies
├── build.rs          Tauri build integration
├── capabilities/     Native permission boundary
├── src/              Native desktop/mobile entrypoints
├── tauri.conf.json   Shared native configuration/security/bundle settings
├── tauri.android.conf.json
└── tauri.ios.conf.json

scripts/               Repository quality/security/configuration utilities
e2e/                   Browser-level product journeys
docs/                  Architecture, operations, release, and user documentation
```

Generated output is deliberately not source of truth:

```text
src-tauri/target/   Rust build output
src-tauri/gen/      Generated Android/iOS IDE projects
src-tauri/icons/    Native icons generated from public/logo.svg
```

## Domain layer

`src/domain/` contains rules that do not depend on React, browser APIs, or Tauri:

- bounded practice answers;
- table range/step validation and render budget;
- deterministic seeded question generation;
- mastery and mistake-history updates;
- difficulty presets;
- deduplicated mistake review;
- progress filtering/search/classification;
- session-history retention and optional goals;
- worksheet presentation models;
- immutable product data shapes.

This is the portability core. A multiplication rule should behave identically in Chrome, an Android Tauri webview, and a Windows native package.

## Feature layer

`src/features/` groups UI by user intent:

- `tables/` — custom tables and worksheet composition/printing;
- `practice/` — generated/replayable drills, timing, feedback, mistake review;
- `progress/` — mastery/search/history/goals;
- `settings/` — language, appearance, accessibility, profiles, backup/recovery, learning-record settings;
- `about/` — identity, version, privacy summary, contact/support/funding links.

Feature modules consume shared state/domain rules. They should not branch into separate Windows/Android/etc. implementations merely because a native package exists.

## State layer

`AppStateProvider` owns explicit application transitions including:

- active profile selection;
- profile creation/deletion within the 100-profile cap;
- settings updates;
- history retention trimming;
- attempt/mastery/mistake updates;
- completed session summaries;
- optional goals;
- validated backup replacement;
- progress reset;
- persistence health/recovery state.

Important reliability rules:

- profile capacity is checked inside the latest functional state update so batching cannot create 101 profiles;
- backup replacement is transactional: validate, durably save, then replace active React state/report success;
- startup storage-read failure and known-invalid returned data are separate states;
- temporary defaults never automatically overwrite unknown/inaccessible or preserved invalid data.

## Persistence model

Current learner schema:

```text
schemaVersion: 2
```

Stable learner storage key:

```text
tablespark.state.v1
```

Locale preference:

```text
tablespark.locale.v1
```

Schema number and storage-key suffix intentionally differ. The old key remains discoverable so schema-1 data can migrate locally.

A browser/PWA origin and each native installation have separate platform-managed storage. TableSpark does not discover/copy another installation’s private storage.

Cross-platform data movement uses validated JSON backup export/import.

### Startup storage classification

The storage adapter has four explicit outcomes:

- `empty` — storage read succeeded and no learner value exists;
- `loaded` — storage read succeeded and the returned value migrates/validates;
- `invalid` — storage read succeeded, returned a value, but parsing/migration/validation failed;
- `unavailable` — the storage read operation itself threw before any learner value could be obtained.

`invalid` preserves the exact raw returned value for recovery. `unavailable` cannot safely claim that storage is empty or corrupt and therefore pauses automatic learner writes without presenting known-invalid raw recovery controls.

### Shared validation

Persisted/current/imported data uses structural and semantic validation, including:

- profile count/unique IDs/active-profile identity;
- settings bounds;
- canonical mastery keys/counters;
- multiplication answer correctness;
- attempt correctness semantics;
- mistake history invariants;
- bounded session summaries and retention;
- generated/review seed semantics;
- optional goal bounds;
- shared 2 MB encoded-text budget.

### Schema 1 → 2 migration

Valid schema-1 data receives:

- per-profile `sessions: []`;
- per-profile `masteredFactsGoal: null`;
- default session retention `25`;
- `schemaVersion = 2`.

The result still passes full schema-2 validation.

## Infrastructure layer

`src/infrastructure/` contains runtime-facing adapters that remain usable by the shared product:

- persistence/storage validation and classification;
- schema migration;
- speech synthesis wrapper;
- structured redacted logging;
- small interface/browser preferences;
- random seed creation;
- PWA lifecycle events;
- optional browser install-prompt modeling.

The native shell deliberately keeps learner state in the same webview/local-storage application model instead of inventing a separate Rust database or native persistence schema.

## Platform layer

`src/platform/` contains the intentionally small runtime split.

### Runtime detection

`runtime.ts` exposes:

- `runtimePlatform`;
- `isNativeShell`;
- `isMobileNativeShell`;
- `shouldRegisterPwaServiceWorker()`.

Build-time values come from Vite/Tauri environment metadata. Tests/non-Vite contexts safely fall back to `web` instead of throwing on absent injected constants.

### External destinations

`openExternalUrl.ts` keeps normal anchor behavior on web builds and uses `@tauri-apps/plugin-opener` in native builds.

The native capability allows only maintained TableSpark destinations. It does not expose arbitrary shell execution or arbitrary filesystem opening.

## Web/PWA lifecycle

Web builds retain the existing PWA behavior:

- generated service worker;
- precached application shell;
- offline-ready notification;
- non-blocking update-ready prompt;
- optional browser install prompt.

`main.tsx` registers the PWA service worker only when `shouldRegisterPwaServiceWorker()` is true.

## Native lifecycle

Packaged Tauri builds deliberately skip PWA service-worker registration.

Their frontend assets are embedded/served by the native package, so application updates belong to signed installer/store replacement rather than a second browser service-worker updater.

The repository currently does not enable a Tauri native updater plugin. Adding one would require signed update infrastructure and a separate security/release decision.

## Native Rust shell

`src-tauri/src/lib.rs` constructs the application and registers only the opener plugin.

`src-tauri/src/main.rs` is the desktop entrypoint. The library uses Tauri’s mobile entrypoint attribute so the same native shell can be compiled into generated Android/iOS projects.

The native application identifier is:

```text
in.sanskar.tablespark
```

## Native permissions

`src-tauri/capabilities/default.json` defines the native IPC boundary.

Current permissions:

- `core:default`;
- scoped `opener:allow-open-url` entries for maintained TableSpark support/project/funding destinations.

Not granted:

- general shell/process execution;
- general filesystem access;
- arbitrary native URL opening;
- background remote-data collection;
- broad device APIs.

Future native APIs must be added through least-privilege capabilities and documented/tested.

## Native webview CSP

Production Tauri assets use an explicit CSP that restricts default content to packaged/self assets and Tauri IPC, with only required local image/style/font sources.

A separate development CSP permits the local Vite/HMR transport needed during native development.

Tauri can inject script/style hashes/nonces into bundled assets at compile time. Native CSP configuration is also required by the repository’s native configuration gate.

## Vite/Tauri integration

`vite.config.ts` exposes:

```text
__TABLESPARK_NATIVE__
__TABLESPARK_PLATFORM__
```

It also honors Tauri’s `TAURI_DEV_HOST` when present. This matters for physical iOS development, where the CLI can replace the `localhost` development URL with a reachable host/TUN address.

Ordinary web/desktop/Android local-tunnel development does not unnecessarily expose Vite network-wide when `TAURI_DEV_HOST` is absent.

## Native icons

`public/logo.svg` remains the maintained logo source.

`npm run native:icons` invokes Tauri’s icon generator, producing platform-specific Windows/macOS/Linux/Android/iOS icon assets under `src-tauri/icons/`.

Those generated files are ignored and reproduced before native package builds.

## Platform configuration

### Shared

`src-tauri/tauri.conf.json` defines:

- product name/version source;
- app identifier;
- Vite development/build hooks;
- embedded frontend distribution path;
- desktop window defaults;
- production/development CSP;
- bundle metadata/icons.

### Android

`src-tauri/tauri.android.conf.json` defines:

- minimum SDK 24;
- `.debug` application-ID suffix for debug installations.

### iOS/iPadOS

`src-tauri/tauri.ios.conf.json` defines minimum system version 14.0.

## Native configuration gate

`scripts/native-config.mjs`, `native-config-check.mjs`, and `native-config.test.mjs` keep maintained native invariants synchronized.

The gate checks:

- Cargo/package version consistency;
- package-sourced Tauri product version;
- app identifier;
- `frontendDist` and `devUrl`;
- production/development CSP presence;
- required icon declarations;
- required native/mobile scripts;
- Tauri CLI/opener dependencies;
- Android/iOS minimums.

It is included in `npm run check` without requiring Rust so web CI can catch configuration drift early.

## Native CI architecture

`.github/workflows/native.yml` is separate from ordinary web CI.

It verifies:

- Windows desktop compile;
- macOS desktop compile;
- Linux desktop compile;
- Android debug APK compile;
- iOS simulator compile;
- Rust formatting/type checks;
- generated native icons/frontend integration.

Production signing credentials are intentionally excluded from pull-request CI.

## Signing/distribution boundary

Cross-platform source/build support does not imply signed public packages already exist.

Production native release requires owner-controlled platform signing/distribution setup. Common signing files are ignored by Git and must never be committed.

See `SECURITY.md`, `docs/release.md`, and `docs/release-evidence.md`.

## Accessibility architecture

The same semantic React UI is packaged across targets. Shared accessibility structure includes:

- native HTML controls;
- labels/descriptions/live regions;
- focus visibility;
- skip navigation;
- touch sizing/responsiveness;
- reduced motion;
- large text;
- language metadata;
- optional speech fallback;
- profile-safe print output.

System webviews and assistive technologies differ, so real NVDA/Narrator/VoiceOver/TalkBack testing remains a platform release gate rather than being inferred from browser automation.

## Localization

`LocaleProvider` and typed message catalogs remain shared across web/native targets.

English/Hindi catalogs use platform-neutral wording for data/update/speech behavior. Visible version metadata is tested against `package.json`.

## Worksheet/print architecture

Worksheet math/model is shared. The host browser/system webview owns final print-dialog/engine behavior, so physical/native platform print review remains part of release evidence.

## Dependency direction

Preferred direction:

```text
UI/features → state/application wiring → domain
UI/features → infrastructure/platform adapters only when required
UI/features → i18n provider/messages
platform → narrow official native bridge packages
infrastructure → domain types/constants
domain → no React/browser/Tauri dependency
src-tauri → packages shared frontend; does not reimplement domain features
scripts → repository tooling; no application runtime dependency
```

## Architecture records

Existing ADRs remain historical/current for their scopes:

- ADR 0001 — TypeScript/React PWA foundation;
- ADR 0002 — local-first persistence;
- ADR 0003 — deterministic seeded practice;
- ADR 0004 — preserve unreadable local state until explicit recovery.

The explicit cross-platform requirement supersedes the earlier native-packaging deferral described by old evaluation wording. The current implemented native architecture and rationale live in `docs/native-packaging-evaluation.md`.

Web host selection remains documented separately in `docs/deployment-evaluation.md`.
