# Changelog

All notable changes to TableSpark are documented here. The project follows semantic-versioning intent and uses Keep-a-Changelog-style sections without copying release notes verbatim from tooling.

## [Unreleased]

### Added

- Strict TypeScript React PWA architecture.
- Responsive light, dark, and system themes.
- Custom multiplication table ranges, multiplier ranges, and step sizes.
- A 5,000-row generation budget that protects the browser from oversized worksheet rendering.
- Solved study sheets and blank printable worksheets with paper-only Name/Date metadata.
- Random-by-default practice sessions with visible, reproducible unsigned 32-bit seeds.
- Timed and untimed drills.
- Difficulty progression presets with configurable ranges/counts.
- Explicit bounded whole-number practice responses.
- Deduplicated recent-mistake review.
- Per-fact mastery, accuracy, streak tracking, and a transparent mastered-fact rule.
- Progress search plus All / Needs practice / Mastered filters.
- Multiple offline learner profiles with explicit profile capacity.
- Validated local persistence with explicit schema version handling.
- JSON backup export/import with a shared 2 MB persistence/import budget.
- User-visible warning when browser storage cannot persist current state.
- Unreadable stored-state recovery that preserves the original raw value until valid replacement or confirmed discard.
- Private raw recovery download for unreadable local data.
- Resilient browser preference storage for onboarding state.
- Large-text classroom mode and reduced-motion option.
- Progressive browser speech-synthesis controls with unavailable/failure fallback.
- First-run onboarding and offline status feedback.
- User-safe error boundary and structured redacted logging.
- Externalized English interface copy for future locale-provider expansion.
- Unit, property-based, integration, and browser end-to-end tests.
- Dependency-free repository credential-pattern scanner with a dedicated Node test suite.
- GitHub Actions CI, CodeQL, Dependabot, and tagged release automation.
- Project governance, privacy, security, support, and engineering documentation.
- ADR 0004 documenting preservation of unreadable local state until explicit recovery.

### Changed

- Practice sessions no longer begin from the same fixed seed; the generated seed remains visible so a session can be repeated exactly.
- Mistake review now selects unique commutative facts instead of repeating equivalent recent mistakes.
- Mistake-review completion no longer shows generated-seed replay controls.
- Settings disable text-to-speech controls when the browser cannot provide a usable speech synthesis API.
- English product UI strings are centralized in `src/i18n/en.ts` instead of being distributed across feature modules.
- Persistence and imported backups now share the same size and profile-count constraints.
- Startup storage handling now distinguishes empty, valid, and unreadable stored state.
- Ordinary backup export is disabled while unreadable stored data is being preserved because the visible state is temporary.

### Security

- Backup validation rejects malformed or unsupported state.
- Imported state validates unique profile IDs, active-profile identity, canonical mastery keys, mastery counter invariants, multiplication answers, attempt correctness, and mistake-history semantics.
- Both imported and current persisted state are limited to the 2 MB byte budget.
- Existing unreadable local data is never automatically overwritten by temporary defaults.
- Structured logging redacts sensitive field names and recognizable credential/email values.
- Repository CI tests and runs the built-in credential-pattern scanner without printing matched secret values.
- GitHub Actions use scoped permissions.
- Production dependency auditing is part of CI.

### Fixed

- Browser-storage write failures no longer crash the app or silently imply durable saving.
- Corrupted or newly-invalid local state is preserved for recovery instead of being destroyed by the next automatic save.
- Onboarding preference storage failures no longer break application startup/dismissal.
- Speech synthesis exceptions no longer escape into user workflows.
- Seed validation rejects negative, fractional, and out-of-range values rather than silently coercing them through 32-bit arithmetic.
- Practice response input can no longer create unbounded integer values outside the supported application range.

## [0.1.0] - 2026-08-19

### Added

- Initial TableSpark repository implementation baseline.

[Unreleased]: https://github.com/sanskarIN/tablespark/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sanskarIN/tablespark/releases/tag/v0.1.0
