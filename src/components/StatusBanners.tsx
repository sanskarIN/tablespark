import { useEffect, useState } from 'react';
import { copy } from '../i18n/en';
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
          <strong>{copy.status.storageTitle}</strong> {copy.status.storageBody}
        </div>
      ) : null}
      {!online ? (
        <div className="banner warning" role="status">
          <strong>{copy.status.offlineTitle}</strong> {copy.status.offlineBody}
        </div>
      ) : null}
      {showWelcome ? (
        <div className="banner welcome" role="region" aria-label={copy.status.welcomeLabel}>
          <div>
            <strong>{copy.status.welcomeTitle}</strong>
            <span>{copy.status.welcomeBody}</span>
          </div>
          <button className="text-button" type="button" onClick={dismissWelcome}>
            {copy.status.dismissWelcome}
          </button>
        </div>
      ) : null}
    </div>
  );
}
