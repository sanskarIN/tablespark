# Changelog

All notable changes to TableSpark are documented here. The project follows semantic-versioning intent and uses Keep-a-Changelog-style sections without copying release notes verbatim from tooling.

## [Unreleased]

No post-2.0.12 changes have been assigned yet.

## 2.0.12 — cross-platform release candidate — 2026-08-20

The source/package/UI version is prepared as **2.0.12**. The `v2.0.12` Git tag and public release remain pending exact-head automated verification plus documented manual, signing, store, and device release gates.

### Added

- Strict TypeScript React application architecture with web/PWA and Tauri 2 native delivery paths.
- Native source/build support for Windows, macOS, Linux, Android, and iOS/iPadOS from the shared frontend and domain model.
- Tauri Rust shell under `src-tauri/` with a shared mobile/desktop entrypoint.
- Platform-specific Android and iOS Tauri configuration.
- Native application identifier `in.sanskar.tablespark`.
- Native icon generation from the existing `public/logo.svg` through the Tauri icon command.
- Narrowly scoped native opener permission for the maintained TableSpark GitHub, funding, and support destinations.
- Runtime platform abstraction that distinguishes web/PWA from packaged native builds.
- Native-safe external-link handling that opens supported destinations through the operating system.
- Native configuration validation and dedicated Node tests that detect version, identifier, icon, path, mobile-minimum, dependency, and script drift.
- Native Cross-Platform GitHub Actions workflow compiling desktop targets on Windows, macOS, and Linux, an Android debug APK, and an iOS simulator application.
- Android minimum SDK 24 configuration.
- iOS minimum system version 14.0 configuration.
- Tauri mobile development host handling through `TAURI_DEV_HOST` for physical-device development.
- Native signing/store credential ignore rules for Android keystores, Apple keys/certificates, and provisioning profiles.
- Responsive light, dark, and system themes.
- Custom multiplication table ranges, multiplier ranges, and step sizes.
- A 5,000-row generation budget that protects the runtime from oversized worksheet rendering.
- A dedicated worksheet composer with solved study-sheet, practice-worksheet, and answer-key modes.
- Configurable practice-sheet answer blanks using writing lines, a single box, or open writing space.
- A4 and US Letter portrait print selection plus one-, two-, and three-column worksheet layouts.
- Paper-only Name/Date metadata for learner-facing sheets while answer keys omit learner metadata.
- Random-by-default practice sessions with visible, reproducible unsigned 32-bit seeds.
- Timed and untimed drills.
- Five difficulty progression presets: Starter, Foundation, Builder, Fluency, and Challenge.
- Explicit bounded whole-number practice responses.
- Deduplicated recent-mistake review.
- Per-fact mastery, accuracy, streak tracking, and a transparent mastered-fact rule.
- Progress search plus All / Needs practice / Mastered filters.
- Bounded local practice-session summaries with configurable retention of the latest 10, 25, 50, or 100 sessions per profile.
- Optional per-profile mastered-facts goals without deadlines, streak pressure, penalties, or notification pressure.
- Recent-session presentation on the progress dashboard with type, mode, score, duration, completion time, and generated-drill seed where applicable.
- Multiple offline learner profiles with explicit profile capacity.
- Validated local persistence with explicit schema version handling and a schema-1-to-schema-2 migration.
- JSON backup export/import with a shared 2 MB persistence/import budget.
- User-visible warning when local runtime storage cannot persist current state.
- Unreadable stored-state recovery that preserves the original raw value until valid replacement or confirmed discard.
- Private raw recovery download for unreadable local data.
- Resilient interface preference storage for onboarding state and locale.
- Large-text classroom mode and reduced-motion option.
- Progressive speech-synthesis controls with unavailable/failure fallback.
- First-run onboarding and offline status feedback.
- Non-blocking PWA update-ready and offline-ready notices for web/PWA builds.
- Optional browser-provided PWA installation prompt that never creates an account and can be dismissed.
- User-safe error boundary and structured redacted logging.
- A central runtime locale provider with typed message catalogs.
- A complete Hindi (`hi`) interface catalog with persisted language switching and `<html lang>` updates.
- Keyboard shortcut reference available from the navigation, `?` help, `Escape` dismissal, and Alt+1 through Alt+5 section shortcuts where available.
- Unit, property-based, integration, browser end-to-end, native-config, and native compilation verification.
- Browser-assisted accessibility invariants for landmarks, labels, image alternatives, and shortcut reachability.
- Dependency-free repository credential-pattern scanner with a dedicated Node test suite.
- GitHub Actions CI, Native Cross-Platform CI, CodeQL, Dependabot, and tagged web-release automation.
- SHA-256 integrity metadata alongside packaged web release artifacts.
- Formal documentation-link and native-configuration gates in `npm run check`.
- Comprehensive documentation covering commands, configuration, CI/CD, domain rules, state/persistence, schema v2, security/trust boundaries, maintenance, glossary, localization, accessibility, release evidence, deployment, native packaging, and user/release operations.
- A locale-catalog regression assertion that keeps the visible English/Hindi version synchronized with `package.json`.

### Changed

- Application/package and visible English/Hindi release metadata target version `2.0.12`.
- The previous “PWA-only/native packaging deferred” architecture decision has been superseded by an explicit thin Tauri 2 native shell while the React/TypeScript product logic remains shared.
- Web/PWA builds continue to register the service worker; packaged native builds deliberately skip PWA service-worker registration and use the native package/store lifecycle.
- UI copy describing local data, speech availability, updates, and the About screen is platform-neutral rather than assuming a browser-only runtime.
- Native builds hand maintained external destinations to the operating system instead of navigating the application webview away from TableSpark.
- Generated native mobile projects, Rust target output, and generated native icons are reproducible build artifacts and are not tracked in Git.
- Browser/PWA and installed native applications keep separate platform-managed local-storage sandboxes; validated backup export/import is the supported portability boundary.
- Practice sessions no longer begin from the same fixed seed; the generated seed remains visible so a session can be repeated exactly.
- Mistake review selects unique commutative facts instead of repeating equivalent recent mistakes.
- Completed practice drills append only a compact session summary rather than duplicating every submitted answer into session history.
- Reducing the configured session-history retention limit trims older local summaries immediately.
- Product UI strings are resolved through the central locale provider.
- Persistence uses schema version 2 while retaining the existing storage key so valid schema-1 data can be migrated in place.
- Startup storage handling distinguishes empty storage, validated state, an existing returned value that is invalid, and storage whose read operation is unavailable.
- Automatic writes remain paused when startup storage could not be read.
- Backup replacement is transactional: a validated replacement must be durably saved before it replaces current in-memory state or reports success.
- Release packaging still publishes the canonical web ZIP/checksum automatically; signed native installers/APK/AAB/Apple distribution remain explicit platform-release operations requiring repository-owner signing credentials.

### Security

- Native permissions are minimal: the shell enables only core defaults plus scoped external URL opening; no general shell/process/filesystem permission is granted.
- Android/iOS signing material is explicitly excluded from source control.
- Pull-request native CI compiles unsigned/debug or simulator-safe targets and does not expose production signing credentials to untrusted code.
- Backup validation rejects malformed or unsupported state.
- Imported state validates unique profile IDs, active-profile identity, canonical mastery keys, mastery counter invariants, multiplication answers, attempt correctness, mistake-history semantics, session summaries, retention, seed semantics, and optional goal bounds.
- Current persisted state and imports are limited to the shared 2 MB byte budget.
- Existing unreadable local data is never automatically overwritten by temporary defaults.
- Unknown storage contents are not overwritten when the runtime blocks the initial learner-state read.
- Destructive backup replacement leaves current state unchanged if the validated replacement cannot be durably written.
- Structured logging redacts sensitive field names and recognizable credential/email values.
- Repository CI tests/runs credential-pattern scanning without printing matched values.
- GitHub Actions use scoped permissions.
- Production dependency auditing and CodeQL remain security gates.

### Accessibility

- The in-app shortcut reference uses dialog semantics with an accessible name and description.
- Stable browser checks verify the skip link, main/navigation landmarks, native control labels, image `alt` attributes, and keyboard access to shortcut help.
- The manual accessibility document includes explicit NVDA, Narrator, VoiceOver, and TalkBack verification rows without claiming unexecuted passes.
- Printed classroom output keeps local profile identity out of learner metadata by default.
- Locale switching updates the document language so assistive technology can apply the appropriate language rules.
- Native wrappers retain the same shared semantic React interface; real platform screen-reader, print, speech, touch, and device checks remain release-evidence gates.

### Fixed

- Native/platform constants now safely fall back to the web runtime when compile-time Tauri/Vite defines are absent, preventing test/runtime reference errors.
- Physical iOS development can use Tauri’s provided development host instead of incorrectly binding every native run to a broad host.
- Packaged native builds no longer register the PWA service worker.
- Native support/contact/funding links no longer navigate the TableSpark webview away from the application.
- Browser-storage write failures no longer crash the app or silently imply durable saving.
- Corrupted or newly invalid local state is preserved for recovery instead of being destroyed by the next automatic save.
- Storage read failures are no longer misclassified as corrupted learner data.
- Batched profile additions cannot exceed the documented 100-profile capacity.
- Failed backup writes no longer replace current in-memory state or report a successful destructive import.
- Table and practice validation failures use the active locale instead of exposing raw English domain exception text in Hindi UI.
- Invalid backup feedback uses localized generic copy instead of embedding raw parser/schema exception messages.
- Onboarding/locale preference failures and speech synthesis exceptions remain non-fatal.
- Seed and practice response validation enforce supported bounds.

## [0.1.0] - 2026-08-19

### Added

- Initial TableSpark repository implementation baseline.

[Unreleased]: https://github.com/sanskarIN/tablespark/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sanskarIN/tablespark/releases/tag/v0.1.0
