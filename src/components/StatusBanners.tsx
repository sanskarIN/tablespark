import { useEffect, useState } from 'react';
import { readBooleanFlag, writeBooleanFlag } from '../infrastructure/browserPreferences';
import { useAppState } from '../state/useAppState';

const ONBOARDING_KEY = 'tablespark.onboarding.dismissed.v1';

export function StatusBanners() {
  const { persistenceAvailable } = useAppState();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [showWelcome, setShowWelcome] = useState(() => !readBooleanFlag(ONBOARDING_KEY));

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const dismissWelcome = () => {
    writeBooleanFlag(ONBOARDING_KEY, true);
    setShowWelcome(false);
  };

  return (
    <div className="banner-stack no-print">
      {!persistenceAvailable ? (
        <div className="banner warning" role="alert">
          <strong>Local saving is unavailable.</strong> Changes can still work in this tab, but they
          may not survive a reload. Free browser storage or allow site storage, then export a backup
          when saving becomes available again.
        </div>
      ) : null}
      {!online ? (
        <div className="banner warning" role="status">
          <strong>You’re offline.</strong> Table generation, practice, progress, and local profiles
          still work.
        </div>
      ) : null}
      {showWelcome ? (
        <div className="banner welcome" role="region" aria-label="Welcome to TableSpark">
          <div>
            <strong>Welcome to TableSpark</strong>
            <span>
              Start with custom tables, then use Practice to build mastery. Your data stays on this
              device by default.
            </span>
          </div>
          <button className="text-button" type="button" onClick={dismissWelcome}>
            Got it
          </button>
        </div>
      ) : null}
    </div>
  );
}
