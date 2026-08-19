# ADR 0003: Seed practice question generation

- Status: Accepted
- Date: 2026-08-19

## Context

Practice questions should feel varied to learners, but tests, bug reports, and classroom exercises benefit from reproducibility. Using an uncontrolled global random source would make exact sessions difficult to reproduce.

## Decision

Generate practice questions from an explicit numeric seed using a small deterministic pseudo-random generator. The seed is part of practice setup, and generated question identifiers include the seed and sequence position.

The generator is not cryptographic and must never be used for security-sensitive randomness.

## Consequences

- The same range, count, and seed produce the same session.
- Automated tests can compare complete generated sequences.
- Bug reports can include a seed to reproduce a question order.
- Teachers can intentionally reuse a session configuration.
- Changing the generator algorithm in a future release could change sequences for the same seed and therefore requires release-note consideration.
