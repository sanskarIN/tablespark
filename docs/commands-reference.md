# TableSpark Command Reference

Run commands from the repository root unless a section says otherwise. TableSpark 2.0.12 supports web/PWA plus Tauri 2 native Windows, macOS, Linux, Android, and iOS/iPadOS build paths.

## Runtime baseline

```bash
node --version
npm --version
```

Supported baseline:

```text
Node >= 22.12.0
npm >= 10
```

Native work additionally needs Rust and the target platform SDK/toolchain.

```bash
rustc --version
cargo --version
rustup --version
```

## Dependency installation

```bash
npm install
```

CI uses:

```bash
npm install --no-fund --no-audit
```

The explicit production advisory audit is run separately rather than being duplicated during installation.

## Web development

### Start Vite

```bash
npm run dev
```

Development URL:

```text
http://localhost:5173
```

The port is strict because Tauri’s `devUrl` expects 5173.

### Production web build

```bash
npm run build
```

Expands to:

```text
tsc -b && vite build
```

Output:

```text
dist/
```

### Preview production web build

```bash
npm run preview
```

Default preview URL:

```text
http://localhost:4173
```

## Type/lint/format

```bash
npm run typecheck
npm run lint
npm run format
npm run format:check
```

`format`/`format:check` cover maintained source/config patterns including `src-tauri/**/*.json`. Rust source formatting is handled by Cargo separately.

## Application tests

```bash
npm run test
npm run test:watch
npm run test:coverage
```

The normal test suite includes domain, persistence, state/integration, localization, PWA-adapter, and platform-runtime tests.

## Browser E2E

Install Chromium when needed:

```bash
npx playwright install chromium
```

Minimal Linux:

```bash
npx playwright install --with-deps chromium
```

Run normal browser journeys:

```bash
npm run test:e2e
```

Run one file:

```bash
npx playwright test e2e/smoke.spec.ts
```

Run one named test:

```bash
npx playwright test -g "Hindi interface selection persists across reload"
```

## Visual release evidence

Linux/macOS-compatible shell:

```bash
CAPTURE_RELEASE_EVIDENCE=1 npx playwright test e2e/release-evidence.spec.ts
```

PowerShell:

```powershell
$env:CAPTURE_RELEASE_EVIDENCE='1'
npx playwright test e2e/release-evidence.spec.ts
```

Output is written below `test-results/release-evidence/` and is ignored/generated evidence rather than source.

## Repository security

Test scanner implementation:

```bash
npm run test:security
```

Scan repository:

```bash
npm run secret:scan
```

A clean scan does not make it safe to commit credentials/signing keys. Real exposed credentials must be revoked/rotated.

## Documentation integrity

```bash
npm run test:docs
```

This runs the link-checker test suite and validates supported local Markdown targets.

## Native configuration integrity

### Tests

```bash
npm run test:native-config
```

Uses Node’s built-in test runner to verify the native configuration validator itself.

### Check real repository config

```bash
npm run native:config:check
```

Checks maintained native invariants including:

- version consistency;
- Tauri version source;
- application identifier;
- frontend paths;
- production/development CSP;
- explicit `main-capability` selection;
- bundle icons;
- required scripts/dependencies;
- Android/iOS minimum versions.

These checks do not require Rust or platform SDKs.

## Aggregate shared quality gate

```bash
npm run check
```

Current exact order:

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

Because shell `&&` chaining is used, execution stops on the first failed stage.

`npm run check` does not include Playwright E2E, Rust/native compilation, or network-backed production dependency audit; those remain separate gates.

## Production dependency audit

```bash
npm audit --omit=dev --audit-level=high
```

Do not lower the severity threshold solely to obtain a green release.

# Native desktop commands

## Tauri environment information

```bash
npm run native:info
```

Use this first when diagnosing Rust/system SDK/toolchain problems.

## Generate native icons

```bash
npm run native:icons
```

Expands to:

```bash
tauri icon public/logo.svg
```

Output is generated under `src-tauri/icons/` and ignored by Git.

## Native preparation

```bash
npm run native:prepare
```

Currently delegates to native icon generation. Package build commands invoke it automatically.

## Run desktop native development

```bash
npm run native:dev
```

Tauri starts the configured `beforeDevCommand` (`npm run dev`) and loads the Vite development URL into the native system webview.

## Check Rust formatting

```bash
npm run native:fmt:check
```

Write formatting:

```bash
npm run native:fmt
```

## Cargo type/compile check

```bash
npm run native:check
```

Expands to a Cargo check against `src-tauri/Cargo.toml`.

## Aggregate Rust/native check

```bash
npm run check:native
```

Runs native Rust formatting verification followed by `cargo check`.

## Compile current desktop host without installers/signing

```bash
npm run native:build:ci
```

This:

1. generates native TableSpark icons;
2. runs Tauri build integration/front-end production build;
3. compiles the current host target;
4. passes `--no-bundle --no-sign`.

Use this for local CI-equivalent compile validation.

## Build host-supported desktop packages

```bash
npm run native:build
```

This creates the bundles supported by the current operating system/toolchain. Public distribution may additionally require signing/notarization appropriate to the target.

# Android commands

Android commands require Java, Android SDK/NDK, and Rust Android targets.

## Generate/initialize Android project

```bash
npm run android:init
```

The generated Android project lives under ignored `src-tauri/gen/`.

CI can avoid re-installing Rust targets when it already installed them:

```bash
npm run android:init -- --skip-targets-install
```

## Android development

```bash
npm run android:dev
```

Use the device/emulator selection behavior supplied by the Tauri/Android toolchain.

## Debug APK

```bash
npm run android:build:debug
```

This generates icons first and compiles a debug APK. It is build evidence, not a production-signed Play Store artifact.

## Android production package command

```bash
npm run android:build
```

Production release output requires a separately configured owner-controlled signing setup. Do not commit keystores/passwords.

# iOS/iPadOS commands

iOS commands require macOS/Xcode.

## Generate/initialize iOS project

```bash
npm run ios:init
```

CI can use:

```bash
npm run ios:init -- --skip-targets-install
```

Generated Xcode project files live under ignored `src-tauri/gen/`.

## iOS development

```bash
npm run ios:dev
```

## Physical-device development host

```bash
npm run ios:dev:device
```

This adds Tauri’s `--host` behavior. When the Tauri CLI provides `TAURI_DEV_HOST`, `vite.config.ts` uses that host/HMR address so a physical iOS device can reach the development frontend.

## iOS simulator build

```bash
npm run ios:build:simulator
```

Current script compiles a debug `aarch64-sim` target after native icon preparation.

This is simulator compile evidence, not device signing/App Store evidence.

## iOS production build command

```bash
npm run ios:build
```

Requires Apple signing/provisioning as appropriate to the intended distribution path. Keep private keys/profiles outside Git.

# Git/release commands

## Inspect working tree/history

```bash
git status
git log -5 --oneline
git diff
git diff --staged
```

## Project-local commit email

```bash
git config user.email "sanskarin@outlook.in"
git config user.email
```

## Focused local commit

```bash
git add <paths>
git commit -m "fix: example focused change"
```

## Push branch

```bash
git push origin <branch-name>
```

## TableSpark 2.0.12 tag

Only after the exact candidate passes intended gates:

```bash
git tag -a v2.0.12 -m "TableSpark v2.0.12"
git push origin v2.0.12
```

Never silently move an already-public release tag to a different commit. Use a new patch version for a corrective release.

# Web release checksum

Linux/macOS-compatible shell:

```bash
sha256sum -c tablespark-web.zip.sha256
```

PowerShell:

```powershell
Get-FileHash .\tablespark-web.zip -Algorithm SHA256
Get-Content .\tablespark-web.zip.sha256
```

The checksum proves byte identity relative to the workflow-produced digest; it is not a publisher signature.

# Common failures

## `npm` / `node` missing

Install/fix supported Node/npm and reopen terminal.

## Node engine warning

Use Node 22.12.0 or newer according to `package.json`/`.nvmrc`.

## Port 5173 in use

Stop the conflicting process. Do not casually change the port because Tauri `devUrl` is synchronized to 5173 and checked by the native config gate.

## Missing Playwright browser

```bash
npx playwright install chromium
```

## Rust/Tauri failure

```bash
npm run native:info
npm run check:native
```

Inspect the first system/toolchain/compiler error rather than changing unrelated application code.

## Linux native library failure

Install the distribution-equivalent WebKitGTK/GTK/build dependencies documented in `docs/setup.md` and used by `.github/workflows/native.yml`.

## Android NDK/Rust target failure

Verify SDK/NDK environment, Java, and Rust Android targets. `npm run native:info` can help identify missing pieces.

## iOS simulator/device target failure

Verify macOS/Xcode/CocoaPods and the appropriate Rust target. Distinguish source compile errors from signing/provisioning failures.

## Native config check fails

Fix the named maintained invariant rather than weakening the validator to accept unintended drift.

## Native link does not open

The native opener is intentionally allowlisted. Confirm the destination exactly matches `src-tauri/capabilities/default.json`; do not broaden permission casually.

## CSP breaks native runtime

Treat CSP changes as security-sensitive. Add only the minimum required source/protocol and update the config test/security docs where appropriate; do not revert to `csp: null` just to make a feature work.

# What generated output should not be committed

```text
node_modules/
dist/
coverage/
playwright-report/
test-results/
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
```

Also never commit production signing material such as Android keystores, Apple private keys/certificates, provisioning profiles, or signing passwords.
