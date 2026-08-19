import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { AppStateProvider } from './state/AppStateProvider';

function renderApp() {
  return render(
    <AppStateProvider>
      <App />
    </AppStateProvider>,
  );
}

describe('keyboard shortcut reference', () => {
  beforeEach(() => localStorage.clear());

  it('opens from the navigation and closes with Escape', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Keyboard shortcuts' }));
    expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
    expect(screen.getByText('Alt+1')).toBeInTheDocument();
    expect(screen.getByText('Open Tables')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Keyboard shortcuts' })).not.toBeInTheDocument();
  });

  it('toggles the shortcut reference with question mark outside editable controls', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.keyboard('?');
    expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
    await user.keyboard('?');
    expect(screen.queryByRole('dialog', { name: 'Keyboard shortcuts' })).not.toBeInTheDocument();
  });

  it('does not intercept question mark while a form field is focused', async () => {
    const user = userEvent.setup();
    renderApp();

    const tableStart = screen.getByRole('spinbutton', { name: 'Table start' });
    tableStart.focus();
    await user.keyboard('?');

    expect(screen.queryByRole('dialog', { name: 'Keyboard shortcuts' })).not.toBeInTheDocument();
  });
});
