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

Do not send passwords, tokens, private keys, real learner records, or unrelated sensitive information.

## Security model

TableSpark is an offline-first browser application. Core workflows do not require authentication, remote APIs, cookies, payments, or production secrets. This deliberately reduces the remote attack surface.

Primary security boundaries include:

- validation of persisted/imported JSON using a versioned schema;
- explicit rejection of unsupported state versions;
- backup file-size limits in the import UI;
- browser-origin isolation for local storage;
- no use of `dangerouslySetInnerHTML` for user-controlled content;
- no custom cryptography;
- structured logging with redaction for sensitive field names;
- dependency auditing and Dependabot;
- CodeQL analysis;
- least-privilege GitHub Actions permissions.

## Dependency and CI security

GitHub Actions are intentionally limited to necessary permissions. Production dependency audit failures at high severity block CI. CodeQL runs on pushes, pull requests, and a weekly schedule.

Dependency updates should be reviewed for:

- release notes and breaking changes;
- install scripts;
- provenance/repository ownership when relevant;
- newly requested browser capabilities;
- bundle and runtime impact.

## Disclosure

After a fix is available, maintainers may publish a concise advisory describing affected versions, impact, remediation, and credit if the reporter wishes to be acknowledged.
