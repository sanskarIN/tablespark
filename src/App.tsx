import { useEffect, useState } from 'react';
import { StatusBanners } from './components/StatusBanners';
import { AboutPage } from './features/about/AboutPage';
import { PracticeDrill } from './features/practice/PracticeDrill';
import { ProgressDashboard } from './features/progress/ProgressDashboard';
import { SettingsPage } from './features/settings/SettingsPage';
import { TableGenerator } from './features/tables/TableGenerator';
import { copy } from './i18n/en';
import { useAppState } from './state/useAppState';

type View = keyof typeof copy.navigation;

const views: View[] = ['tables', 'practice', 'progress', 'settings', 'about'];

function resolveSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const { state, activeProfile } = useAppState();
  const [view, setView] = useState<View>('tables');

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      root.dataset.theme =
        state.settings.theme === 'system' ? resolveSystemTheme() : state.settings.theme;
    };
    applyTheme();
    root.classList.toggle('large-text', state.settings.largeText);
    root.classList.toggle('reduced-motion', state.settings.reducedMotion);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [state.settings.largeText, state.settings.reducedMotion, state.settings.theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const index = Number(event.key) - 1;
      const next = views[index];
      if (next) {
        event.preventDefault();
        setView(next);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar no-print">
        <button
          className="brand"
          type="button"
          onClick={() => setView('tables')}
          aria-label="Go to multiplication tables"
        >
          <img src="/logo.svg" alt="" width="42" height="42" />
          <span>
            <strong>{copy.appName}</strong>
            <small>{copy.tagline}</small>
          </span>
        </button>
        <div className="profile-chip" title="Active offline profile">
          {activeProfile.name}
        </div>
      </header>

      <nav className="navigation no-print" aria-label="Primary navigation">
        {views.map((item, index) => (
          <button
            key={item}
            type="button"
            className={view === item ? 'nav-button active' : 'nav-button'}
            onClick={() => setView(item)}
            aria-current={view === item ? 'page' : undefined}
            title={`Alt+${index + 1}`}
          >
            {copy.navigation[item]}
          </button>
        ))}
      </nav>

      <div className="content banner-content">
        <StatusBanners />
      </div>

      <main id="main-content" className="content" tabIndex={-1}>
        {view === 'tables' ? <TableGenerator /> : null}
        {view === 'practice' ? <PracticeDrill /> : null}
        {view === 'progress' ? <ProgressDashboard /> : null}
        {view === 'settings' ? <SettingsPage /> : null}
        {view === 'about' ? <AboutPage /> : null}
      </main>

      <footer className="footer no-print">
        <span>{copy.credit}</span>
        <a href="https://buymeacoffee.com/sanskarIN" target="_blank" rel="noreferrer">
          Support TableSpark
        </a>
      </footer>
    </div>
  );
}
