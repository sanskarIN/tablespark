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

describe('TableSpark application', () => {
  beforeEach(() => localStorage.clear());

  it('renders the primary generator and default equations', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: 'Multiplication tables' })).toBeInTheDocument();
    expect(screen.getByText('2 × 1 = 2')).toBeInTheDocument();
  });

  it('moves between major features with accessible navigation', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Practice' }));
    expect(
      screen.getByRole('heading', { name: 'Drill your multiplication skills' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('updates generated tables from user controls', async () => {
    const user = userEvent.setup();
    renderApp();
    const end = screen.getByRole('spinbutton', { name: 'Table end' });
    const start = screen.getByRole('spinbutton', { name: 'Table start' });
    await user.clear(end);
    await user.type(end, '9');
    await user.clear(start);
    await user.type(start, '9');
    expect(screen.getByText('9 × 1 = 9')).toBeInTheDocument();
  });

  it('switches between solved study sheets and blank worksheets', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('checkbox', { name: 'Hide answers for practice worksheet' }),
    );
    expect(screen.getByText('2 × 1 = ______')).toBeInTheDocument();
    expect(screen.queryByText('2 × 1 = 2')).not.toBeInTheDocument();
  });
});
