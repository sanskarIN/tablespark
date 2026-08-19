# GitHub Repository Settings

This document records recommended repository configuration that cannot be fully expressed as files in the Git tree.

## Repository identity

- Repository: `sanskarIN/tablespark`
- Visibility: public
- License: MIT
- Default branch: `main`

Recommended description:

> Offline-first multiplication tables, practice drills, mistake review, mastery tracking, worksheets, and accessible classroom tools built as a TypeScript PWA.

Suggested topics:

- multiplication
- education
- math
- pwa
- typescript
- react
- offline-first
- accessibility
- learning
- worksheet

## Protect `main`

In GitHub:

1. Open the repository.
2. Open **Settings**.
3. Open **Rules → Rulesets** (or Branches/branch protection in repositories using the older interface).
4. Create a branch ruleset targeting the default branch `main`.
5. Enable pull-request requirements.
6. Require status checks that correspond to the repository workflows after they have run at least once.
7. Require conversation resolution.
8. Block force pushes.
9. Block branch deletion.
10. Apply the rule to administrators too if you want the strongest protection against accidental direct changes.

Recommended required checks after GitHub exposes their exact names:

- CI / quality
- CI / e2e
- CodeQL analysis check where repository security features expose it

Do not require a status check name that has never existed; GitHub can make the branch unmergeable until that exact context appears.

## Pull request policy

Recommended:

- require at least one approval when multiple maintainers are active;
- dismiss stale approvals after new commits;
- require review conversations to be resolved;
- allow squash or rebase merging according to project preference;
- delete head branches after merge when the branch is no longer useful.

For a single-maintainer portfolio repository, required-review counts can be relaxed while still requiring CI and pull requests.

## Actions permissions

Use the minimum permissions each workflow needs:

- CI: read repository contents.
- CodeQL: read contents + write security events.
- Release: write contents only because it creates GitHub releases.

Repository Actions settings should not grant broad write permissions by default unless another workflow genuinely needs them.

## Security features

Enable where available for public repositories:

- Dependabot alerts;
- Dependabot security updates;
- secret scanning;
- push protection for supported secret types;
- code scanning/CodeQL.

The repository already includes Dependabot configuration and CodeQL workflow files.

## Discussions

GitHub Discussions can be enabled when there is enough community traffic to justify separating questions/ideas from actionable issues.

Suggested categories:

- Q&A
- Ideas
- Show and tell
- General

Do not use Discussions for private vulnerability reports.

## Labels

Suggested baseline labels:

- `bug`
- `enhancement`
- `documentation`
- `accessibility`
- `security`
- `testing`
- `performance`
- `dependencies`
- `good first issue`
- `help wanted`

Keep label meanings clear and avoid dozens of overlapping labels.

## Milestones

Create milestones only when they help coordinate a real release or theme, for example:

- `v0.2 Classroom refinement`
- `v0.3 i18n + accessibility`
- `v1.0 Stable`

## Pages/deployment

The repository is ready to produce static `dist/` assets, but no production hosting target is assumed. Before enabling GitHub Pages or another host, verify:

- routing/base-path configuration;
- secure HTTPS origin;
- PWA manifest/service worker behavior;
- caching/update lifecycle;
- real deployed screenshots;
- privacy/documentation links.

## Funding

`.github/FUNDING.yml` points to the optional Buy Me a Coffee page. Keep funding links optional and non-blocking.

## Release tags

Use semantic version tags such as `v0.1.0`. The release workflow is configured for `v*.*.*` tags.

Never reuse a public version tag for a different commit after release. Publish a patch version instead.
