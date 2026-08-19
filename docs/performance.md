# Performance

TableSpark is a small client-side learning application. Performance work should be driven by measurements and user-visible bottlenecks rather than speculative complexity.

## Performance goals

For typical usage on a current desktop or mid-range mobile device:

- initial interaction should not wait on remote APIs because core workflows are local;
- table generation for normal classroom ranges should feel immediate;
- practice answer submission should update synchronously without network delay;
- navigation should not trigger data fetching;
- the production bundle should remain small enough for comfortable PWA installation and repeat offline use;
- print rendering should avoid unnecessarily huge DOM trees for default ranges.

## Current architecture advantages

- No application backend request is required for core workflows.
- Domain calculations are simple arithmetic.
- Question generation is O(question count).
- Mastery updates touch one profile and one fact per attempt.
- PWA static assets are cached for offline repeat use.
- Feature state is local and avoids repeated serialization during render; persistence occurs after state changes.

## Guardrails

### Table generation

Input values are bounded. A table configuration can still generate many rows, so UI work should remain proportional to explicit user choices.

If future releases raise limits significantly, consider virtualization or paged rendering only after profiling shows a need.

### Practice generation

Question count is bounded to 200. Generated questions are deterministic and created once when a drill starts rather than on every answer.

### Mistake history

Per-profile recent mistakes are capped at 100 to prevent unbounded local-state growth.

### Backups

The import UI rejects files above 2 MB before reading/parsing them. Schema validation then constrains supported array lengths and field shapes.

## Measurement commands

Build the production app:

```bash
npm run build
```

Review Vite's emitted bundle-size summary in the terminal.

Preview production output:

```bash
npm run preview
```

Use browser developer tools for:

- Performance recordings;
- memory snapshots;
- Lighthouse-style diagnostics where appropriate;
- service-worker/cache inspection;
- network waterfall validation.

## Suggested release measurements

Record during release-candidate review when performance-sensitive changes land:

- total compressed/uncompressed JavaScript output;
- largest individual chunk;
- initial load behavior on a throttled network;
- generator interaction time for typical and maximum supported configurations;
- memory behavior after repeated practice sessions/profile changes;
- print-preview responsiveness for a large worksheet.

Put noteworthy results and regressions in `what_changed.md`.

## Optimization rules

1. Reproduce and measure the problem.
2. Identify the expensive path.
3. Optimize the narrow path rather than adding global complexity.
4. Add a regression benchmark/test if the bottleneck is deterministic and meaningful.
5. Re-measure after the change.
6. Document tradeoffs when optimization reduces readability or increases bundle complexity.

## Future benchmark candidates

If the feature set grows, useful microbenchmarks may include:

- generating the maximum supported table range;
- generating 200 deterministic questions;
- applying thousands of synthetic mastery attempts to an in-memory profile;
- validating a near-limit backup file.

A benchmark should have an explicit regression threshold before it becomes a CI gate.

## Caching

The service worker caches built application assets. TableSpark currently avoids custom runtime API caches because there are no core remote APIs. Any future runtime cache must document:

- key format;
- maximum age/size;
- invalidation behavior;
- offline fallback;
- privacy impact.
