import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { hindiMessages } from './hi';
import { type Locale, readLocalePreference, writeLocalePreference } from './localePreference';
import { englishMessages, type MessageCatalog } from './messages';

interface LocaleContextValue {
  readonly locale: Locale;
  readonly messages: MessageCatalog;
  readonly setLocale: (locale: Locale) => void;
}

const defaultValue: LocaleContextValue = {
  locale: 'en',
  messages: englishMessages,
  setLocale: () => undefined,
};

export const LocaleContext = createContext<LocaleContextValue>(defaultValue);

export function LocaleProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocalePreference);
  const messages = locale === 'hi' ? hindiMessages : englishMessages;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);
        writeLocalePreference(nextLocale);
      },
    }),
    [locale, messages],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
