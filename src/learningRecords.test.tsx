import { render, screen, waitFor } from '@testing-library/react';
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

describe('learning records', () => {
  beforeEach(() => localStorage.clear());

  it('records a completed drill as a bounded local session summary', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Practice' }));
    await user.clear(screen.getByRole('spinbutton', { name: 'Minimum' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Minimum' }), '5');
    await user.clear(screen.getByRole('spinbutton', { name: 'Maximum' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Maximum' }), '5');
    await user.clear(screen.getByRole('spinbutton', { name: 'Questions' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Questions' }), '1');
    await user.click(screen.getByRole('button', { name: 'Start drill' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Your answer' }), '25');
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(await screen.findByText('Score 1 of 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Progress' }));
    expect(await screen.findByText('Generated drill')).toBeInTheDocument();
    expect(screen.getByText('1/1 correct')).toBeInTheDocument();
    expect(screen.getByText('1 saved locally · retention limit 25')).toBeInTheDocument();

    await waitFor(() => {
      const raw = localStorage.getItem('tablespark.state.v1');
      expect(raw).not.toBeNull();
      const stored = JSON.parse(raw ?? '{}') as {
        schemaVersion?: number;
        profiles?: Array<{ sessions?: unknown[] }>;
      };
      expect(stored.schemaVersion).toBe(2);
      expect(stored.profiles?.[0]?.sessions).toHaveLength(1);
    });
  });

  it('lets the active profile use an optional mastery goal without deadline mechanics', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    const goal = screen.getByRole('spinbutton', { name: 'Mastered facts goal' });
    await user.type(goal, '12');

    await user.click(screen.getByRole('button', { name: 'Progress' }));
    expect(screen.getByText('0 of 12 mastered facts')).toBeInTheDocument();
    expect(screen.queryByText(/deadline/i)).not.toBeInTheDocument();
  });

  it('trims saved session summaries when retention is reduced', async () => {
    const sessions = Array.from({ length: 12 }, (_, index) => ({
      id: `session-${index}`,
      kind: 'generated',
      mode: 'untimed',
      completedAt: '2026-08-19T00:00:00.000Z',
      questionCount: 10,
      correctCount: 8,
      elapsedMs: 1000,
      seed: index,
    }));
    localStorage.setItem(
      'tablespark.state.v1',
      JSON.stringify({
        schemaVersion: 2,
        activeProfileId: 'p1',
        profiles: [
          {
            id: 'p1',
            name: 'Learner',
            createdAt: '2026-08-19T00:00:00.000Z',
            mastery: {},
            mistakes: [],
            sessions,
            masteredFactsGoal: null,
          },
        ],
        settings: {
          theme: 'system',
          largeText: false,
          reducedMotion: false,
          speechEnabled: false,
          defaultQuestionCount: 10,
          defaultTimeLimitSeconds: 60,
          sessionHistoryLimit: 25,
        },
      }),
    );

    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Session history retention' }),
      '10',
    );
    await user.click(screen.getByRole('button', { name: 'Progress' }));

    expect(screen.getByText('10 saved locally · retention limit 10')).toBeInTheDocument();
  });
});
