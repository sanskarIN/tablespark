# Accessibility

TableSpark treats accessibility as a product requirement for learners and classroom use.

## Implemented accessibility practices

### Keyboard access

- Primary navigation uses native buttons.
- Form controls use native inputs/selects.
- A skip link moves keyboard users directly to main content.
- Focus-visible styles use a strong outline.
- `Alt+1` through `Alt+5` switch between the five primary sections on desktop browsers when those shortcuts are not intercepted by the operating system/browser.

### Accessible names and semantics

- Inputs are wrapped by visible labels.
- Navigation has an explicit accessible label.
- Current navigation uses `aria-current="page"`.
- Status and error messages use appropriate live/status roles where useful.
- Decorative brand images use empty alternative text when the surrounding control already supplies the name.

### Text and zoom

- Layouts use responsive grids rather than fixed-width tables for most content.
- Large-text classroom mode increases the root font size.
- Text containers avoid unnecessary fixed heights.
- Controls remain touch-friendly at larger text sizes.

### Themes and contrast

- Light and dark themes use separate surface, text, border, and brand tokens.
- System mode follows the browser/operating-system color-scheme preference.
- Important correctness/error states include text, not color alone.

### Motion

The app contains only modest interface transitions. Reduced-motion mode collapses transition and animation durations to near zero. System `prefers-reduced-motion` also avoids optional hover movement where relevant.

### Speech

Text-to-speech is optional and progressive. The browser speech synthesis API is used only when available. Learning tasks remain fully usable without audio.

## Manual review checklist

Before a release candidate, test at minimum:

### Keyboard-only

- Tab through the header/navigation.
- Reach every table configuration control.
- Start and complete a practice question.
- Navigate to progress/settings/about.
- Create and select a profile.
- Export/import controls receive focus.
- No keyboard trap occurs.

### Focus

- Focus is visible against both light and dark surfaces.
- Focus order follows the visual/task order.
- Focus is not removed purely for visual styling.

### Screen reader

- Page/section headings describe the current feature.
- Navigation announces the current page.
- Question and result states make sense without relying on layout.
- Buttons have useful names rather than icon-only ambiguity.
- Offline and import-result status messages are announced without excessive repetition.

### Zoom and large text

Test browser zoom at 200% and TableSpark large-text mode. Confirm:

- controls do not overlap;
- horizontal scrolling is limited to intentionally scrollable navigation where needed;
- equations remain readable;
- practice controls remain operable;
- footer/support links remain available.

### Mobile/touch

Check narrow layouts around 320 CSS pixels and typical phone widths:

- topbar content remains readable;
- navigation can scroll horizontally if necessary;
- buttons remain large enough to activate comfortably;
- no hover-only action exists.

### Color and theme

Review:

- light theme;
- dark theme;
- system theme under both OS preferences;
- error/warning/success messages in grayscale if possible.

### Reduced motion

Enable TableSpark reduced-motion mode and the operating-system reduced-motion preference. Verify movement is not required to understand state changes.

### Print

Print preview is also an accessibility surface for classrooms. Verify equations are legible in monochrome and that controls/navigation are omitted from worksheets.

## Automated checks

ESLint includes `eslint-plugin-jsx-a11y` rules. Testing Library queries accessible roles/labels in integration tests. Playwright tests primary browser journeys.

Automated tooling cannot guarantee WCAG conformance. Manual review remains required.

## Known platform differences

- Browser support for speech synthesis and available voices differs by operating system/browser.
- PWA installation UI differs by browser.
- `Alt+number` shortcuts may conflict with browser/OS features on some systems; navigation remains fully clickable/tabbable.
- Print margins and browser headers/footers are controlled by the print dialog.

## Reporting accessibility issues

Open a GitHub issue with:

- affected browser/platform;
- assistive technology if relevant;
- expected behavior;
- actual behavior;
- reproducible steps.

Do not include sensitive personal information in screenshots or recordings.
