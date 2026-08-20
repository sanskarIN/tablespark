# Security Policy

## Supported versions

Security fixes target the latest maintained `main` release line and the newest verified release candidate. The current prepared candidate is TableSpark `2.0.12`; this does not imply the final tag or signed native packages have been published.

## Reporting a vulnerability

Do **not** open a public issue for a vulnerability that could expose learner data, bypass an important validation boundary, enable code execution, leak secrets/signing material, abuse a native permission, or create meaningful supply-chain risk.

Report security concerns privately to:

- `sanskarin@outlook.in`
- `supportramsandesh@gmail.com`

Include:

- affected version/commit/platform;
- concise impact description;
- reproduction steps without real personal data or credentials;
- expected behavior;
- suggested mitigation if available.

Do not send passwords, tokens, signing keys, private keys, real learner records, raw recovery artifacts, or unrelated sensitive information.

## Security model

TableSpark is a local-first application sharing one React/TypeScript product across web/PWA and Tauri 2 native packages for Windows, macOS, Linux, Android, and iOS/iPadOS.

Core learning workflows do not require authentication, a TableSpark backend, payments, advertising SDKs, or remote analytics. Native packaging does not change that model.

Primary security boundaries include:

- validation of persisted/imported JSON using a versioned schema;
- explicit rejection of unsupported state versions;
- preservation of known-invalid local state instead of automatic overwrite;
- distinction between invalid returned data and storage whose read operation itself is unavailable;
- suppression of automatic writes when startup storage could not be read;
- transactional backup replacement that changes current state only after successful durable write;
- a shared 2 MB persistence/import budget;
- profile identity/capacity validation;
- canonical mastery-key and learning-record invariants;
- user-visible persistence/recovery status;
- no `dangerouslySetInnerHTML` for user-controlled content;
- no custom cryptography;
- structured log redaction;
- repository secret scanning;
- dependency auditing and Dependabot;
- CodeQL analysis;
- least-privilege GitHub Actions permissions;
- a minimal Tauri native capability set;
- strict external-URL allowlisting in the native opener capability;
- production signing material excluded from source control and pull-request CI.

## Native application trust boundary

The native Tauri shell is deliberately small.

Current native capabilities are limited to:

- Tauri core defaults required to run the application window/webview;
- opening the maintained TableSpark email, GitHub, source, and funding destinations through the operating system.

The project does **not** grant general-purpose native:

- shell/process execution;
- arbitrary filesystem access;
- arbitrary URL opening;
- privileged device APIs;
- background data upload;
- authentication/token storage.

Any future native permission must have a concrete product requirement, least-privilege scope, tests, security/privacy documentation, and a browser/native behavior review before being merged.

The native URL allowlist is maintained in `src-tauri/capabilities/default.json`. Broadening it should be treated as a security-sensitive change.

## Native signing and store credential boundary

Public native distribution introduces credentials that ordinary web builds do not need.

Never commit:

- Android `.jks` or `.keystore` files;
- Android `keystore.properties` or signing passwords;
- Apple `.p8` private keys;
- Apple `.p12` certificates/private keys;
- provisioning profiles used for private distribution configuration;
- store API tokens/credentials;
- Windows/macOS code-signing private keys.

The root `.gitignore` blocks common signing artifacts as defense in depth. This does not make it safe to paste secrets into source, logs, workflow YAML, issues, or test fixtures.

Production signing secrets must not be exposed to fork/untrusted pull-request jobs. If signed release automation is added later, use protected release environments/secret storage and tightly scoped release permissions.

If a signing key is exposed, treat it as compromised and follow that platform’s revocation/rotation/replacement procedure before publishing another artifact.

## Native generated-output boundary

Generated files are intentionally separated from maintained source:

- `src-tauri/target/` — Rust build output;
- `src-tauri/gen/` — generated Android/iOS IDE projects;
- `src-tauri/icons/` — reproducibly generated platform icons.

The mobile projects and icons are regenerated from maintained configuration/source rather than manually patched as source-of-truth artifacts. Security-relevant platform configuration belongs in tracked Tauri configuration/capability files.

## Web/PWA versus native update boundary

Web/PWA builds can register the service worker and use the non-blocking PWA update lifecycle.

Packaged native builds deliberately do **not** register the PWA service worker. Native updates belong to the signed package/store distribution lifecycle so an installed application does not run an additional browser-style updater on top of its packaged assets.

The repository does not currently enable the Tauri updater plugin.

## Local-storage isolation boundary

A browser/PWA origin and each native installation use platform-managed local storage/webview storage. TableSpark does not search another application’s private storage or silently copy learner data between installations.

Cross-platform learner-data movement uses validated backup export/import. This explicit portability boundary avoids granting broad filesystem/native-storage permissions just to migrate data.

## Repository secret scanning

The repository includes a dependency-free scanner under `scripts/` for common high-risk credential patterns. It reports file/line/finding type without echoing the matched credential value.

Run:

```bash
npm run test:security
npm run secret:scan
```

The scanner is defense in depth, not permission to commit secrets. If a real secret is accidentally committed, revoke/rotate it first and then remediate history/artifacts as appropriate.

## Backup trust boundary

Imported backups are untrusted input. TableSpark:

1. rejects input above the byte-size budget before JSON parsing;
2. checks the persisted schema version;
3. validates object shapes and numeric bounds;
4. verifies canonical mastery keys and mathematical/progress invariants;
5. verifies profile identity consistency;
6. verifies mistake/session/goal semantics;
7. asks for explicit confirmation before destructive replacement;
8. refuses replacement when startup storage could not be read;
9. writes the validated replacement first;
10. replaces current in-memory state/reports success only after the write succeeds.

If replacement storage fails, current state stays unchanged and import reports failure.

Do not weaken validation merely to accept manually edited backups. Supported format evolution should use tested migrations.

## Known-invalid stored-state boundary

A value that was successfully read but fails parsing, migration, or validation is not equivalent to empty storage.

TableSpark preserves that raw value, uses temporary in-memory defaults, pauses automatic persistence, and offers explicit download/valid replacement/confirmed discard recovery.

Raw recovery downloads can contain learner information. They must never be published as routine issue/CI evidence.

## Unavailable storage-read boundary

If the runtime storage read itself throws, TableSpark did not obtain learner data and cannot safely call the store empty or corrupted.

In this state TableSpark:

- uses temporary in-memory defaults only to keep the UI usable;
- does not activate known-invalid-value recovery;
- pauses automatic learner-state writes;
- disables validated backup actions that could misrepresent or overwrite unknown inaccessible data;
- shows a persistence warning.

This is intentionally different from a later write failure after valid state has already loaded.

## Native configuration integrity

Run:

```bash
npm run test:native-config
npm run native:config:check
```

The gate checks maintained cross-platform invariants including:

- Cargo/package version consistency;
- package-sourced Tauri version;
- application identifier;
- frontend build/development paths;
- required native icons;
- required desktop/mobile build scripts;
- Tauri CLI/opener dependencies;
- Android minimum API;
- iOS minimum system version.

This check is part of `npm run check`.

## Dependency and CI security

The standard CI `quality` job runs formatting, linting, strict type checks, application tests, security tests/scanning, documentation checks, native-configuration checks, production build, and production dependency audit. CodeQL runs separately.

`.github/workflows/native.yml` uses read-only repository permissions and performs unsigned/debug/simulator-safe cross-platform compilation. It must remain free of production signing credentials while triggered by pull requests.

Dependency/native-toolchain updates should be reviewed for:

- release notes and breaking changes;
- install/build scripts;
- provenance/repository ownership where relevant;
- newly requested browser/native capabilities;
- bundle/runtime impact;
- changes to platform minimum versions;
- signing/distribution implications.

## Release artifact security

The tagged web release publishes a ZIP plus SHA-256 integrity metadata. The checksum is not a cryptographic publisher signature.

Native production packages must be verified against the intended source version/commit and their platform signing identity. Debug APKs, simulator builds, and unsigned desktop compile outputs are build evidence, not production-signed release artifacts.

## Disclosure

After a fix is available, maintainers may publish a concise advisory describing affected versions/platforms, impact, remediation, and reporter credit when desired.
