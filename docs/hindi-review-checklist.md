# Hindi Interface Review Checklist

Use this checklist with a fluent or native Hindi reviewer before making a strong public claim that the Hindi interface is publication-ready. Automated tests can verify message completeness, runtime switching, persistence, and browser rendering, but they cannot prove that terminology sounds natural to learners.

## Review identity

| Field | Value |
| --- | --- |
| Candidate commit | Not yet recorded |
| Review date | Not yet recorded |
| Reviewer | Not yet recorded |
| Reviewer fluency/context | Not yet recorded |
| Browser/device | Not yet recorded |

Do not store private learner information in review notes or screenshots.

## 1. Navigation and shell

Review the Hindi interface for:

- [ ] Tables/पहाड़े navigation terminology.
- [ ] Practice/अभ्यास terminology.
- [ ] Progress/प्रगति terminology.
- [ ] Settings/सेटिंग्स terminology.
- [ ] About/परिचय terminology.
- [ ] Skip-link wording.
- [ ] Active-profile label.
- [ ] Support/funding wording remains clearly optional.
- [ ] The `Language / भाषा` control is understandable even when the rest of the interface is Hindi.

## 2. Multiplication and worksheet terminology

Check that school-learning language is natural and age-appropriate:

- [ ] Multiplication-table heading.
- [ ] Table start/end terminology.
- [ ] Multiplier start/end terminology.
- [ ] Step terminology.
- [ ] Worksheet-composer heading and explanation.
- [ ] Solved study-sheet terminology.
- [ ] Practice-worksheet terminology.
- [ ] Answer-key terminology.
- [ ] Writing-line / box / open-space labels.
- [ ] Paper-size and column labels.
- [ ] Name and Date print metadata.
- [ ] Generic invalid-table message is clear without exposing technical implementation details.

## 3. Practice terminology

Review:

- [ ] Difficulty preset names feel natural rather than mechanically translated.
- [ ] Starter/Foundation/Builder/Fluency/Challenge convey a sensible progression.
- [ ] Minimum/maximum/question-count labels.
- [ ] Seed terminology is understandable enough for replay without implying security.
- [ ] Timed/untimed mode wording.
- [ ] Time-limit label.
- [ ] Start/check-answer controls.
- [ ] Correct/incorrect feedback.
- [ ] Whole-number validation message.
- [ ] Session-complete and score wording.
- [ ] New-random-drill and repeat-seed controls.
- [ ] Mistake-review terminology and completion note.
- [ ] No-mistakes and generic start/review failure messages.

## 4. Progress and learning records

Review:

- [ ] Accuracy, attempts, practiced facts, mastered facts, and saved mistakes.
- [ ] Mastery rule explains the 3-attempt/90% rule correctly.
- [ ] Search/filter labels and empty states.
- [ ] Correct-answer streak wording does not sound punitive.
- [ ] Optional mastery-goal wording remains low-pressure.
- [ ] Goal completion wording does not imply a deadline or obligation.
- [ ] Recent-session terminology distinguishes generated drills from mistake review.
- [ ] Timed/untimed session labels.
- [ ] Session score and duration wording.
- [ ] Retention-limit wording is understandable.
- [ ] Seed display remains recognizable as a technical replay identifier.

## 5. Settings, privacy, and recovery

These messages need especially careful review because mistranslation can change the meaning of destructive or privacy-sensitive actions.

- [ ] Appearance/accessibility heading.
- [ ] Theme labels.
- [ ] Large-text and reduced-motion wording.
- [ ] Text-to-speech wording and unsupported-browser explanation.
- [ ] Practice-default labels.
- [ ] Session-history retention explanation clearly says older summaries are removed when the limit is reduced.
- [ ] Optional goal explanation clearly says there is no deadline, streak requirement, penalty, or notification pressure.
- [ ] Profile capacity/create/delete wording.
- [ ] Backup privacy notice.
- [ ] Export/import labels.
- [ ] Backup replacement confirmation clearly states existing data will be replaced.
- [ ] Profile-delete confirmation is explicit and irreversible.
- [ ] Progress-reset confirmation is clear.
- [ ] Unreadable-data recovery explanation accurately says the original stored value is preserved.
- [ ] Raw recovery download wording is clear.
- [ ] Unreadable-data discard confirmation is unmistakably destructive.
- [ ] Generic backup import failure wording is understandable without exposing untranslated validation internals.

## 6. PWA and offline messaging

Review:

- [ ] Offline message explains core learning features still work.
- [ ] Offline-ready message is clear and dismissible.
- [ ] Update-ready message makes it clear reload is user-controlled.
- [ ] Update now / Later labels are unambiguous.
- [ ] Install wording makes installation optional.
- [ ] Not-now wording does not sound like losing product access.
- [ ] No wording implies that installation creates an account.

## 7. Keyboard and accessibility wording

Review:

- [ ] Keyboard-shortcut title/description.
- [ ] Alt+1 through Alt+5 descriptions.
- [ ] Question-mark shortcut description.
- [ ] Escape description.
- [ ] Shortcut help remains understandable with technical key names left intact.
- [ ] Screen-reader labels are meaningful when heard without visual context.
- [ ] Hindi interface sets the document language to `hi` during the review.

## 8. About, identity, and external links

Review:

- [ ] About-page description.
- [ ] Version/license/privacy/credit labels.
- [ ] Business/support contact labels.
- [ ] GitHub labels.
- [ ] Buy Me a Coffee wording remains optional support rather than a requirement.
- [ ] Brand/product names, emails, URLs, version numbers, and `MIT` are not incorrectly translated.

## 9. Layout review

Review the actual built interface, not only message files.

### Wide layout

- [ ] Hindi navigation fits or scrolls without clipping.
- [ ] Headings wrap cleanly.
- [ ] Forms do not overlap.
- [ ] Session-history rows remain readable.
- [ ] Status/PWA banners fit naturally.

### Compact layout

At approximately 390 CSS pixels and, where practical, near 320 CSS pixels:

- [ ] Navigation remains usable.
- [ ] Buttons do not overlap or truncate essential meaning.
- [ ] Form labels wrap without covering inputs.
- [ ] Shortcut dialog remains dismissible.
- [ ] Progress/session cards remain understandable.
- [ ] Long privacy/recovery text reflows without horizontal clipping.

### Large text / zoom

- [ ] Large-text classroom mode remains usable in Hindi.
- [ ] Browser zoom at 200% does not hide required controls.
- [ ] Destructive confirmations remain readable.

## 10. Print review

In Hindi mode, inspect real browser print preview for:

- [ ] Solved study-sheet heading.
- [ ] Practice-worksheet heading.
- [ ] Answer-key heading.
- [ ] Name/Date lines on learner-facing sheets only.
- [ ] No active local profile name is inserted automatically.
- [ ] A4 layout.
- [ ] US Letter layout.
- [ ] One-, two-, and three-column layouts.
- [ ] Hindi glyphs render correctly in the browser/printer font stack.
- [ ] Headings and metadata do not clip.

## 11. Assistive-technology review

Where the platform provides a suitable Hindi voice/language configuration:

- [ ] Navigation labels are announced intelligibly.
- [ ] Form labels and descriptions are associated correctly.
- [ ] Status and recovery alerts make sense when heard without the layout.
- [ ] Document-language switching changes pronunciation behavior as expected for the platform.
- [ ] Progress and goal percentages are understandable without relying on visual bars.

Record platform limitations separately. Poor or missing system Hindi voices should not be misreported as a TableSpark translation defect unless the application supplied incorrect language metadata or labels.

## 12. Review outcome

Classify findings:

- **Blocking** — changes meaning, safety/privacy meaning, mathematical meaning, destructive-action meaning, or makes a key flow unusable.
- **Important** — understandable but unnatural/confusing enough to reduce learning quality.
- **Polish** — stylistic improvement with no material ambiguity.

| Finding | Severity | Location/message | Recommended wording | Fix commit | Retest |
| --- | --- | --- | --- | --- | --- |
| None recorded yet | — | — | — | — | — |

## Completion rule

Only mark the Hindi interface review complete when:

1. a fluent/native reviewer has reviewed the current release-candidate commit;
2. all blocking findings are fixed and retested;
3. important terminology findings are either fixed or explicitly documented as accepted wording;
4. compact/wide and print checks have been performed on the real built UI;
5. the result is recorded in `docs/release-evidence.md`.

Until then, documentation should describe Hindi as an included translated interface with automated coverage, not as independently certified or professionally reviewed translation quality.
