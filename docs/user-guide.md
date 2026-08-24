# TableSpark User Guide

## 1. Tables

The **Tables** section is the default starting point.

Range controls:

- **Table start** — first multiplicand/table to include.
- **Table end** — last multiplicand/table to include.
- **Multiplier start** — first multiplier in each table.
- **Multiplier end** — last multiplier in each table.
- **Table step** — interval between tables. For example, start 2, end 10, step 2 produces tables 2, 4, 6, 8, and 10.

TableSpark protects the interface from excessively large generated output. If a range would produce more than 5,000 worksheet rows, reduce the range or increase the table step.

### Worksheet composer

The worksheet composer changes how the same selected multiplication rows are presented and printed.

**Printable output** options:

- **Solved study sheet** — equations include their answers.
- **Practice worksheet** — answers are replaced by the selected blank style.
- **Answer key** — solved equations intended to accompany a practice worksheet.

**Answer blank style** is available for practice worksheets:

- **Writing line** — `7 × 8 = ______`
- **Single box** — `7 × 8 = □`
- **Open writing space** — leaves open space after the equals sign.

**Paper size** options:

- A4 portrait;
- US Letter portrait.

**Print columns** options:

- one column;
- two columns;
- three columns.

### Study sheet and answer key

Solved output displays equations such as:

```text
7 × 8 = 56
```

If text-to-speech controls are enabled and supported, the speaker control can read solved equations aloud.

Answer-key output contains solved equations but deliberately omits learner Name/Date metadata.

### Practice worksheet

Practice output hides answers according to the selected blank style. Speech answer controls are intentionally hidden in practice-worksheet mode so they do not reveal answers.

### Print

The print button follows the current output mode and is named **Print study sheet**, **Print practice worksheet**, or **Print answer key**.

TableSpark print CSS:

- hides application navigation and configuration controls;
- uses the selected A4/US Letter page intent where the browser supports named `@page` rules;
- uses the selected print column count;
- avoids splitting individual equation cards where possible;
- adds blank Name and Date lines only to learner-facing study/practice sheets;
- does not automatically print the active offline profile name.

Your browser's print engine still controls final margins, scaling, printer selection, headers, footers, and support for named page rules.

## 2. Practice

Open **Practice** to create a drill.

### Difficulty presets

- **Starter** — facts from 0 through 5, 10 questions.
- **Foundation** — facts from 0 through 10, 15 questions.
- **Builder** — facts from 2 through 12, 20 questions.
- **Fluency** — facts from 2 through 15, 25 questions.
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

Timed mode uses the configured time limit. The countdown appears in the practice header while a session is active. Reaching zero completes the current session summary with the score achieved so far.

### Answering

Enter a whole-number answer and choose **Check answer**. New practice responses are bounded to the supported persisted-answer range so the UI cannot create numeric values that the product does not intend to store.

TableSpark updates correctness, fact mastery, recent mistakes, and elapsed attempt time for the active offline profile.

### Session summaries

When a practice session completes, TableSpark stores one compact local session summary. It does not duplicate every submitted answer into session history.

A generated session summary contains:

- generated-drill kind;
- timed/untimed mode;
- completion timestamp;
- question count;
- correct count;
- total elapsed time;
- the visible replay seed.

A mistake-review summary uses the same outcome fields but does not claim a generated replay seed.

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
- optional mastery-goal progress;
- per-fact mastery percentages;
- current correct-answer streak per fact;
- recent session summaries;
- recent incorrect answers and correct answers.

A fact is considered **Mastered** after at least three attempts with 90% or better accuracy. This rule is intentionally visible rather than hidden behind an opaque adaptive score.

Use **Search facts** to find a multiplication fact such as `4 × 7`. Search treats `×` and `x` consistently and ignores spaces.

Use the **Show** filter to switch among:

- **All practiced facts**;
- **Needs practice**;
- **Mastered**.

Mastery keys treat multiplication as commutative: practicing 4 × 7 and 7 × 4 contributes to the same canonical fact key.

### Optional mastery goal

If the active profile has a mastered-facts goal, Progress shows the mastered count against the target and a percentage bar.

The goal is deliberately low-pressure:

- no deadline;
- no daily streak requirement;
- no punishment for inactivity;
- no ranking against other profiles;
- no notification pressure.

Reaching the target does not block continued practice.

### Recent sessions

The recent-session panel shows locally retained summaries. Generated sessions show their seed; mistake-review sessions do not.

Settings control how many summaries TableSpark retains per profile. The supported limits are 10, 25, 50, or 100.

## 4. Settings

### Language / भाषा

Use the language selector to choose:

- **English**;
- **हिन्दी**.

TableSpark remembers the interface language in this browser and updates the document language for browser/assistive-technology use. The locale preference is separate from learner-state backup JSON.

If there is no valid stored language preference, a Hindi browser language can select Hindi automatically; other browser languages fall back to English.

### Appearance & accessibility

- **Theme** — System, Light, or Dark.
- **Large-text classroom mode** — increases root text scale.
- **Reduce motion** — minimizes interface transition/animation durations.
- **Text-to-speech controls** — enables speaker controls where speech synthesis exists.

When the current browser does not provide a usable speech-synthesis API, the text-to-speech checkbox is disabled and TableSpark explains that the feature is unavailable instead of failing at runtime.

### Practice defaults

Set default question count and timed-drill duration for new practice setup screens.

### Learning records

**Session history retention** chooses how many recent session summaries to keep for each profile:

- latest 10;
- latest 25;
- latest 50;
- latest 100.

Reducing retention removes older session summaries immediately. Session history is summary-only; it is not a second copy of every answer.

### Optional mastery goal

Enter a positive mastered-facts target for the active profile or leave the field empty for no goal. Use **Clear goal** to remove the target.

The goal has no deadline, streak penalty, or notification requirement.

### Offline profiles

Profiles separate learning progress on the same browser/device without requiring accounts.

To create a profile:

1. Enter a name under **New profile name**.
2. Choose **Add profile**.
3. The new profile becomes active.

To switch profiles, choose a profile button.

You cannot delete the last remaining profile. This keeps application state valid. TableSpark shows local profile capacity and prevents creating more than 100 local profiles.

Each profile has separate mastery, mistakes, session history, and optional goal.

### Export backup

Choose **Export backup** to download validated JSON containing profiles, learning history, session summaries, goals, and learning settings.

The separate interface-language preference is not part of that learner-state JSON.

Store the file carefully because profile names and learning history can be personal data.

Ordinary backup export is disabled during the unreadable-data recovery state because the visible application state is then temporary rather than the original stored value.

### Import backup

Choose **Import backup** and select a compatible TableSpark JSON file. TableSpark asks for confirmation before replacement and validates the complete backup before accepting it.

A valid schema-1 backup/current value can be migrated to schema 2 by adding empty session history, no mastery goal, and the default session-retention setting before normal validation.

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
- a session summary has invalid counts, timestamps, seed semantics, or mode/kind;
- retained session history exceeds the configured retention limit;
- a mastery goal is outside the supported bounds;
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

This clears mastery statistics, saved mistakes, and session summaries for the selected profile after confirmation. It does not delete the profile and does not automatically clear its optional mastery goal. Clear the goal separately if desired.

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

## 6. Offline use and PWA lifecycle

After production PWA assets have been cached, core functionality is designed to work without a network connection:

- table generation and worksheet composition;
- practice;
- progress search/filtering and recent local session history;
- profiles/settings;
- language switching using locally bundled catalogs;
- local backup creation/import;
- local unreadable-data recovery actions.

External links and initial asset download naturally require connectivity.

### Offline-ready notice

When the service worker reports that the current application shell is cached for offline use, TableSpark can show **Offline use is ready.** Dismiss this message when no longer needed.

### Update notice

When a new service-worker version is ready, TableSpark does not automatically reload the current screen. It offers:

- **Update now** — apply the update and reload;
- **Later** — keep the current app session for now.

This avoids deliberately interrupting an active practice task.

### Optional installation

If the browser reports that TableSpark can be installed, the app can show **Install TableSpark**. Installation is optional. **Not now** dismisses the notice, and core learning features remain available in the browser.

Browsers/platforms control whether an install prompt is available.

## 7. Keyboard use

Use Tab/Shift+Tab to move through controls.

Desktop quick navigation shortcuts:

- Alt+1 — Tables
- Alt+2 — Practice
- Alt+3 — Progress
- Alt+4 — Settings
- Alt+5 — About

Shortcut help:

- `?` — open/close the in-app shortcut reference when focus is not inside an editable field;
- `Escape` — close the shortcut reference.

The shortcut reference can always be opened from its normal navigation button, so remembering a shortcut is not required.

If the operating system/browser reserves one of these shortcuts, use normal keyboard navigation instead.

## 8. Privacy reminder

TableSpark has no required cloud account. Local data can still be lost if browser/site storage is cleared or becomes unavailable. Export a backup before browser cleanup, device migration, or other destructive storage maintenance.

If TableSpark reports unreadable stored data, download the dedicated raw recovery artifact before discarding the value if there is any chance you may need it.

The interface-language preference is separate from learner backup files but is still browser site data and can be removed when site storage is cleared.
