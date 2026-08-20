# Setup Guide

This guide prepares a machine for TableSpark 2.0.12 web/PWA development and, when desired, native Windows, macOS, Linux, Android, or iOS/iPadOS development.

## 1. Shared prerequisites

Every contributor needs:

- Git;
- Node.js `22.12.0` or newer;
- npm `10` or newer;
- a modern browser.

Recommended editor:

- Visual Studio Code with TypeScript, ESLint, and Prettier support.

Check:

```bash
git --version
node --version
npm --version
```

The repository’s Node requirement is also recorded in `.nvmrc` and `package.json`.

## 2. Clone and install JavaScript dependencies

```bash
git clone https://github.com/sanskarIN/tablespark.git
cd tablespark
npm install
```

Configure the requested project-local commit email if using a normal checkout:

```bash
git config user.email "sanskarin@outlook.in"
```

## 3. Web/PWA development

Start Vite:

```bash
npm run dev
```

Default development URL:

```text
http://localhost:5173
```

Build/preview:

```bash
npm run build
npm run preview
```

The web build writes `dist/`.

## 4. Browser end-to-end support

Install Playwright Chromium:

```bash
npx playwright install chromium
```

Minimal Linux/CI environments can use:

```bash
npx playwright install --with-deps chromium
```

Run browser tests:

```bash
npm run test:e2e
```

## 5. Shared repository verification

```bash
npm run check
```

This verifies:

```text
formatting
→ lint
→ strict TypeScript
→ application tests
→ secret-scanner tests
→ repository secret scan
→ documentation-link tests/check
→ native configuration tests/check
→ production web build
```

Production dependency audit:

```bash
npm audit --omit=dev --audit-level=high
```

## 6. Native prerequisites — all native targets

Native development additionally requires Rust and the platform-specific system dependencies used by Tauri.

Install Rust through the official Rust toolchain appropriate to your platform, then verify:

```bash
rustc --version
cargo --version
rustup --version
```

Use stable Rust:

```bash
rustup update stable
rustup default stable
```

Check the current Tauri environment after `npm install`:

```bash
npm run native:info
```

Check maintained native configuration without compiling Rust:

```bash
npm run test:native-config
npm run native:config:check
```

Check Rust formatting/types:

```bash
npm run check:native
```

## 7. Native icons

TableSpark keeps one source logo:

```text
public/logo.svg
```

Generate platform icons:

```bash
npm run native:icons
```

Native build scripts run this automatically. Generated output under `src-tauri/icons/` is ignored because it can be reproduced from the SVG.

## 8. Windows native setup

Required native pieces include:

- Rust stable with the normal Windows MSVC target/toolchain;
- Microsoft C++/Windows build tools required by Tauri;
- WebView2 runtime/development availability supplied by supported Windows environments.

After prerequisites:

```powershell
npm install
npm run native:info
npm run check:native
npm run native:dev
```

Compile without installer bundling/signing:

```powershell
npm run native:build:ci
```

Create host-supported native bundles/installers:

```powershell
npm run native:build
```

Production installer signing is not a source-code prerequisite and must use repository-owner signing material outside Git.

## 9. macOS native setup

Install/verify Xcode command-line/native build tools plus Rust.

```bash
xcodebuild -version
rustc --version
npm install
npm run native:info
npm run native:dev
```

Compile without package signing/bundling:

```bash
npm run native:build:ci
```

Create macOS bundles supported by the host:

```bash
npm run native:build
```

Normal public macOS distribution requires an appropriate Apple signing/notarization or App Store process. Signing credentials are not committed to this repository.

## 10. Linux native setup

The exact packages vary by distribution. On Ubuntu/Debian-class environments, the Native Cross-Platform workflow installs the Tauri desktop prerequisites used by CI:

```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

Then:

```bash
npm install
npm run native:info
npm run check:native
npm run native:dev
npm run native:build:ci
```

For public packaging:

```bash
npm run native:build
```

Test produced packages on the intended Linux distributions rather than assuming one CI image represents all distributions.

## 11. Android native setup

Android development requires:

- Java/JDK;
- Android SDK tools;
- Android NDK;
- Android platform/build tools;
- Rust Android targets;
- Android Studio is recommended for emulator/device/IDE workflows but the maintained build commands use the Tauri CLI.

The CI workflow uses Java 17 and the installed Android SDK/NDK on the runner.

Install Rust targets when setting up manually:

```bash
rustup target add \
  aarch64-linux-android \
  armv7-linux-androideabi \
  i686-linux-android \
  x86_64-linux-android
```

Ensure your Android SDK/NDK environment is discoverable by the Tauri toolchain.

Initialize generated Android project files:

```bash
npm run android:init
```

Generated project output is placed under `src-tauri/gen/` and is intentionally ignored.

Development run:

```bash
npm run android:dev
```

Debug APK build:

```bash
npm run android:build:debug
```

Production package build after signing configuration is available:

```bash
npm run android:build
```

Maintained Android configuration:

```text
identifier: in.sanskar.tablespark
minSdkVersion: 24
debug suffix: .debug
```

Never commit `.jks`, `.keystore`, `keystore.properties`, signing passwords, or store credentials.

## 12. iOS/iPadOS native setup

iOS commands require macOS with full Xcode tooling.

Verify:

```bash
xcodebuild -version
pod --version
```

Install the simulator Rust target used in CI:

```bash
rustup target add aarch64-apple-ios-sim
```

Initialize generated iOS project files:

```bash
npm run ios:init
```

Simulator build:

```bash
npm run ios:build:simulator
```

Normal development:

```bash
npm run ios:dev
```

For a physical iOS device where Tauri needs a reachable development host:

```bash
npm run ios:dev:device
```

Vite reads `TAURI_DEV_HOST` when the Tauri CLI supplies it, so the frontend server listens on the correct development address without exposing every native development session network-wide.

Production build after Apple signing/provisioning is configured:

```bash
npm run ios:build
```

Maintained minimum iOS version:

```text
14.0
```

Never commit Apple private keys/certificates/provisioning secrets.

## 13. Native generated files

Do not manually treat these as source of truth:

```text
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
```

They are ignored and regenerated by build/tooling commands.

Tracked native source/configuration lives in the rest of `src-tauri/`.

## 14. Local data while switching platforms

Browser/PWA and native installations use separate platform-managed local storage.

Do not copy private webview storage directories manually.

Use TableSpark:

```text
Settings → Data & privacy → Export backup
```

then import that validated JSON in the destination installation.

The same schema/migration/semantic validation rules apply regardless of source platform.

## 15. Native signing setup boundary

Cross-platform development/build support does not require committing signing material.

Before public native distribution, repository owners must configure the relevant platform signing/store process separately.

The repository ignores common signing artifacts:

```text
*.jks
*.keystore
*.p12
*.p8
*.mobileprovision
keystore.properties
```

Treat a signing key exposed in Git/CI logs as compromised.

## 16. Common problems

### `node` / `npm` not found

Reopen the terminal after installation and verify `PATH`.

### Node is too old

Use Node `22.12.0` or newer according to `package.json`/`.nvmrc`.

### Port 5173 is busy

TableSpark uses a strict Vite port. Stop the conflicting process rather than silently changing ports, because Tauri `devUrl` expects 5173.

### Playwright cannot launch Chromium

```bash
npx playwright install chromium
```

or on minimal Linux:

```bash
npx playwright install --with-deps chromium
```

### `cargo` / `rustup` unavailable

Install Rust before native work. Web/PWA development itself still does not require Rust.

### Tauri Linux build reports missing WebKit/GTK libraries

Install the native packages shown in the Linux section for the applicable distribution equivalents.

### Android NDK not detected

Verify the Android SDK/NDK installation/environment and run:

```bash
npm run native:info
```

before retrying `android:init` or `android:build:debug`.

### Physical iOS app cannot reach Vite

Use:

```bash
npm run ios:dev:device
```

and ensure Xcode/device networking is configured. The Tauri CLI supplies `TAURI_DEV_HOST`, which `vite.config.ts` consumes.

### Native link does not open externally

The native opener capability intentionally allows only maintained TableSpark destinations. Do not broaden the capability merely to work around a typo; verify the exact destination and capability first.

## 17. Next documents

- `docs/native-packaging-evaluation.md` — native architecture/platform commands/signing boundaries.
- `docs/commands-reference.md` — command-by-command reference.
- `docs/testing.md` — automated/manual verification.
- `docs/release.md` — release workflow and signing gates.
- `docs/troubleshooting.md` — additional diagnostics.
