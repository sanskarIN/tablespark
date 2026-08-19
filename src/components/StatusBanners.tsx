import { useEffect, useState } from 'react';
import { copy } from '../i18n/en';
import { readBooleanFlag, writeBooleanFlag } from '../infrastructure/browserPreferences';
import {
  PWA_OFFLINE_READY_EVENT,
  PWA_UPDATE_AVAILABLE_EVENT,
  type PwaUpdateAvailableDetail,
} from '../infrastructure/pwaEvents';
import { useAppState } from '../state/useAppState';

const ONBOARDING_KEY = 'tablespark.onboarding.dismissed.v1';

type ApplyUpdate = () => Promise<void>;

export function StatusBanners() {
  const { persistenceAvailable, unreadableStoredState } = useAppState();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [showWelcome, setShowWelcome] = useState(() => !readBooleanFlag(ONBOARDING_KEY));
  const [offlineReady, setOfflineReady] = useState(false);
  const [applyUpdate, setApplyUpdate] = useState<ApplyUpdate | null>(null);

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

  useEffect(() => {
    const onOfflineReady = () => setOfflineReady(true);
    const onUpdateAvailable = (event: Event) => {
      const detail = (event as CustomEvent<PwaUpdateAvailableDetail>).detail;
      if (!detail?.update) return;
      setApplyUpdate(() => () => detail.update(true));
    };

    window.addEventListener(PWA_OFFLINE_READY_EVENT, onOfflineReady);
    window.addEventListener(PWA_UPDATE_AVAILABLE_EVENT, onUpdateAvailable);
    return () => {
      window.removeEventListener(PWA_OFFLINE_READY_EVENT, onOfflineReady);
      window.removeEventListener(PWA_UPDATE_AVAILABLE_EVENT, onUpdateAvailable);
    };
  }, []);

  const dismissWelcome = () => {
    writeBooleanFlag(ONBOARDING_KEY, true);
    setShowWelcome(false);
  };

  return (
    <div className="banner-stack no-print">
      {unreadableStoredState ? (
        <div className="banner warning" role="alert">
          <strong>{copy.status.recoveryTitle}</strong> {copy.status.recoveryBody}
        </div>
      ) : null}
      {!persistenceAvailable && !unreadableStoredState ? (
        <div className="banner warning" role="alert">
          <strong>{copy.status.storageTitle}</strong> {copy.status.storageBody}
        </div>
      ) : null}
      {!online ? (
        <div className="banner warning" role="status">
          <strong>{copy.status.offlineTitle}</strong> {copy.status.offlineBody}
        </div>
      ) : null}
      {applyUpdate ? (
        <div className="banner update" role="status">
          <div>
            <strong>{copy.status.updateTitle}</strong>
            <span>{copy.status.updateBody}</span>
          </div>
          <div className="banner-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => void applyUpdate()}
            >
              {copy.status.updateNow}
            </button>
            <button className="text-button" type="button" onClick={() => setApplyUpdate(null)}>
              {copy.status.updateLater}
            </button>
          </div>
        </div>
      ) : null}
      {offlineReady ? (
        <div className="banner ready" role="status">
          <div>
            <strong>{copy.status.offlineReadyTitle}</strong>
            <span>{copy.status.offlineReadyBody}</span>
          </div>
          <button className="text-button" type="button" onClick={() => setOfflineReady(false)}>
            {copy.status.dismissOfflineReady}
          </button>
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
