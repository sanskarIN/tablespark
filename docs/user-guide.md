# TableSpark User Guide

## 1. Tables

The **Tables** section is the default starting point.

Controls:

- **Table start** — first multiplicand/table to include.
- **Table end** — last multiplicand/table to include.
- **Multiplier start** — first multiplier in each table.
- **Multiplier end** — last multiplier in each table.
- **Table step** — interval between tables. For example, start 2, end 10, step 2 produces tables 2, 4, 6, 8, and 10.
- **Hide answers for practice worksheet** — changes solved equations into blank-answer prompts.

TableSpark protects the interface from excessively large generated output. If a range would produce more than 5,000 worksheet rows, reduce the range or increase the table step.

### Study sheet

With worksheet blanks disabled, equations include answers:

```text
7 × 8 = 56
```

If text-to-speech controls are enabled and supported, the speaker control can read solved equations aloud.

### Practice worksheet

Enable **Hide answers for practice worksheet** to show:

```text
7 × 8 = ______
```

Speech answer controls are intentionally hidden in blank worksheet mode so they do not reveal answers.

### Print

Use **Print study sheet** or **Print practice worksheet**. TableSpark print CSS hides navigation and configuration controls, adds a paper-only worksheet heading with blank Name and Date lines, and formats the equation cards for paper. The active offline profile name is not automatically printed.

Your browser still controls paper size, margins, scaling, headers, and footers.

## 2. Practice

Open **Practice** to create a drill.

### Difficulty presets

- **Starter** — facts from 0 through 5, 10 questions.
- **Builder** — facts from 2 through 12, 20 questions.
- **Challenge** — facts from 2 through 20, 30 questions.
- **Custom** — keep or enter your own range/count.

After selecting a preset you can still adjust minimum, maximum, or question count manually.

### Random sessions and reproducible seeds

A new Practice screen starts with a random unsigned 32-bit seed. Choose **New random seed** whenever you want another generated sequence.

The visible seed makes a question sequence reproducible. The same seed, minimum, maximum, and question count generate the same sequence for the current generator algorithm. Supported seeds are whole numbers from `0` through `4294967295`.

At the end of a generated session:

- **New random drill** returns to setup with a new random seed.
- **Repeat this seed** returns to setup while preserving the completed session seed so the same generated questions can be replayed.

A seed is for reproducibility, not security.

### Untimed mode

Untimed mode has no countdown. Answer at your own pace.

### Timed mode

Timed mode uses the configured time limit. The countdown appears in the practice header while a session is active.

### Answering

Enter a whole-number answer and choose **Check answer**. New practice responses are bounded to the supported persisted-answer range so the UI cannot create numeric values that the product does not intend to store.

TableSpark records correctness, attempt time, and fact mastery for the active offline profile.

### Review mistakes

Choose **Review mistakes** to practice recent incorrect facts again. Repeated mistakes for the same commutative fact are deduplicated, so a review does not waste its limited question count repeating equivalent facts such as 4 × 7 and 7 × 4.

A completed mistake review shows a review-specific completion note and returns to practice setup. Seed replay controls are reserved for generated seeded drills.

If no mistakes exist yet, TableSpark explains that there is nothing to review.

## 3. Progress

The **Progress** section shows data for the active profile:

- overall accuracy;
- total attempts;
- number of facts practiced;
- number of mastered facts;
- number of saved recent mistakes;
- per-fact mastery percentages;
- current correct-answer streak per fact;
- recent incorrect answers and correct answers.

A fact is considered **Mastered** after at least three attempts with 90% or better accuracy. This release intentionally uses a simple transparent rule rather than an opaque adaptive-learning score.

Use **Search facts** to find a multiplication fact such as `4 × 7`. Search treats `×` and `x` consistently and ignores spaces.

Use the **Show** filter to switch among:

- **All practiced facts**;
- **Needs practice**;
- **Mastered**.

Mastery keys treat multiplication as commutative: practicing 4 × 7 and 7 × 4 contributes to the same canonical fact key.

## 4. Settings

### Appearance & accessibility

- **Theme** — System, Light, or Dark.
- **Large-text classroom mode** — increases root text scale.
- **Reduce motion** — minimizes interface transition/animation durations.
- **Text-to-speech controls** — enables speaker controls where speech synthesis exists.

When the current browser does not provide a usable speech-synthesis API, the text-to-speech checkbox is disabled and TableSpark explains that the feature is unavailable instead of failing at runtime.

### Practice defaults

Set default question count and timed-drill duration for new practice setup screens.

### Offline profiles

Profiles separate learning progress on the same browser/device without requiring accounts.

To create a profile:

1. Enter a name under **New profile name**.
2. Choose **Add profile**.
3. The new profile becomes active.

To switch profiles, choose a profile button.

You cannot delete the last remaining profile. This keeps application state valid. TableSpark shows local profile capacity and prevents creating more than 100 local profiles.

### Export backup

Choose **Export backup** to download validated JSON containing profiles, learning history, and settings.

Store the file carefully because profile names and learning history can be personal data.

Ordinary backup export is disabled during the unreadable-data recovery state because the visible application state is then temporary rather than the original stored value.

### Import backup

Choose **Import backup** and select a compatible TableSpark JSON file. TableSpark asks for confirmation before replacement and validates the complete backup before accepting it.

Import can fail when:

- JSON is malformed;
- schema version is unsupported;
- required fields are missing/invalid;
- more than 100 profiles are present;
- profile IDs are duplicated;
- the active profile reference is invalid;
- mastery fact keys are not canonical;
- mastery counters are mathematically inconsistent;
- a stored multiplication answer does not match its operands;
- an attempt's correctness flag does not match its recorded response;
- a correct attempt appears inside saved mistake history;
- the backup exceeds the shared 2 MB persisted-state budget.

Export your current validated state before importing if you may need to restore it afterward.

### Recover unreadable local data

If TableSpark starts with **Stored learning data needs recovery**, an existing local value failed parsing, migration, or validation. TableSpark preserves that value instead of overwriting it.

While recovery is pending:

- the app uses a temporary in-memory default state;
- new changes are temporary and are not saved over the unreadable value;
- ordinary **Export backup** is disabled;
- a dedicated recovery section appears under **Data & privacy**.

Recovery options:

1. **Download unreadable local data** — saves the exact raw stored value as a `.txt` recovery artifact. Use this before discarding if you may need troubleshooting or manual recovery.
2. **Import backup** — select a known-good TableSpark backup. If it validates and you confirm replacement, it becomes the new persisted state and recovery ends.
3. **Discard unreadable local data** — permanently removes the unreadable value after confirmation, then normal local saving resumes using the current temporary state.

The raw recovery file may contain learner names and learning history. Treat it as personal data and do not post it publicly without reviewing/redacting it.

### Reset active progress

This clears mastery and saved mistakes for the selected profile after confirmation. It does not delete the profile itself.

### Local-saving warning

If browser storage rejects a normal write because of storage limits, browser policy, private-mode restrictions, or another storage error, TableSpark displays **Local saving is unavailable.**

The app can continue operating in memory for the current tab, but changes may not survive reload. Address the browser storage problem before relying on new progress being durable.

This warning is different from the unreadable-data recovery state: a normal write failure means TableSpark could read the current state but could not save a newer one; recovery means the pre-existing stored value itself could not be validated.

## 5. About

The **About** page contains:

- project version;
- MIT license;
- privacy summary;
- **Made by the Sanskar** credit;
- business/support email links;
- GitHub profile and repository links;
- optional Buy Me a Coffee link.

No donation is required for any TableSpark learning feature.

## 6. Offline use

After production PWA assets have been cached, core functionality is designed to work without a network connection:

- table generation;
- worksheet mode;
- practice;
- progress search/filtering;
- profiles/settings;
- local backup creation/import;
- local unreadable-data recovery actions.

External links and initial asset download naturally require connectivity.

## 7. Keyboard use

Use Tab/Shift+Tab to move through controls.

Desktop quick navigation shortcuts:

- Alt+1 — Tables
- Alt+2 — Practice
- Alt+3 — Progress
- Alt+4 — Settings
- Alt+5 — About

If the operating system/browser reserves one of these shortcuts, use normal keyboard navigation instead.

## 8. Privacy reminder

TableSpark has no required cloud account. Local data can still be lost if browser/site storage is cleared or becomes unavailable. Export a backup before browser cleanup, device migration, or other destructive storage maintenance.

If TableSpark reports unreadable stored data, download the dedicated raw recovery artifact before discarding the value if there is any chance you may need it.
