import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppStateProvider } from './state/AppStateProvider';
import './styles.css';
import './status.css';
import './shortcuts.css';

registerSW({ immediate: true });

const root = document.getElementById('root');
if (!root) throw new Error('Application root element was not found.');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </ErrorBoundary>
  </StrictMode>,
);
