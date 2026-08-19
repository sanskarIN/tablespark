# Changelog

All notable changes to TableSpark are documented here. The project follows semantic-versioning intent and uses Keep-a-Changelog-style sections without copying release notes verbatim from tooling.

## [Unreleased]

### Added

- Strict TypeScript React PWA architecture.
- Responsive light, dark, and system themes.
- Custom multiplication table ranges, multiplier ranges, and step sizes.
- Print-friendly worksheet rendering.
- Deterministic seeded practice question generation.
- Timed and untimed drills.
- Mistake review.
- Per-fact mastery, accuracy, and streak tracking.
- Multiple offline learner profiles.
- Validated local persistence with explicit schema version handling.
- JSON backup export/import.
- Large-text classroom mode and reduced-motion option.
- Progressive browser speech-synthesis controls.
- First-run onboarding and offline status feedback.
- User-safe error boundary and structured redacted logging.
- Unit, property-based, integration, and browser end-to-end tests.
- GitHub Actions CI, CodeQL, Dependabot, and tagged release automation.
- Project governance, privacy, security, support, and engineering documentation.

### Security

- Backup validation rejects malformed or unsupported state.
- Imported backup UI limits file size.
- GitHub Actions use scoped permissions.
- Production dependency auditing is part of CI.

## [0.1.0] - 2026-08-19

### Added

- Initial TableSpark repository implementation baseline.

[Unreleased]: https://github.com/sanskarIN/tablespark/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sanskarIN/tablespark/releases/tag/v0.1.0
