# Accessibility

TableSpark treats accessibility as a product requirement for learners and classroom use.

## Implemented accessibility practices

### Keyboard access

- Primary navigation uses native buttons.
- Form controls use native inputs/selects.
- A skip link moves keyboard users directly to main content.
- Focus-visible styles use a strong outline.
- `Alt+1` through `Alt+5` switch between the five primary sections on desktop browsers when those shortcuts are not intercepted by the operating system/browser.
- Destructive actions remain native buttons and require confirmation only when data loss is meaningful.

### Accessible names and semantics

- Inputs are wrapped by visible labels.
- Navigation has an explicit accessible label.
- Current navigation uses `aria-current="page"`.
- Status and error messages use appropriate live/status/alert roles where useful.
- Browser-storage durability failure uses an alert role because the user needs to know that changes may not survive reload.
- Unsupported speech controls use `aria-describedby` to associate the disabled checkbox with the explanation.
- Mastery progress bars expose a textual percentage label.
- Decorative brand images use empty alternative text when the surrounding control already supplies the name.

### Text and zoom

- Layouts use responsive grids rather than fixed-width tables for most content.
- Large-text classroom mode increases the root font size.
- Text containers avoid unnecessary fixed heights.
- Controls remain touch-friendly at larger text sizes.
- Progress search/filter controls collapse naturally with the responsive control grid.

### Themes and contrast

- Light and dark themes use separate surface, text, border, and brand tokens.
- System mode follows the browser/operating-system color-scheme preference.
- Important correctness/error states include text, not color alone.
- Disabled controls use opacity plus native disabled semantics; important explanations remain available as text.

### Motion

The app contains only modest interface transitions. Reduced-motion mode collapses transition and animation durations to near zero. System `prefers-reduced-motion` also avoids optional hover movement where relevant.

### Speech

Text-to-speech is optional and progressive. The browser speech synthesis API is used only when usable callable support exists. If support is unavailable, Settings disables the checkbox and displays explanatory text. Runtime speech exceptions are treated as non-fatal. Learning tasks remain fully usable without audio.

### Printed classroom output

Print-only worksheet headings include blank Name and Date lines rather than automatically printing the active offline profile name. This keeps the worksheet useful while reducing accidental disclosure of locally stored learner identity.

## Manual review checklist

Before a release candidate, test at minimum:

### Keyboard-only

- Tab through the header/navigation.
- Reach every table configuration control.
- Toggle solved/blank worksheet mode.
- Start and complete a practice question.
- Reach seed randomization and repeat-session controls.
- Navigate to progress/settings/about.
- Search and filter practiced mastery facts.
- Create and select a profile.
- Export/import controls receive focus.
- Disabled controls are skipped/announced appropriately.
- No keyboard trap occurs.

### Focus

- Focus is visible against both light and dark surfaces.
- Focus order follows the visual/task order.
- Focus is not removed purely for visual styling.
- Returning from a browser confirmation does not leave the user unable to continue the task.

### Screen reader

- Page/section headings describe the current feature.
- Navigation announces the current page.
- Question and result states make sense without relying on layout.
- Buttons have useful names rather than icon-only ambiguity.
- Offline, storage-failure, and import-result status messages are announced without excessive repetition.
- The speech-unavailable explanation is associated with the disabled control.
- Search and filter labels clearly describe their purpose.
- Mastery percentage information is available without relying on the visual bar width.

### Zoom and large text

Test browser zoom at 200% and TableSpark large-text mode. Confirm:

- controls do not overlap;
- horizontal scrolling is limited to intentionally scrollable navigation where needed;
- equations remain readable;
- practice controls remain operable;
- progress search/filter controls remain understandable;
- persistence/offline banners reflow without losing content;
- footer/support links remain available.

### Mobile/touch

Check narrow layouts around 320 CSS pixels and typical phone widths:

- topbar content remains readable;
- navigation can scroll horizontally if necessary;
- buttons remain large enough to activate comfortably;
- disabled buttons are visually distinguishable;
- progress rows collapse to a readable single-column layout;
- no hover-only action exists.

### Color and theme

Review:

- light theme;
- dark theme;
- system theme under both OS preferences;
- error/warning/success messages in grayscale if possible;
- progress bars with their adjacent numeric percentage still visible.

### Reduced motion

Enable TableSpark reduced-motion mode and the operating-system reduced-motion preference. Verify movement is not required to understand state changes.

### Print

Print preview is also an accessibility surface for classrooms. Verify:

- equations are legible in monochrome;
- controls/navigation are omitted;
- the correct solved/blank worksheet heading is printed;
- Name and Date lines are clear;
- no active local profile name is inserted automatically;
- page breaks do not cut equation cards in an unreadable way.

## Automated checks

ESLint includes `eslint-plugin-jsx-a11y` rules. Testing Library queries accessible roles/labels in integration tests, including progress search/filtering, speech fallback, and persistence alerts. Playwright tests primary browser journeys.

Automated tooling cannot guarantee WCAG conformance. Manual review remains required.

## Known platform differences

- Browser support for speech synthesis and available voices differs by operating system/browser.
- PWA installation UI differs by browser.
- `Alt+number` shortcuts may conflict with browser/OS features on some systems; navigation remains fully clickable/tabbable.
- Browser storage behavior can differ in private modes and restrictive storage policies; TableSpark surfaces failed writes but cannot override browser policy.
- Print margins and browser headers/footers are controlled by the print dialog.

## Reporting accessibility issues

Open a GitHub issue with:

- affected browser/platform;
- assistive technology if relevant;
- expected behavior;
- actual behavior;
- reproducible steps.

Do not include sensitive personal information in screenshots or recordings.
