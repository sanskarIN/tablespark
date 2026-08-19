import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles.css';
import { AppStateProvider } from './state/AppState';

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
