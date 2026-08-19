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

Use **Print study sheet** or **Print practice worksheet**. TableSpark print CSS hides navigation and configuration controls and formats the equation cards for paper.

Your browser still controls paper size, margins, scaling, headers, and footers.

## 2. Practice

Open **Practice** to create a drill.

### Difficulty presets

- **Starter** — facts from 0 through 5, 10 questions.
- **Builder** — facts from 2 through 12, 20 questions.
- **Challenge** — facts from 2 through 20, 30 questions.
- **Custom** — keep or enter your own range/count.

After selecting a preset you can still adjust minimum, maximum, or question count manually.

### Seed

The seed makes a question sequence reproducible. The same seed, minimum, maximum, and question count generate the same sequence for the current generator algorithm.

A seed is for reproducibility, not security.

### Untimed mode

Untimed mode has no countdown. Answer at your own pace.

### Timed mode

Timed mode uses the configured time limit. The countdown appears in the practice header while a session is active.

### Answering

Enter a whole-number answer and choose **Check answer**. TableSpark records correctness, attempt time, and fact mastery for the active offline profile.

### Review mistakes

Choose **Review mistakes** to practice recent incorrect facts again. If no mistakes exist yet, TableSpark explains that there is nothing to review.

## 3. Progress

The **Progress** section shows data for the active profile:

- overall accuracy;
- total attempts;
- number of facts practiced;
- number of saved recent mistakes;
- per-fact mastery percentages;
- current correct-answer streak per fact;
- recent incorrect answers and correct answers.

Mastery keys treat multiplication as commutative: practicing 4 × 7 and 7 × 4 contributes to the same fact key.

## 4. Settings

### Appearance & accessibility

- **Theme** — System, Light, or Dark.
- **Large-text classroom mode** — increases root text scale.
- **Reduce motion** — minimizes interface transition/animation durations.
- **Text-to-speech controls** — enables speaker controls where speech synthesis exists.

### Practice defaults

Set default question count and timed-drill duration for new practice setup screens.

### Offline profiles

Profiles separate learning progress on the same browser/device without requiring accounts.

To create a profile:

1. Enter a name under **New profile name**.
2. Choose **Add profile**.
3. The new profile becomes active.

To switch profiles, choose a profile button.

You cannot delete the last remaining profile. This keeps application state valid.

### Export backup

Choose **Export backup** to download JSON containing profiles, learning history, and settings.

Store the file carefully because profile names and learning history can be personal data.

### Import backup

Choose **Import backup** and select a compatible TableSpark JSON file. TableSpark validates the file before replacing current state.

Import can fail when:

- JSON is malformed;
- schema version is unsupported;
- required fields are missing/invalid;
- active profile reference is invalid;
- file exceeds the UI limit.

Export your current state before importing if you may need to restore it afterward.

### Reset active progress

This clears mastery and saved mistakes for the selected profile after confirmation. It does not delete the profile itself.

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
- progress;
- profiles/settings;
- local backup creation/import.

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

TableSpark has no required cloud account. Local data can still be lost if browser/site storage is cleared. Export a backup before browser cleanup, device migration, or other destructive storage maintenance.
