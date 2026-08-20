import { useEffect, useState } from 'react';
import { StatusBanners } from './components/StatusBanners';
import { AboutPage } from './features/about/AboutPage';
import { PracticeDrill } from './features/practice/PracticeDrill';
import { ProgressDashboard } from './features/progress/ProgressDashboard';
import { SettingsPage } from './features/settings/SettingsPage';
import { TableGenerator } from './features/tables/TableGenerator';
import { useLocale } from './i18n/LocaleContext';
import type { MessageCatalog } from './i18n/messages';
import { handleExternalLinkClick } from './platform/openExternalUrl';
import { useAppState } from './state/useAppState';

type View = keyof MessageCatalog['copy']['navigation'];

const views: View[] = ['tables', 'practice', 'progress', 'settings', 'about'];

function resolveSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))
  );
}

export default function App() {
  const { state, activeProfile } = useAppState();
  const { messages } = useLocale();
  const { copy, shortcuts } = messages;
  const [view, setView] = useState<View>('tables');
  const [showShortcuts, setShowShortcuts] = useState(false);

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
      if (event.key === 'Escape' && showShortcuts) {
        event.preventDefault();
        setShowShortcuts(false);
        return;
      }

      if (isEditableTarget(event.target)) return;

      if (event.key === '?') {
        event.preventDefault();
        setShowShortcuts((current) => !current);
        return;
      }

      if (!event.altKey) return;
      const index = Number(event.key) - 1;
      const next = views[index];
      if (next) {
        event.preventDefault();
        setView(next);
        setShowShortcuts(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showShortcuts]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {copy.shell.skipToContent}
      </a>
      <header className="topbar no-print">
        <button
          className="brand"
          type="button"
          onClick={() => setView('tables')}
          aria-label={copy.shell.goToTables}
        >
          <img src="/logo.svg" alt="" width="42" height="42" />
          <span>
            <strong>{copy.appName}</strong>
            <small>{copy.tagline}</small>
          </span>
        </button>
        <div className="profile-chip" title={copy.shell.activeProfile}>
          {activeProfile.name}
        </div>
      </header>

      <nav className="navigation no-print" aria-label={copy.shell.primaryNavigation}>
        {views.map((item, index) => (
          <button
            key={item}
            type="button"
            className={view === item ? 'nav-button active' : 'nav-button'}
            onClick={() => setView(item)}
            aria-current={view === item ? 'page' : undefined}
            title={copy.shell.shortcut(index + 1)}
          >
            {copy.navigation[item]}
          </button>
        ))}
        <button
          className="nav-button shortcut-help-button"
          type="button"
          onClick={() => setShowShortcuts((current) => !current)}
          aria-haspopup="dialog"
          aria-expanded={showShortcuts}
        >
          {shortcuts.open}
        </button>
      </nav>

      {showShortcuts ? (
        <div className="shortcut-backdrop no-print">
          <section
            className="shortcut-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcut-dialog-title"
            aria-describedby="shortcut-dialog-description"
          >
            <div className="section-heading">
              <div>
                <h2 id="shortcut-dialog-title">{shortcuts.title}</h2>
                <p id="shortcut-dialog-description">{shortcuts.description}</p>
              </div>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowShortcuts(false)}
              >
                {shortcuts.close}
              </button>
            </div>
            <dl className="shortcut-list">
              {views.map((item, index) => (
                <div key={item}>
                  <dt>
                    <kbd>{shortcuts.navigationKey(index + 1)}</kbd>
                  </dt>
                  <dd>{shortcuts.navigationDescription(copy.navigation[item])}</dd>
                </div>
              ))}
              <div>
                <dt>
                  <kbd>{shortcuts.helpKey}</kbd>
                </dt>
                <dd>{shortcuts.helpDescription}</dd>
              </div>
              <div>
                <dt>
                  <kbd>{shortcuts.escapeKey}</kbd>
                </dt>
                <dd>{shortcuts.escapeDescription}</dd>
              </div>
            </dl>
          </section>
        </div>
      ) : null}

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
        <a
          href="https://buymeacoffee.com/sanskarIN"
          target="_blank"
          rel="noreferrer"
          onClick={handleExternalLinkClick}
        >
          {copy.shell.support}
        </a>
      </footer>
    </div>
  );
}
