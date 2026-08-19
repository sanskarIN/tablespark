# Security Policy

## Supported versions

Until the first stable release, security fixes target the latest `main` branch and the newest tagged release candidate. After stable releases begin, the project will document the supported release line here.

## Reporting a vulnerability

Please do **not** open a public issue for a vulnerability that could expose learner data, bypass an important validation boundary, enable code execution, leak secrets, or create a meaningful supply-chain risk.

Report security concerns privately to:

- `sanskarin@outlook.in`
- `supportramsandesh@gmail.com`

Include:

- the affected version or commit;
- a concise description of the issue;
- reproduction steps that do not include real personal data or credentials;
- expected impact;
- suggested mitigation if you have one.

Do not send passwords, tokens, private keys, real learner records, raw recovery artifacts, or unrelated sensitive information.

## Security model

TableSpark is an offline-first browser application. Core workflows do not require authentication, remote APIs, cookies, payments, or production secrets. This deliberately reduces the remote attack surface.

Primary security boundaries include:

- validation of persisted/imported JSON using a versioned schema;
- explicit rejection of unsupported state versions;
- preservation of existing unreadable local state instead of automatic overwrite;
- explicit separation of invalid returned data from browser storage whose read operation itself is unavailable;
- suppression of automatic writes when startup storage could not be read, preventing temporary defaults from overwriting unknown inaccessible data;
- transactional backup replacement that commits current state only after the validated replacement is successfully written;
- a shared 2 MB persistence/import budget to bound local state processing;
- validation that profile IDs are unique and the active profile exists;
- atomic enforcement of the 100-profile capacity inside the latest React state updater;
- validation that mastery keys are canonical multiplication facts;
- validation that mastery counters are internally consistent;
- validation that imported multiplication answers match their operands;
- validation that recorded correctness matches the stored response;
- validation that saved mistake history contains only incorrect attempts;
- browser-origin isolation for local storage;
- user-visible warning when browser storage cannot persist changes;
- explicit recovery UI for invalid stored state;
- no use of `dangerouslySetInnerHTML` for user-controlled content;
- no custom cryptography;
- structured logging with both sensitive-field-name and sensitive-value redaction;
- repository secret-pattern scanning in the standard quality gate;
- dependency auditing and Dependabot;
- CodeQL analysis;
- least-privilege GitHub Actions permissions.

## Repository secret scanning

The repository includes a dependency-free scanner under `scripts/` for common high-risk credential patterns. It reports only the file, line, and finding type; it deliberately does not echo the matched credential value.

Run its tests and a repository scan with:

```bash
npm run test:security
npm run secret:scan
```

The scanner covers common private-key headers and representative GitHub, AWS, Google, Slack, and Stripe credential formats. It is a defense-in-depth control, not a guarantee that every possible secret format will be recognized. Never rely on scanning as permission to commit secrets.

If a real secret is accidentally committed, treat it as compromised: revoke/rotate it first, then clean repository history using the appropriate Git tooling and coordinate disclosure if exposure could affect users.

## Backup trust boundary

Imported backups are untrusted input. TableSpark therefore:

1. rejects input above the byte-size budget before JSON parsing;
2. checks the persisted schema version;
3. validates all required object shapes and numeric bounds;
4. verifies canonical mastery keys plus mathematical/progress invariants;
5. verifies profile identity consistency;
6. verifies mistake history contains only incorrect attempts;
7. asks for explicit user confirmation before destructive replacement;
8. refuses replacement when startup storage could not be read, because the application cannot prove what may already exist there;
9. writes the validated replacement first;
10. replaces current in-memory state and reports success only after that write succeeds.

If the replacement write fails, current state remains unchanged and the import is reported as failed. Do not weaken these checks merely to accept manually edited backup files. Schema changes should use a tested migration instead.

## Unreadable stored-state boundary

A local value that was successfully read but fails parsing, migration, or validation is not equivalent to an empty store. TableSpark classifies it as unreadable and pauses automatic persistence so a temporary default state cannot destroy the original value.

The recovery UI allows the user to:

- download the exact raw stored text for private recovery/inspection;
- import a valid backup as an explicit replacement;
- discard the unreadable value only after confirmation.

Raw recovery downloads can contain learner information. They are never sent to TableSpark infrastructure or written to structured logs. Users and maintainers should not attach them to public issues without reviewing and redacting personal content.

This recovery design is documented in ADR 0004.

## Unavailable storage-read boundary

If `localStorage.getItem()` itself throws, TableSpark did not obtain learner data and therefore cannot safely label it corrupted or empty.

In this state TableSpark:

- uses a temporary in-memory default only to keep core learning UI available;
- does not activate unreadable-value recovery controls;
- pauses automatic learner-state writes;
- disables trusted backup export/import actions that could otherwise misrepresent or overwrite unknown inaccessible data;
- asks the user, through the storage warning, to restore site-storage access and reload before relying on persistence.

This state is intentionally different from a later write failure after valid state has already been loaded.

## Dependency and CI security

GitHub Actions are intentionally limited to necessary permissions. The `quality` job runs formatting, linting, strict type checking, application tests, security-scanner tests, a repository secret scan, production build, and a high-severity production dependency audit. CodeQL runs on pushes, pull requests, and a weekly schedule.

Dependency updates should be reviewed for:

- release notes and breaking changes;
- install scripts;
- provenance/repository ownership when relevant;
- newly requested browser capabilities;
- bundle and runtime impact.

## Disclosure

After a fix is available, maintainers may publish a concise advisory describing affected versions, impact, remediation, and credit if the reporter wishes to be acknowledged.
