import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { LocaleProvider } from './i18n/LocaleContext';
import { AppStateProvider } from './state/AppStateProvider';

function renderLocalizedApp() {
  return render(
    <LocaleProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </LocaleProvider>,
  );
}

describe('localized interface', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('tablespark.locale.v1', 'en');
  });

  it('switches the complete application shell to Hindi and updates the document language', async () => {
    const user = userEvent.setup();
    renderLocalizedApp();

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Language / भाषा' }), 'hi');

    expect(screen.getByRole('heading', { name: 'सेटिंग्स' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'पहाड़े' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'अभ्यास' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'प्रगति' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'परिचय' })).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe('hi'));
    expect(localStorage.getItem('tablespark.locale.v1')).toBe('hi');
  });

  it('restores the stored Hindi locale after remounting', async () => {
    localStorage.setItem('tablespark.locale.v1', 'hi');
    const first = renderLocalizedApp();

    expect(screen.getByRole('button', { name: 'पहाड़े' })).toBeInTheDocument();
    first.unmount();

    renderLocalizedApp();
    expect(screen.getByRole('button', { name: 'अभ्यास' })).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe('hi'));
  });

  it('keeps the locale preference outside the exported learner-state key', async () => {
    const user = userEvent.setup();
    renderLocalizedApp();

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Language / भाषा' }), 'hi');

    await waitFor(() => {
      const rawState = localStorage.getItem('tablespark.state.v1');
      expect(rawState).not.toBeNull();
      expect(rawState).not.toContain('tablespark.locale.v1');
      expect(rawState).not.toContain('"locale"');
    });
  });
});
