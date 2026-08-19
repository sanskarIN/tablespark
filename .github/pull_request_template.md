## Summary

Describe the problem and the solution. Keep the change focused.

## User impact

Explain what a learner, teacher, contributor, or maintainer will notice.

## Verification

- [ ] Relevant unit/integration tests were added or updated.
- [ ] `npm run check` passes.
- [ ] `npm run test:e2e` was run when a primary browser journey changed.
- [ ] Production dependency audit was reviewed when dependencies changed.
- [ ] Accessibility was manually reviewed for visible UI changes.
- [ ] Documentation was updated for behavior/configuration changes.

## Data and security

- [ ] No credentials, secrets, private endpoints, or real learner data were added.
- [ ] No exported backup, unreadable recovery artifact, or raw local-storage value is included in fixtures/screenshots/logs.
- [ ] Persisted runtime limits still match import/schema limits.
- [ ] Persisted shape changes include a schema-version/migration decision and tests.
- [ ] Unreadable local state is not silently overwritten or discarded.
- [ ] `npm run test:security` and `npm run secret:scan` pass for security/repository-tooling changes.

## Screenshots

Add screenshots for meaningful UI changes after removing profile names or other private data. Otherwise write `Not applicable`.
