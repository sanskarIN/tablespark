# Performance

TableSpark is a small client-side learning application. Performance work should be driven by measurements and user-visible bottlenecks rather than speculative complexity.

## Performance goals

For typical usage on a current desktop or mid-range mobile device:

- initial interaction should not wait on remote APIs because core workflows are local;
- table generation for normal classroom ranges should feel immediate;
- practice answer submission should update synchronously without network delay;
- navigation should not trigger data fetching;
- the production bundle should remain small enough for comfortable PWA installation and repeat offline use;
- print rendering should avoid unnecessarily huge DOM trees.

## Current architecture advantages

- No application backend request is required for core workflows.
- Domain calculations are simple arithmetic.
- Question generation is O(question count).
- Mistake-review deduplication is bounded by the saved 100-attempt history.
- Progress filtering operates on local in-memory mastery statistics.
- Mastery updates touch one profile and one fact per attempt.
- PWA static assets are cached for offline repeat use.
- Feature state is local and avoids repeated serialization during render; persistence occurs after state changes.

## Guardrails

### Table generation

Table values are bounded and the domain rejects configurations that would render more than **5,000 equation rows**. This is a deliberate reliability budget: valid numeric inputs should not be able to create a multi-million-node classroom worksheet that freezes the UI.

If future releases need much larger worksheets, measure representative devices first. Virtualization is appropriate for screen display but not automatically for printable output, so a future large-print design may instead paginate worksheet data into explicit printable pages.

### Practice generation

Question count is bounded to 200. Generated questions are deterministic and created once when a drill starts rather than on every answer.

Random session selection creates only one 32-bit seed. The seeded generator remains deterministic and does not call `Math.random()` for each question.

### Mistake history

Per-profile recent mistakes are capped at 100 to prevent unbounded local-state growth. Mistake review deduplicates equivalent commutative facts before presenting a review session.

### Profiles

Offline profiles are capped at 100. This keeps the profile selector usable and aligns runtime behavior with imported-state validation.

### Persistence and backups

Persisted state and imported backup text share a **2 MB byte budget**. The budget is checked before JSON parsing on import and before writing current state to browser storage.

This protects both CPU/memory behavior during validation and local-storage quota usage. If a write would exceed the budget, the adapter reports failure and the UI warns that local saving is unavailable rather than pretending the state is durable.

### Search/filtering

Mastery search and filter operations are in-memory and intentionally simple. They normalize a short text query, filter the active profile's stats, and sort by attempt count/fact key. Do not introduce a search index until measured profile sizes justify it.

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
- generator interaction time for typical and 5,000-row configurations;
- memory behavior after repeated practice sessions/profile changes;
- progress filtering responsiveness with a synthetic high-volume mastery profile;
- validation behavior for a near-2 MB backup;
- print-preview responsiveness for a large supported worksheet.

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

- generating exactly the 5,000-row worksheet budget;
- generating 200 deterministic questions;
- applying thousands of synthetic mastery attempts to an in-memory profile;
- filtering a synthetic high-volume mastery record;
- validating a near-2 MB backup file.

A benchmark should have an explicit regression threshold before it becomes a CI gate.

## Caching

The service worker caches built application assets. TableSpark currently avoids custom runtime API caches because there are no core remote APIs. Any future runtime cache must document:

- key format;
- maximum age/size;
- invalidation behavior;
- offline fallback;
- privacy impact.
