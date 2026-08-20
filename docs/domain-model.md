# TableSpark Domain Model

This document explains the pure learning/business rules under `src/domain/`, the data structures they operate on, and the invariants that feature/state code must preserve.

The domain layer intentionally has no React dependency and no direct browser-storage/PWA dependency. Keeping mathematics and learning-state rules independent from UI/browser adapters makes them easier to test and reason about.

## Dependency direction

Preferred direction:

```text
features/state/infrastructure → domain
domain → domain types/helpers only
```

The domain layer should not import:

- React;
- DOM APIs;
- `localStorage`;
- service workers;
- GitHub/network clients;
- UI message catalogs.

Human-facing validation errors produced by domain functions are primarily developer/non-UI contracts. Feature code that supports multiple locales should translate failures into localized user-facing messages rather than displaying raw English domain exceptions.

# Core data types

File:

```text
src/domain/types.ts
```

## `TableConfig`

Represents a requested generated table range:

```ts
interface TableConfig {
  from: number;
  to: number;
  multiplierFrom: number;
  multiplierTo: number;
  step: number;
}
```

Example:

```text
from = 2
to = 10
step = 2
multiplierFrom = 1
multiplierTo = 12
```

This describes tables 2, 4, 6, 8, 10 with multipliers 1 through 12.

## `TableRow`

Represents one solved multiplication row:

```ts
interface TableRow {
  multiplicand: number;
  multiplier: number;
  product: number;
}
```

Mathematical invariant:

```text
product = multiplicand × multiplier
```

## `Question`

One practice question:

```ts
interface Question {
  id: string;
  left: number;
  right: number;
  answer: number;
}
```

Invariant:

```text
answer = left × right
```

Persistence validation rechecks this instead of trusting imported JSON.

## `Attempt`

One submitted answer:

```ts
interface Attempt {
  question: Question;
  response: number | null;
  correct: boolean;
  answeredAt: string;
  elapsedMs: number;
}
```

Important semantics:

- `response: null` can represent no recorded numeric response in persisted data shapes;
- `correct` must match whether `response` equals the question answer;
- `answeredAt` uses the application's canonical UTC ISO timestamp format;
- `elapsedMs` is non-negative elapsed time, not a wall-clock timestamp.

## `MasteryStat`

Aggregated practice state for one canonical multiplication fact:

```ts
interface MasteryStat {
  key: string;
  attempts: number;
  correct: number;
  streak: number;
  lastAttemptAt: string;
}
```

`streak` means consecutive correct attempts for that canonical fact. It is a learning statistic, not a daily engagement streak.

## `SessionSummary`

Compact result of a completed practice session:

```ts
interface SessionSummary {
  id: string;
  kind: 'generated' | 'mistake-review';
  mode: 'timed' | 'untimed';
  completedAt: string;
  questionCount: number;
  correctCount: number;
  elapsedMs: number;
  seed: number | null;
}
```

The session-history model deliberately stores a summary rather than duplicating every answer-level attempt.

## `Profile`

One local learner identity:

```ts
interface Profile {
  id: string;
  name: string;
  createdAt: string;
  mastery: Record<string, MasteryStat>;
  mistakes: Attempt[];
  sessions: SessionSummary[];
  masteredFactsGoal: number | null;
}
```

Profiles are local browser records, not authenticated online accounts.

## `AppSettings`

Cross-profile application preferences:

```ts
interface AppSettings {
  theme: 'system' | 'light' | 'dark';
  largeText: boolean;
  reducedMotion: boolean;
  speechEnabled: boolean;
  defaultQuestionCount: number;
  defaultTimeLimitSeconds: number;
  sessionHistoryLimit: number;
}
```

The persistence validator narrows `sessionHistoryLimit` to the supported values defined in the session domain module.

## `PersistedState`

Current learner-state root:

```ts
interface PersistedState {
  schemaVersion: 2;
  activeProfileId: string;
  profiles: Profile[];
  settings: AppSettings;
}
```

See `docs/data-schema-v2.md` for persistence/import semantics.

# Table-generation domain

File:

```text
src/domain/tables.ts
```

## Numeric range

Individual configuration values are restricted to integers between:

```text
-1000 and 1000
```

This applies to:

- table start;
- table end;
- multiplier start;
- multiplier end;
- step before the stricter positive-step rule is applied.

## Ordering rules

- `from <= to`
- `multiplierFrom <= multiplierTo`
- `step > 0`

A zero/negative step would otherwise create invalid or non-terminating traversal behavior, so it is rejected explicitly.

## Render budget

Constant:

```text
MAX_RENDERED_ROWS = 5000
```

Before generating rows, the domain calculates:

```text
tableCount × multiplierCount
```

If the result exceeds 5,000, generation is rejected.

Why this matters:

- protects React/DOM rendering from accidentally enormous worksheets;
- protects print-preview responsiveness;
- makes generated output size predictable;
- moves the guard into the domain so UI changes cannot accidentally bypass it.

## Generation order

`generateTable()` iterates tables in ascending `step` order, then multipliers in ascending increments of 1.

For example, tables 2–4, multiplier 1–2 produce conceptually:

```text
2 × 1
2 × 2
3 × 1
3 × 2
4 × 1
4 × 2
```

## Equation formatting

`formatEquation()` produces:

```text
<multiplicand> × <multiplier> = <product>
```

It uses the multiplication sign `×`, not ASCII `x`, for solved display text.

# Worksheet domain

File:

```text
src/domain/worksheet.ts
```

The worksheet layer maps already-valid `TableRow` values into printable presentation data.

## Blank styles

Supported types:

```ts
'tline' | 'box' | 'space'
```

Rendered blank values:

- line → `______`
- box → `□`
- space → open writing space

The default is `line`.

## `WorksheetItem`

Each row is transformed into:

- stable item id based on operands;
- practice prompt;
- numeric answer;
- solved equation.

This allows the UI to switch between practice and answer-key/study-sheet presentation without recomputing mathematics independently.

# Deterministic practice-question domain

File:

```text
src/domain/questions.ts
```

## Supported seed range

```text
0 through 4,294,967,295
```

Constant:

```ts
MAX_SEED = 0xffffffff
```

Seeds must be integers. Negative, fractional, or larger values are rejected before generator arithmetic.

## Practice range

Generated operands must use integers where:

```text
0 <= min <= max <= 1000
```

## Question count

```text
1 through 200
```

## Generator

The module uses a small deterministic `mulberry32` pseudo-random sequence initialized by the validated seed.

The generator is **not cryptographic** and must never be used to generate passwords, secrets, tokens, or security randomness.

Its purpose is educational reproducibility:

```text
same seed + same min/max/count → same generated sequence
```

for the current generator implementation.

That makes bug reports, classroom replay, and deterministic tests possible.

## Question identity

Generated IDs contain:

- seed;
- question index;
- left operand;
- right operand.

The id is a local deterministic identifier, not a secret or globally trusted database key.

# Canonical multiplication facts

Function:

```ts
masteryKey(left, right)
```

Multiplication is commutative:

```text
4 × 7 = 7 × 4
```

Therefore mastery uses the smaller operand first:

```text
4x7
```

Both 4 × 7 and 7 × 4 contribute to the same mastery record.

This normalization is reused by:

- mastery updates;
- persisted mastery validation;
- mistake-review deduplication;
- progress search/display behavior.

Changing canonicalization is a persisted-data compatibility change and would require migration planning.

# Answer validation

File:

```text
src/domain/answers.ts
```

This module defines the accepted numeric response boundary used by practice UI/domain behavior.

Its purpose is to prevent UI-generated answers from exceeding the numeric product/application constraints intended for persistence.

When changing operand/product ranges, review answer bounds and storage validation together.

# Difficulty presets

File:

```text
src/domain/difficulty.ts
```

Supported internal levels:

```text
starter
foundation
builder
fluency
challenge
```

Current preset values:

| Level | Min | Max | Questions |
| --- | ---: | ---: | ---: |
| Starter | 0 | 5 | 10 |
| Foundation | 0 | 10 | 15 |
| Builder | 2 | 12 | 20 |
| Fluency | 2 | 15 | 25 |
| Challenge | 2 | 20 | 30 |

The domain object also contains English labels/descriptions as metadata, but visible localized interface labels come from the locale catalog. Feature code should not reintroduce English-only domain descriptions into Hindi UI.

A preset is a setup convenience, not an opaque difficulty-scoring algorithm. Users can still edit the selected range/count.

# Mastery update domain

File:

```text
src/domain/mastery.ts
```

## Applying an attempt

`applyAttempt(profile, attempt)`:

1. derives the canonical mastery key;
2. loads or initializes the stat;
3. increments attempts;
4. increments correct count only for correct answers;
5. increments the fact streak on correct answers;
6. resets fact streak to zero on an incorrect answer;
7. records the latest attempt timestamp;
8. prepends incorrect attempts to recent mistakes;
9. keeps at most 100 mistakes.

The function returns a new profile object rather than mutating the input profile.

## Accuracy

Fact mastery percentage:

```text
round(correct / attempts × 100)
```

Profile accuracy aggregates all fact stats:

```text
round(total correct / total attempts × 100)
```

If there are zero attempts, accuracy is 0 rather than dividing by zero.

# Mastery classification and filtering

File:

```text
src/domain/progress.ts
```

## Mastered rule

A fact is mastered when:

```text
attempts >= 3
AND
mastery percentage >= 90
```

This rule is deliberately simple and visible in the UI/documentation. It is not a hidden adaptive score.

## Filters

```text
all
needs-practice
mastered
```

`needs-practice` means “not currently meeting the mastered rule,” not necessarily “the learner failed this fact.”

## Search normalization

Search:

- trims surrounding whitespace;
- lowercases;
- treats `×` as `x`;
- removes spaces.

Thus user text such as:

```text
4 × 7
4x7
4 x 7
```

can match the canonical key.

## Ordering

Filtered facts sort by:

1. attempts descending;
2. fact key lexicographically for ties.

# Mistake-review domain

File:

```text
src/domain/review.ts
```

## Requested review size

Count must be:

```text
1 through 200
```

## Deduplication

The review iterates recent attempts in their stored order and tracks canonical fact keys in a set.

Consequences:

- repeated mistakes on 4 × 7 do not consume multiple review slots;
- 4 × 7 and 7 × 4 are considered the same review fact;
- the newest unique facts are favored because recent mistakes are stored newest-first.

Generated review questions receive a `review-...` id so they are distinguishable from their original practice-question identity.

A mistake-review session is not a seeded generated drill. Persisted summary validation therefore requires `seed: null` for this session kind.

# Session-history domain

File:

```text
src/domain/sessions.ts
```

## Supported retention choices

```text
10
25
50
100
```

Default:

```text
25
```

Hard maximum:

```text
100
```

## Retention semantics

Session arrays are newest-first.

`prependSession()`:

1. inserts the new summary at index 0;
2. slices to the selected retention limit.

`retainSessions()` slices an existing newest-first history when a learner lowers the retention setting.

Changing retention never changes mastery counts or mistake history; those are separate learning records.

## Optional mastery-goal bound

Maximum:

```text
10,000 mastered facts
```

The bound is a storage/input sanity guard, not a recommendation for a learner target.

# Feature-to-domain data flows

## Table flow

```text
TableGenerator control values
  → TableConfig
  → generateTable()
  → TableRow[]
  → buildWorksheet()
  → WorksheetItem[]
  → solved/practice/answer-key UI + print
```

The worksheet presentation does not alter products.

## Generated practice flow

```text
Practice setup/preset
  → min/max/count/seed
  → generateQuestions()
  → Question[]
  → submitted Attempt
  → AppStateProvider.recordAttempt()
  → applyAttempt()
  → Profile mastery/mistakes
```

At session completion:

```text
session outcome
  → SessionSummary
  → AppStateProvider.recordSession()
  → prependSession()
```

## Mistake-review flow

```text
Profile.mistakes
  → buildMistakeReview()
  → deduplicated Question[]
  → normal attempt/mastery updates
  → mistake-review SessionSummary with seed = null
```

## Progress flow

```text
Profile.mastery
  → Object.values()
  → filterMasteryStats()
  → fact list + mastered count + metrics
```

Optional goal progress uses the mastered count; it does not alter mastery classification.

# Invariants that future features must preserve

## Mathematics

- Question answer equals operand product.
- Table product equals multiplicand × multiplier.
- Mastery canonicalization remains consistent everywhere.

## Bounds

- Table render budget remains enforced before creating huge output.
- Practice question/seed/count bounds remain compatible with storage validation.
- Mistake/session histories remain bounded.
- Optional goal remains bounded and nullable.

## Learning semantics

- A fact streak is not converted into an engagement/daily-login streak.
- Optional goals remain non-punitive.
- Mastery definition remains transparent if changed.
- Mistake review should not deliberately spam duplicate commutative facts.

## Persistence

Changing any persisted type/invariant requires:

- schema/version review;
- migration decision;
- storage/import validator updates;
- test-fixture updates;
- privacy/schema docs updates;
- compatibility testing.

## Localization

Domain metadata/errors should not become the source of untranslated feature text. Add visible messages to the locale catalogs.

# Test map

Every pure domain module has focused test coverage alongside it where behavior is non-trivial:

- answers → bounds;
- difficulty → preset shape/progression;
- mastery → counters, streaks, mistakes, profile metadata preservation;
- progress → mastery rule/search/filter/order;
- questions → deterministic generation, ranges, seed behavior/property checks;
- review → deduplication/count;
- sessions → supported retention/prepend/trim;
- tables → validation/order/render budget;
- worksheet → prompt/answer/blank formatting.

When adding a new domain rule, add the direct test beside the module before relying only on a UI test.
