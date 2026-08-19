# Final Verification Plan

This file records the release-candidate verification expectations for the current TableSpark implementation.

A fresh verification branch and pull request should be created from the latest `main` after the current implementation and documentation pass is complete. The pull request exists to run the repository's full CI and CodeQL workflows against the exact release-candidate state.

Required automated checks:

- formatting;
- ESLint and JSX accessibility rules;
- strict TypeScript checking;
- Vitest application/domain/infrastructure tests;
- repository secret-scanner tests;
- repository credential-pattern scan;
- documentation-link-checker tests;
- local documentation link integrity check;
- production PWA build;
- production dependency audit;
- Playwright browser journeys;
- CodeQL JavaScript/TypeScript analysis.

Do not call the release candidate verified until the workflow conclusions have been fetched and reviewed. If a workflow remains queued because of an external runner/platform limitation, record the exact run status in `what_changed.md` instead of claiming success.

The manual release checklist remains in `docs/release.md`.
