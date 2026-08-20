# TableSpark Security and Trust Model

This engineering reference expands `SECURITY.md` for the current TableSpark 2.0.12 architecture: one local-first React/TypeScript product delivered as web/PWA or through a thin Tauri 2 shell on Windows, macOS, Linux, Android, and iOS/iPadOS.

Core learning requires no TableSpark backend, login, payment processor, advertising SDK, remote analytics SDK, or production application API secret.

Any future change to those facts requires a new threat-boundary review rather than assuming this document still applies unchanged.

# Security goals

TableSpark aims to:

- prevent accidental destruction of local learner data;
- reject malformed or semantically impossible state/imports;
- distinguish empty, valid, invalid-returned, and unavailable storage states;
- make destructive backup replacement durable before reporting success;
- keep learner state local by default;
- keep native permissions narrowly scoped;
- keep production signing/store credentials out of source and untrusted CI;
- constrain native webview content using CSP;
- prevent external support/funding links from navigating the packaged app webview away from TableSpark;
- bound local input/state processing;
- avoid logging learner content/credentials;
- use least-privilege GitHub Actions permissions;
- preserve user-controlled update/install behavior;
- produce reproducible candidate artifacts/evidence without overstating signing/release status.

TableSpark does **not** claim that browser/system-webview local storage is encrypted secure storage or that application code can protect data after full device/browser-account compromise.

# Assets worth protecting

## Learner-local data

Potentially personal data includes:

- profile names/IDs/timestamps;
- mastery/accuracy/streak history;
- recent mistakes;
- session summaries;
- optional goals;
- learning/accessibility settings;
- backup JSON;
- known-invalid raw recovery data.

## Repository/release trust assets

- source/history integrity;
- GitHub token permissions;
- dependency/toolchain integrity;
- release tags/artifact identity;
- Android signing keys/keystores;
- Apple signing keys/certificates/provisioning credentials;
- Windows/macOS signing private keys;
- store/developer API credentials.

These signing/release assets must never be mixed with learner backup data or normal source fixtures.

# Trust boundaries

## 1. User/browser inputs

Table ranges, practice answers, profile names, search/filter values, settings, and imported file contents are untrusted input.

Domain/schema code validates bounds and invariants before these values become trusted application state.

React renders user strings as text, not raw HTML. Do not introduce `dangerouslySetInnerHTML` for imported/user content.

## 2. Runtime local storage

Browser `localStorage`/native system-webview storage is convenient local persistence, not a secret vault.

The application must treat returned serialized learner state as untrusted input every time it is restored/imported.

A browser/PWA origin and each native application installation have separate platform-managed storage sandboxes. TableSpark does not request broad native filesystem access to discover/copy another installation’s private storage.

Validated backup export/import is the supported cross-platform portability mechanism.

### Startup states

The storage adapter distinguishes:

```text
empty
loaded
invalid
unavailable
```

- `empty`: read succeeded, no learner value exists;
- `loaded`: read succeeded and value migrates/validates;
- `invalid`: read succeeded and returned a value that cannot be safely trusted;
- `unavailable`: the read operation itself threw before any learner value was obtained.

`invalid` preserves the raw returned value for explicit recovery.

`unavailable` must never be treated as empty/corrupt because TableSpark does not know what storage contains. Automatic writes remain paused so temporary defaults cannot overwrite unknown inaccessible data.

## 3. Backup import

Backup JSON is fully untrusted.

Pipeline:

```text
text byte-size budget
→ JSON parse
→ supported schema migration
→ structural validation
→ semantic validation
→ startup storage must be known/readable
→ confirmation
→ durable save
→ only then replace current React state/report success
```

Validation includes identity, mastery, multiplication, attempt, mistake, session, retention, seed, settings, and goal invariants plus the shared 2 MB budget.

If durable replacement fails, current state remains unchanged.

## 4. Raw recovery files

Known-invalid raw recovery data may contain personal content or arbitrary malformed text.

It is exported only for private recovery/inspection and must not be logged, published as CI evidence, or automatically uploaded.

## 5. Browser APIs/system webviews

Speech synthesis, printing, local storage, file/download behavior, service workers, and install prompts are supplied by the active browser/system webview/platform.

These capabilities can fail or differ by host. TableSpark treats optional failures as non-fatal where appropriate and does not claim identical platform implementation details.

# Web/PWA boundary

Web/PWA builds can register the generated service worker.

The service worker supports offline app-shell caching and non-blocking update-ready behavior. Optional browser install prompts are user initiated.

Web update/install behavior is a browser-origin boundary, not a native package updater.

# Native Tauri boundary

The native shell packages the shared frontend and exposes only the minimum native bridge currently needed.

## Rust shell

`src-tauri/src/lib.rs` constructs Tauri and registers only the opener plugin beyond core Tauri behavior.

The shell does not reimplement learning/persistence/domain features in Rust.

## Capability selection

`src-tauri/tauri.conf.json` explicitly selects:

```text
main-capability
```

The native config gate rejects accidental selection of additional capabilities.

`src-tauri/capabilities/default.json` scopes that capability to the `main` window.

## Native permissions currently granted

- Tauri `core:default`;
- URL opening for exact maintained TableSpark email/GitHub/source/funding destinations.

Not granted:

- general shell/process execution;
- arbitrary filesystem access;
- arbitrary URL opening;
- authentication credential access;
- unrestricted network API access;
- background learner-data upload;
- broad device sensors/APIs.

Any future native permission addition must state:

1. concrete product requirement;
2. why browser/shared behavior is insufficient;
3. minimum operation/resource scope;
4. privacy consequences;
5. tests/real-platform verification;
6. rollback/failure behavior.

# Native external navigation boundary

Web anchors behave normally in browsers.

Inside native builds, `src/platform/openExternalUrl.ts` delegates maintained destinations to the OS through `@tauri-apps/plugin-opener`.

This prevents normal support/project/funding navigation from replacing the packaged application webview.

The capability allowlist must remain exact. Broad wildcard URL access should be treated as a security change, not a convenience refactor.

# Native Content Security Policy

Packaged native assets use an explicit production CSP in `src-tauri/tauri.conf.json`.

Production policy principles:

- default to packaged/self/Tauri asset sources;
- allow only required Tauri IPC transport;
- permit required local style/font/image sources;
- block object/frame embedding;
- block form submission/base-URL rewriting;
- avoid arbitrary remote HTTP/HTTPS execution/content sources.

A separate `devCsp` permits local HTTP/WebSocket transport needed by Vite/Tauri development.

The native config gate requires both CSPs to exist.

Never solve a runtime problem by returning production CSP to `null`. Add the narrowest required directive/source and review why it is necessary.

# Native update boundary

Packaged native builds deliberately skip PWA service-worker registration.

Their assets belong to the native package/store lifecycle. Running a second browser-style service-worker update layer inside the packaged application would create conflicting update ownership.

The repository currently does not enable a Tauri updater plugin or generate updater artifacts.

If a native updater is introduced later, it must use signed update metadata/artifacts and receive a dedicated security/release design review.

# Mobile development host boundary

Physical iOS development may require a reachable frontend host. Vite only uses the Tauri-provided `TAURI_DEV_HOST` when that environment value exists.

Ordinary native/web development does not intentionally bind Vite network-wide by default.

Development CSP permits the HTTP/WebSocket transport needed for that workflow; production CSP does not inherit those broad development allowances.

# Generated native output boundary

Ignored generated paths:

```text
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
```

- `target/` is Rust build output;
- `gen/` contains Tauri-generated Android/iOS project files;
- `icons/` is generated from `public/logo.svg`.

Maintained security-sensitive configuration must remain in tracked Tauri/config/capability files rather than hidden in generated output.

# Native icon/input boundary

`public/logo.svg` is the source identity asset used to generate platform icons.

Native build scripts regenerate icons before package compilation. Generated icons are not accepted as an independent manually maintained source of truth.

# Native signing and distribution boundary

Cross-platform compilation does not equal public signed release.

## Signing material that must not enter source

Examples:

```text
*.jks
*.keystore
keystore.properties
*.p8
*.p12
*.mobileprovision
Windows/macOS signing private keys
store/developer API tokens
signing passwords
```

`.gitignore` blocks common artifacts as defense in depth. Real secret storage still requires protected release tooling/local signing environments.

## Pull-request CI rule

Untrusted/fork PR jobs must not receive production signing secrets.

Native CI therefore uses:

- unsigned/no-bundle desktop compile paths;
- Android debug APK;
- iOS simulator build.

These are source/build evidence only.

## Production distribution evidence

Before calling a native package released, verify:

- intended source SHA/version;
- correct package/bundle identifier;
- platform signing/publisher identity;
- installation/upgrade/replacement behavior;
- real target host/device behavior;
- store/developer-account ownership when relevant.

# Native configuration drift boundary

`scripts/native-config.mjs` plus tests/check validate high-risk static invariants without requiring platform SDKs.

Current checks include:

- package/Cargo version consistency;
- Tauri package-version source;
- app identifier;
- frontend paths;
- CSP/devCSP presence;
- exactly one selected `main-capability`;
- required native icons;
- native/mobile scripts/dependencies;
- Android/iOS minimum versions.

A failed gate should normally be fixed by correcting the maintained configuration, not weakening the validator.

# Repository/CI trust boundary

GitHub workflow changes can execute commands with repository token permissions and may process artifacts/secrets.

Principles:

- least privileges;
- reviewed third-party action updates;
- no production signing secrets in PR CI;
- secret scanning without echoing matched values;
- exact-head evidence for release decisions;
- debug artifacts not mislabeled as production packages.

Native Cross-Platform workflow uses read-only repository access.

# Dependency/supply-chain boundary

The application depends on npm and Rust/Tauri ecosystems plus platform SDKs/toolchains.

Review dependency/toolchain upgrades for:

- publisher/repository ownership/provenance;
- install/build scripts;
- breaking migrations;
- new capabilities/permissions;
- changed platform minimums;
- changed signing/distribution behavior;
- runtime/bundle impact.

Production npm dependency audit and CodeQL are defense layers, not proof of supply-chain safety.

# Logging boundary

Structured logs should contain technical events, not learner content.

Logger redaction covers sensitive-looking keys/recognizable sensitive values. Do not deliberately log secrets/backup/recovery contents and rely on redaction as the only defense.

# External services/funding boundary

Buy Me a Coffee and GitHub are external services reached only through explicit user navigation.

Core TableSpark learning does not require those services.

Native opener permission is scoped only to maintained destinations rather than broad arbitrary external navigation.

# Release artifact boundary

Tagged web releases publish:

```text
tablespark-web.zip
tablespark-web.zip.sha256
```

The SHA-256 file provides byte-integrity comparison, not publisher-signature proof.

Native debug/unsigned/simulator CI output is not a signed distribution artifact.

Production native artifact authenticity depends on platform signing identity and release-channel verification.

# Accessibility/privacy boundary

The shared semantic React UI reduces divergence, but system webviews/assistive technologies differ.

Automated browser accessibility tests do not prove NVDA/Narrator/VoiceOver/TalkBack behavior in packaged native applications. Human platform verification is a release gate.

Printed output deliberately avoids automatically inserting local learner profile names.

# Future backend/auth boundary

Adding accounts, cloud sync, remote learner storage, analytics, payments, or authentication would fundamentally change this threat model.

Before implementation, define at minimum:

- server/data ownership;
- authentication/session model;
- transport/storage encryption requirements;
- retention/deletion controls;
- authorization boundaries;
- privacy consent/notice;
- secret/key management;
- incident response;
- age/learner-data implications;
- native/web sync-conflict behavior.

Do not bolt a backend onto the current local-first trust model and continue using “no remote learner data” claims.

# Security review checklist

For a release candidate verify:

- imported/current state validation remains intact;
- four storage startup states behave distinctly;
- backup replacement remains transactional;
- profile capacity remains atomic;
- no learner/recovery data appears in logs/artifacts;
- native capability remains minimal/explicit;
- production CSP remains configured;
- PWA service worker remains disabled in native builds;
- native external URLs remain exact allowlisted destinations;
- signing secrets are absent from source/PR CI;
- native config gate passes;
- CI/CodeQL/native compile gates pass for exact candidate SHA;
- signed public native artifacts, if any, are tied to intended SHA/identity;
- manual real-device/accessibility checks are recorded rather than assumed.
