# Changelog

All notable changes to TableSpark are documented here. The project follows semantic-versioning intent and uses Keep-a-Changelog-style sections without copying release notes verbatim from tooling.

## [Unreleased]

### Added

- Strict TypeScript React PWA architecture.
- Responsive light, dark, and system themes.
- Custom multiplication table ranges, multiplier ranges, and step sizes.
- A 5,000-row generation budget that protects the browser from oversized worksheet rendering.
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
- User-visible warning when browser storage cannot persist current state.
- Unreadable stored-state recovery that preserves the original raw value until valid replacement or confirmed discard.
- Private raw recovery download for unreadable local data.
- Resilient browser preference storage for onboarding state and interface locale.
- Large-text classroom mode and reduced-motion option.
- Progressive browser speech-synthesis controls with unavailable/failure fallback.
- First-run onboarding and offline status feedback.
- Non-blocking PWA update-ready and offline-ready notices.
- Optional browser-provided PWA installation prompt that never creates an account and can be dismissed.
- User-safe error boundary and structured redacted logging.
- A central runtime locale provider with typed message catalogs.
- A complete Hindi (`hi`) interface catalog with persisted language switching and `<html lang>` updates.
- Keyboard shortcut reference available from the navigation, `?` help, `Escape` dismissal, and Alt+1 through Alt+5 section shortcuts where available.
- Unit, property-based, integration, and browser end-to-end tests.
- Browser-assisted accessibility invariants for landmarks, labels, image alternatives, and shortcut reachability.
- Dependency-free repository credential-pattern scanner with a dedicated Node test suite.
- GitHub Actions CI, CodeQL, Dependabot, and tagged release automation.
- SHA-256 integrity metadata alongside packaged web release artifacts.
- Project governance, privacy, security, support, localization, accessibility, deployment-evaluation, native-packaging-evaluation, and engineering documentation.
- ADR 0004 documenting preservation of unreadable local state until explicit recovery.

### Changed

- Practice sessions no longer begin from the same fixed seed; the generated seed remains visible so a session can be repeated exactly.
- Mistake review now selects unique commutative facts instead of repeating equivalent recent mistakes.
- Mistake-review completion no longer shows generated-seed replay controls.
- Completed practice drills now append only a compact session summary rather than duplicating every submitted answer into session history.
- Reducing the configured session-history retention limit trims older local summaries immediately.
- Resetting active-profile progress now clears mastery, recent mistakes, and session history while leaving the optional goal available to reuse or clear separately.
- Settings disable text-to-speech controls when the browser cannot provide a usable speech synthesis API.
- Product UI strings are resolved through the central locale provider instead of being read directly by feature modules.
- The interface locale preference is stored separately from exported learner-state JSON.
- Persistence moved to schema version 2 while retaining the existing localStorage key so valid schema-1 data can be migrated in place.
- Persistence and imported backups now share the same size and profile-count constraints.
- Startup storage handling now distinguishes empty, valid, and unreadable stored state.
- Ordinary backup export is disabled while unreadable stored data is being preserved because the visible state is temporary.
- Release packaging now publishes a checksum file for the exact ZIP artifact.
- Native packaging remains deferred after architecture evaluation; the PWA remains the canonical product for the current requirements.
- Static-host candidates are documented without activating a production deployment before repository-owner approval.

### Security

- Backup validation rejects malformed or unsupported state.
- Imported state validates unique profile IDs, active-profile identity, canonical mastery keys, mastery counter invariants, multiplication answers, attempt correctness, and mistake-history semantics.
- Schema-2 validation also checks session-summary bounds, generated/review seed semantics, supported retention limits, retained-history length, and optional goal bounds.
- Both imported and current persisted state are limited to the 2 MB byte budget.
- Existing unreadable local data is never automatically overwritten by temporary defaults.
- Structured logging redacts sensitive field names and recognizable credential/email values.
- Repository CI tests and runs the built-in credential-pattern scanner without printing matched secret values.
- GitHub Actions use scoped permissions.
- Production dependency auditing is part of CI.

### Accessibility

- The in-app shortcut reference uses dialog semantics with an accessible name and description.
- Stable browser checks verify the skip link, main/navigation landmarks, native control labels, image `alt` attributes, and keyboard access to shortcut help.
- The manual accessibility document now includes explicit NVDA, Narrator, VoiceOver, and TalkBack verification rows without claiming unexecuted passes.
- Printed classroom output keeps local profile identity out of learner metadata by default.
- Locale switching updates the document language so assistive technology can apply the appropriate language rules.

### Fixed

- Browser-storage write failures no longer crash the app or silently imply durable saving.
- Corrupted or newly-invalid local state is preserved for recovery instead of being destroyed by the next automatic save.
- Onboarding and locale preference storage failures no longer break application startup or interaction.
- Speech synthesis exceptions no longer escape into user workflows.
- Seed validation rejects negative, fractional, and out-of-range values rather than silently coercing them through 32-bit arithmetic.
- Practice response input can no longer create unbounded integer values outside the supported application range.
- The browser smoke journey no longer depends on the removed worksheet hide-answers checkbox and now exercises the worksheet composer instead.

## [0.1.0] - 2026-08-19

### Added

- Initial TableSpark repository implementation baseline.

[Unreleased]: https://github.com/sanskarIN/tablespark/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sanskarIN/tablespark/releases/tag/v0.1.0
