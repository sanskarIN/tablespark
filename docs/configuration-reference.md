# TableSpark Configuration Reference

This document describes TableSpark 2.0.12 configuration as one synchronized web/PWA + Tauri native system.

## Configuration areas

1. product/runtime metadata and package scripts;
2. TypeScript/Vite/PWA build behavior;
3. cross-platform Tauri/Rust configuration;
4. Android/iOS target overrides;
5. native security capabilities/CSP;
6. test/E2E/lint/format/editor configuration;
7. Git/generated-output/signing hygiene;
8. GitHub Actions/repository automation.

A change in one area often requires coordinated changes elsewhere. The native configuration gate exists specifically to catch several high-risk drift cases automatically.

# `package.json`

Central Node/project manifest.

## Product metadata

Current values include:

```text
name: tablespark
version: 2.0.12
type: module
license: MIT
```

The semantic product version is separate from persisted learner `schemaVersion: 2` and the stable `tablespark.state.v1` storage key.

Project metadata also records repository/support/funding information and describes the product as supporting web, desktop, Android, and iOS.

## Runtime engines

```text
node >=22.12.0
npm >=10.0.0
```

Synchronize Node changes with `.nvmrc`, Actions workflows, setup docs, and any release environment assumptions.

## Web scripts

Important scripts:

```text
dev
build
preview
typecheck
lint
format
format:check
test
test:watch
test:coverage
test:e2e
test:security
secret:scan
test:docs
check
```

## Native configuration/quality scripts

```text
test:native-config
native:config:check
native:info
native:fmt
native:fmt:check
native:check
check:native
```

## Native build scripts

```text
native:icons
native:prepare
native:dev
native:build
native:build:ci
```

`native:prepare` generates icons from `public/logo.svg`.

`native:build:ci` uses Tauri `--no-bundle --no-sign` for host compile verification without requiring production installer signing.

## Android scripts

```text
android:init
android:dev
android:build
android:build:debug
```

## iOS scripts

```text
ios:init
ios:dev
ios:dev:device
ios:build
ios:build:simulator
```

`ios:dev:device` uses Tauri `--host` so physical-device development can supply a reachable Vite host through `TAURI_DEV_HOST`.

## Aggregate `check`

Current order:

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

Native Rust/mobile compilation remains separate because it requires platform SDKs.

## Dependencies

Runtime/shared application dependencies include React, React DOM, Zod, and the Tauri opener plugin.

Development dependencies include TypeScript/Vite/Vitest/Playwright/ESLint/Prettier plus the Tauri CLI.

Tauri JavaScript and Rust package versions should be reviewed together when upgrading so CLI/runtime/plugin compatibility remains intentional.

# `.nvmrc`

Pins the intended Node development line used by version managers.

Keep synchronized with `package.json` engines and Actions setup values.

# TypeScript configuration

## `tsconfig.json`

Project-reference root for application and Node/config TypeScript projects.

## `tsconfig.app.json`

Strict application configuration. Important choices include:

- ES2022 target/libraries;
- bundler module resolution;
- strict mode;
- no emit;
- exact optional-property handling;
- unchecked-index protection;
- DOM/Vite/Vitest/testing-library types.

The `src/vite-env.d.ts` declarations add:

```text
__TABLESPARK_NATIVE__
__TABLESPARK_PLATFORM__
```

These are Vite-defined build constants used by `src/platform/runtime.ts`.

## `tsconfig.node.json`

Covers Node/config TypeScript such as Vite/Playwright/Vitest configuration.

# `vite.config.ts`

Vite is the shared frontend build for both web/PWA and Tauri packages.

## Runtime target detection

Vite reads:

```text
TAURI_ENV_PLATFORM
TAURI_DEV_HOST
```

`TAURI_ENV_PLATFORM` determines whether the build is packaged/native versus ordinary web.

Build constants:

```text
__TABLESPARK_NATIVE__
__TABLESPARK_PLATFORM__
```

The shared React runtime uses these constants to decide whether browser/PWA-specific lifecycle behavior should run.

## Mobile development host

When `TAURI_DEV_HOST` exists, the Vite server binds to that supplied host and HMR uses the same host on the configured websocket port. This supports physical iOS development while avoiding broad network binding for ordinary development sessions.

Without `TAURI_DEV_HOST`, normal Vite host behavior remains local.

## Fixed ports

```text
dev: 5173
preview: 4173
```

Strict ports prevent silent divergence from Tauri/Playwright expected URLs.

## PWA plugin

`vite-plugin-pwa` still creates the web/PWA manifest/service worker.

The shared build can contain PWA assets even for native packaging, but `src/main.tsx` does not register the service worker when `__TABLESPARK_NATIVE__` is true.

This keeps one frontend build system while preventing a browser-style service-worker updater inside packaged applications.

## Build target/output

```text
target: es2022
sourcemap: true
frontend output: dist/
```

# Tauri/Rust configuration

Native maintained source is under `src-tauri/`.

## `src-tauri/Cargo.toml`

Rust package manifest.

Important values:

```text
package name: tablespark
package version: 2.0.12
edition: 2021
rust-version: 1.77.2
library crate types: staticlib, cdylib, rlib
```

Dependencies currently include:

- `tauri`;
- `tauri-plugin-opener`;
- `tauri-build` as build dependency.

Release profile favors a small packaged binary with abort panic behavior, LTO, single codegen unit, size optimization, and stripping.

The Cargo package version is validated against `package.json` by the native config gate.

## `src-tauri/build.rs`

Runs `tauri_build::build()` so Tauri build-time configuration/code generation is integrated into Cargo.

## `src-tauri/src/lib.rs`

Shared native application entrypoint.

It:

- uses Tauri’s mobile entrypoint attribute when compiled for mobile;
- creates the builder;
- registers only `tauri-plugin-opener` beyond core Tauri behavior;
- runs the generated application context.

## `src-tauri/src/main.rs`

Desktop executable entrypoint.

On non-debug Windows builds it suppresses the extra console window via the normal `windows_subsystem = "windows"` attribute.

# `src-tauri/tauri.conf.json`

Primary native application configuration.

## Identity/version

```text
productName: TableSpark
version: ../package.json
identifier: in.sanskar.tablespark
```

The Tauri version source intentionally points to `package.json` so native package version follows the product semantic version.

## Frontend integration

```text
beforeDevCommand: npm run dev
devUrl: http://localhost:5173
beforeBuildCommand: npm run build
frontendDist: ../dist
```

These values must remain synchronized with Vite/package scripts. The native config gate checks the critical path/URL values.

## Main window

Current defaults include:

```text
label: main
width: 1180
height: 800
minWidth: 360
minHeight: 560
resizable: true
fullscreen: false
center: true
```

Keep the `main` window label synchronized with native capability window scoping.

## Explicit native capability selection

```json
"capabilities": ["main-capability"]
```

This intentionally avoids implicit activation of every future capability file. The config gate requires exactly this selection.

## Production CSP

Production native webview CSP restricts packaged content/IPC to the minimum currently needed. Important principles:

- default to self/Tauri packaged asset protocols;
- permit Tauri IPC transport;
- permit local packaged fonts/images/styles as needed;
- disallow objects/frames/forms/base rewriting;
- do not add broad `http:`/`https:` network permissions to production just for convenience.

## Development CSP

`devCsp` is broader only where needed for local Vite/HMR HTTP/WebSocket development. Production and development policies are deliberately separate.

Do not solve a native CSP problem by reverting to `csp: null`. Add the narrow required source/protocol and document/security-review the change.

## Bundle icons

Declared desktop icon paths:

```text
icons/32x32.png
icons/128x128.png
icons/128x128@2x.png
icons/icon.icns
icons/icon.ico
```

These files are reproducibly generated from `public/logo.svg` before native package builds and are ignored as generated output.

## Bundle metadata

Includes Education category, TableSpark descriptions, publisher/copyright metadata, all host-supported targets, and no native updater artifacts.

`createUpdaterArtifacts: false` matches the current decision not to enable a native automatic updater until signing/update infrastructure is explicitly designed.

# `src-tauri/tauri.android.conf.json`

Android-specific override:

```text
minSdkVersion: 24
debugApplicationIdSuffix: .debug
```

The debug suffix keeps development/debug identity separate from normal release identity.

Changing the minimum SDK must update native config tests, CI/toolchain assumptions, setup/release docs, and platform support claims.

# `src-tauri/tauri.ios.conf.json`

iOS/iPadOS-specific override:

```text
minimumSystemVersion: 14.0
```

Changing it requires synchronized config tests/docs/device support claims.

# `src-tauri/capabilities/default.json`

Defines `main-capability` for the `main` window.

Permissions:

- `core:default`;
- scoped `opener:allow-open-url` entries for maintained TableSpark support/email/GitHub/source/funding destinations.

No general shell, filesystem, arbitrary URL, or device permission is granted.

Treat capability broadening as a security/privacy-sensitive change.

The `$schema` path references generated Tauri schema metadata for editor validation; generated schema/project output remains ignored.

# Generated native directories

Ignored/reproducible:

```text
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
```

Do not hand-edit these as repository source of truth.

# `vitest.config.ts`

Configures jsdom-based application/unit/integration tests and V8 coverage behavior.

Platform runtime tests deliberately verify safe fallback when Vite-injected native globals are absent in the test environment.

# `playwright.config.ts`

Configures Chromium E2E against a production preview server.

It remains a web-level product integration gate. Native compilation and real installed-device behavior are verified separately.

# `eslint.config.js`

Maintains JavaScript/TypeScript/React Hooks/React Refresh/JSX accessibility rules with zero-warning CI policy.

Rust source is checked through Cargo tooling rather than ESLint.

# Prettier/editor config

Files:

```text
.prettierrc.json
.prettierignore
.editorconfig
.vscode/extensions.json
.vscode/settings.json
```

Package formatting includes Tauri JSON but not Rust; Rust formatting uses `cargo fmt`.

# `.gitignore`

Excludes ordinary generated output plus native generated/build/signing artifacts.

Important native entries:

```text
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
*.jks
*.keystore
*.p12
*.p8
*.mobileprovision
keystore.properties
```

Ignore rules are defense in depth. Never intentionally place real signing secrets in ignored repository paths and assume that alone is secure handling.

# Environment placeholders

`.env.example` documents safe environment placeholders. Real `.env*` local secrets are ignored according to repository rules.

The current core product does not require backend credentials.

Native signing credentials are a separate protected release-operations concern and should not be modeled as ordinary committed application configuration.

# GitHub Actions configuration

Important workflow files:

```text
.github/workflows/ci.yml
.github/workflows/native.yml
.github/workflows/codeql.yml
.github/workflows/release.yml
.github/workflows/visual-evidence.yml
```

`native.yml` adds cross-platform compile verification while retaining read-only repository permissions and avoiding production signing secrets.

See `docs/ci-cd.md`.

# Native configuration validator

Files:

```text
scripts/native-config.mjs
scripts/native-config-check.mjs
scripts/native-config.test.mjs
```

The validator is deliberately Node-based so critical native config drift can fail the shared quality gate without requiring every contributor/web CI job to install Rust/mobile SDKs.

If you add a new cross-platform invariant that can be checked statically, extend this gate and its regression fixture.

# Synchronization checklist

## Change product version

Update/review:

- `package.json`;
- `src-tauri/Cargo.toml` package version;
- English/Hindi visible version copy;
- changelog/release docs;
- native config fixture/assertions.

`src-tauri/tauri.conf.json` should continue sourcing version from `../package.json`.

## Change app identifier

Update/review:

- `src-tauri/tauri.conf.json`;
- native config validator/tests;
- Android/iOS signing/store identity records;
- security/release documentation.

Changing an already-published platform package identifier can create a new app identity rather than an upgrade; do not change casually.

## Change Vite dev port

Update together:

- `vite.config.ts`;
- `src-tauri/tauri.conf.json` `devUrl`;
- native config validator/tests;
- Playwright if relevant;
- setup/command docs.

## Add native permission

Update/review:

- capability file;
- explicit capability selection if adding another capability intentionally;
- security/privacy model;
- native config tests when static invariants apply;
- real platform release evidence;
- threat/least-privilege review.

## Change CSP

Update/review:

- `src-tauri/tauri.conf.json`;
- native config tests;
- `SECURITY.md` / `docs/security-model.md`;
- native build/runtime tests.

## Change Android/iOS minimum

Update:

- platform-specific Tauri config;
- native config tests;
- setup/native packaging docs;
- CI if required SDK/toolchain changes;
- README/platform support matrix.

## Add/remove tracked files

Update:

- `docs/repository-file-reference.md` exhaustive inventory/count;
- documentation index/source-of-truth mapping where relevant.
