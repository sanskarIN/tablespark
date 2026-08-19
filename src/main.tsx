import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LocaleProvider } from './i18n/LocaleContext';
import {
  dispatchPwaOfflineReady,
  dispatchPwaUpdateAvailable,
} from './infrastructure/pwaEvents';
import { AppStateProvider } from './state/AppStateProvider';
import './styles.css';
import './status.css';
import './shortcuts.css';
import './learning.css';

let updateSW: ReturnType<typeof registerSW> | undefined;
updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (updateSW) dispatchPwaUpdateAvailable(updateSW);
  },
  onOfflineReady() {
    dispatchPwaOfflineReady();
  },
});

const root = document.getElementById('root');
if (!root) throw new Error('Application root element was not found.');

createRoot(root).render(
  <StrictMode>
    <LocaleProvider>
      <ErrorBoundary>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </ErrorBoundary>
    </LocaleProvider>
  </StrictMode>,
);
