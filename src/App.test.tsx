import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('searches and filters practiced facts on the progress dashboard', async () => {
    localStorage.setItem(
      'tablespark.state.v1',
      JSON.stringify({
        schemaVersion: 1,
        activeProfileId: 'p1',
        profiles: [
          {
            id: 'p1',
            name: 'Learner',
            createdAt: '2026-08-19T00:00:00.000Z',
            mastery: {
              '4x7': {
                key: '4x7',
                attempts: 5,
                correct: 5,
                streak: 5,
                lastAttemptAt: '2026-08-19T00:00:01.000Z',
              },
              '6x8': {
                key: '6x8',
                attempts: 5,
                correct: 3,
                streak: 0,
                lastAttemptAt: '2026-08-19T00:00:02.000Z',
              },
            },
            mistakes: [],
          },
        ],
        settings: {
          theme: 'system',
          largeText: false,
          reducedMotion: false,
          speechEnabled: false,
          defaultQuestionCount: 10,
          defaultTimeLimitSeconds: 60,
        },
      }),
    );

    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Progress' }));
    expect(screen.getByText('4 × 7')).toBeInTheDocument();
    expect(screen.getByText('6 × 8')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Show' }), 'mastered');
    expect(screen.getByText('4 × 7')).toBeInTheDocument();
    expect(screen.queryByText('6 × 8')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Show' }), 'all');
    await user.type(screen.getByRole('searchbox', { name: 'Search facts' }), '6 × 8');
    expect(screen.getByText('6 × 8')).toBeInTheDocument();
    expect(screen.queryByText('4 × 7')).not.toBeInTheDocument();
  });

  it('warns when browser storage cannot persist changes', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    renderApp();
    expect(await screen.findByRole('alert')).toHaveTextContent('Local saving is unavailable.');
    setItem.mockRestore();
  });
});
