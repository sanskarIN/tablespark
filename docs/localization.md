# Localization

TableSpark currently ships an English interface and a Hindi (`hi`) interface through one central locale provider.

## Current locale model

Runtime message catalogs live under `src/i18n/`:

- `en.ts` — primary English product copy;
- `learning.ts` — English learning-record/goal copy;
- `pwa.ts` — English install-prompt copy;
- `shortcuts.ts` — English shortcut-reference copy;
- `messages.ts` — composes the English catalog and exports the catalog type;
- `hi.ts` — Hindi catalog with the same typed shape;
- `LocaleContext.tsx` — central runtime locale provider;
- `localePreference.ts` — supported locales and resilient browser preference storage.

The provider exposes the active `locale`, the corresponding typed `messages`, and `setLocale()`.

## Supported languages

| Locale | Interface name | Status |
| --- | --- | --- |
| `en` | English | Primary/source locale |
| `hi` | हिन्दी | Included translated locale |

The language selector deliberately shows language names in their own script so a learner can recover from choosing an unfamiliar interface language.

## Preference storage

The locale preference is stored under:

```text
tablespark.locale.v1
```

This preference is intentionally separate from the learner-state backup key. Changing interface language does not change mastery statistics, profiles, session summaries, or optional goals, and the locale preference is not copied into exported learner-state JSON.

If no valid saved preference exists, TableSpark uses Hindi when the browser language starts with `hi`; otherwise it falls back to English.

Storage read/write failures are non-fatal. The interface continues with its in-memory locale.

## Document language

`LocaleProvider` updates the root `<html lang>` attribute whenever the locale changes. This helps browsers and assistive technologies choose appropriate language rules and pronunciation behavior.

## Adding another locale

1. Add the locale identifier to the `Locale` union and `SUPPORTED_LOCALES` list in `localePreference.ts`.
2. Create a catalog matching `MessageCatalog` exactly.
3. Wire that catalog into `LocaleProvider`.
4. Review terminology with a fluent speaker rather than relying only on literal word substitution.
5. Add component/integration coverage for switching to the locale.
6. Add at least one Playwright smoke path verifying the language persists across reload.
7. Manually review narrow/mobile layouts because translated strings can be significantly longer than English.
8. Review print output and text-to-speech behavior for the new language.
9. Update this document, README, changelog, roadmap, and accessibility notes.

The type relationship between the English source catalog and translated catalogs is intentional: a missing or structurally incorrect message should fail TypeScript checks rather than silently producing an undefined UI string.

## Translation guidance

Preserve meaning over English word order. In particular:

- keep multiplication terminology appropriate for school learners;
- keep destructive/recovery warnings explicit;
- do not weaken privacy language;
- keep optional goals non-punitive and free of artificial streak pressure;
- keep install/donation language optional rather than coercive;
- keep technical identifiers such as version numbers, seeds, email addresses, and GitHub names unchanged when translation would make them inaccurate.

## Difficulty descriptions

The stored difficulty preset metadata in `src/domain/difficulty.ts` is domain metadata rather than the primary visible option label. Visible preset names/ranges come from the locale catalog. If preset descriptions are surfaced more broadly in the future, move their human-facing descriptions into locale messages instead of adding additional English-only UI text to the domain layer.

## Testing

Localization is covered by:

- compile-time catalog shape validation;
- `src/localization.test.tsx` for runtime switching, `<html lang>`, persistence, and separation from learner-state storage;
- `e2e/localization.spec.ts` for a browser-level Hindi switch and reload;
- existing accessibility checks, which continue to require labels on form controls regardless of active locale.

A green automated suite does not replace a native-speaker review for translation quality.
