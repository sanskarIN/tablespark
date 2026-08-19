# ADR 0004: Preserve unreadable local state until explicit recovery

- Status: Accepted
- Date: 2026-08-19

## Context

TableSpark is local-first. The persisted state is untrusted when read because browser storage can contain data from an older incompatible build, manual edits, extension interference, partial/corrupted writes, or values that no longer satisfy current semantic validation.

A naive fallback such as `loadState() ?? makeDefaultState()` followed by an automatic save can destroy the unreadable value immediately. That behavior would turn a recoverable validation problem into permanent local data loss.

The product needs a safe startup path that remains usable while respecting the user's existing local data.

## Decision

When a stored TableSpark value exists but cannot be validated:

1. classify the initial load as `invalid` rather than treating it as an empty installation;
2. create a temporary in-memory default state so the application can still render;
3. pause automatic persistence so the unreadable value is not overwritten;
4. show a prominent recovery alert;
5. allow the user to download the raw stored value as a text recovery artifact;
6. allow a valid backup import to replace the unreadable value;
7. allow explicit discard only after a destructive-action confirmation;
8. resume normal persistence after replacement or successful discard.

The ordinary **Export backup** action is disabled during recovery because it would export the temporary in-memory state rather than the unreadable stored value. The recovery-specific download action is the correct way to preserve the original raw value.

## Consequences

### Positive

- Validation failures no longer automatically destroy existing local learner data.
- Recovery intent is explicit and visible to the user.
- The application remains usable in-memory while recovery is pending.
- Backup import provides a clean replacement path without requiring manual browser-storage editing.
- The raw recovery download preserves evidence for troubleshooting or future/manual recovery work.

### Tradeoffs

- State management needs an additional `unreadableStoredState` condition and persistence-health branch.
- Changes made while recovery is pending are temporary and may be lost on reload.
- A downloaded raw value may contain profile names and learning history, so privacy documentation must treat it as personal data.
- The application cannot automatically repair arbitrary malformed data without a known migration path.

## Rejected alternatives

### Automatically overwrite invalid state with defaults

Rejected because it can permanently destroy recoverable local data before the user knows a problem existed.

### Automatically delete invalid state and continue

Rejected for the same data-loss reason and because deletion is an irreversible action that should require user intent.

### Attempt heuristic repair of arbitrary JSON

Rejected because silent repair can misinterpret learner history. Known schema evolution belongs in explicit, tested migrations; unknown invalid data should remain untouched.

### Block the entire application until recovery completes

Rejected because table generation and other non-persisted learning workflows can remain useful while the storage problem is being resolved.
