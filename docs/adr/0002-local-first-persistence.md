# ADR 0002: Keep learner state local by default

- Status: Accepted
- Date: 2026-08-19

## Context

TableSpark must support offline profiles, practice history, mastery tracking, and backup/restore without forcing account creation. The initial product does not need multi-device synchronization or remote classroom administration.

A remote backend would add authentication, privacy, availability, deployment, and security obligations without being necessary for the core learning experience.

## Decision

Store versioned application state in browser `localStorage` and keep core workflows independent of remote services.

Validate imported state before applying it. Provide explicit JSON export/import so users can move or back up data themselves. Treat exported backups as personal files because they can contain profile names and learning history.

## Consequences

### Benefits

- Core features work without sign-in.
- Network outages do not block learning after the application is cached.
- The server-side privacy/security surface is minimized.
- Local development and automated tests need no external credentials.

### Tradeoffs

- Clearing browser/site storage can remove data.
- The project cannot recover deleted local data unless the user exported a backup.
- Automatic multi-device synchronization is not available.
- Browser storage quotas and lifecycle behavior are platform-controlled.

## Future change criteria

A cloud component should be considered only if a concrete product requirement cannot be met safely with local-first storage. Any future sync design must be opt-in, document data flows, define authentication/authorization, and preserve an offline mode where practical.
