import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { AppStateProvider } from './state/AppStateProvider';
import { useAppState } from './state/useAppState';

function renderApp() {
  return render(
    <AppStateProvider>
      <App />
    </AppStateProvider>,
  );
}

function ProfileCapacityHarness() {
  const { addProfile, state } = useAppState();
  return (
    <>
      <output aria-label="Profile count">{state.profiles.length}</output>
      <button
        type="button"
        onClick={() => {
          addProfile('Learner 100');
          addProfile('Learner 101');
        }}
      >
        Add two profiles
      </button>
    </>
  );
}

function StorageStatusHarness() {
  const { persistenceAvailable, storageReadUnavailable, unreadableStoredState } = useAppState();
  return (
    <output aria-label="Storage status">
      {persistenceAvailable ? 'saving available' : 'saving unavailable'} · recovery{' '}
      {unreadableStoredState ? 'required' : 'not required'} · read{' '}
      {storageReadUnavailable ? 'unavailable' : 'available'}
    </output>
  );
}

const replacementBackup = JSON.stringify({
  schemaVersion: 2,
  activeProfileId: 'replacement',
  profiles: [
    {
      id: 'replacement',
      name: 'Imported learner',
      createdAt: '2026-08-19T00:00:00.000Z',
      mastery: {},
      mistakes: [],
      sessions: [],
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
});

function BackupImportHarness() {
  const { activeProfile, replaceFromBackup } = useAppState();
  const [result, setResult] = useState('not attempted');
  return (
    <>
      <output aria-label="Active profile">{activeProfile.name}</output>
      <output aria-label="Import result">{result}</output>
      <button
        type="button"
        onClick={() => setResult(replaceFromBackup(replacementBackup) ? 'imported' : 'failed')}
      >
        Replace from backup
      </button>
    </>
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

  it('enforces the profile capacity inside batched state updates', async () => {
    const profiles = Array.from({ length: 99 }, (_, index) => ({
      id: `profile-${index + 1}`,
      name: `Learner ${index + 1}`,
      createdAt: '2026-08-19T00:00:00.000Z',
      mastery: {},
      mistakes: [],
      sessions: [],
      masteredFactsGoal: null,
    }));
    localStorage.setItem(
      'tablespark.state.v1',
      JSON.stringify({
        schemaVersion: 2,
        activeProfileId: 'profile-1',
        profiles,
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
    render(
      <AppStateProvider>
        <ProfileCapacityHarness />
      </AppStateProvider>,
    );

    expect(screen.getByLabelText('Profile count')).toHaveTextContent('99');
    await user.click(screen.getByRole('button', { name: 'Add two profiles' }));
    expect(screen.getByLabelText('Profile count')).toHaveTextContent('100');

    await waitFor(() => {
      const raw = localStorage.getItem('tablespark.state.v1');
      const stored = JSON.parse(raw ?? '{}') as { profiles?: unknown[] };
      expect(stored.profiles).toHaveLength(100);
    });
  });

  it('keeps recovery disabled when browser storage cannot be read', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <AppStateProvider>
        <StorageStatusHarness />
      </AppStateProvider>,
    );

    expect(screen.getByLabelText('Storage status')).toHaveTextContent('saving unavailable');
    expect(screen.getByLabelText('Storage status')).toHaveTextContent('recovery not required');
    expect(screen.getByLabelText('Storage status')).toHaveTextContent('read unavailable');
    expect(setItem).not.toHaveBeenCalled();

    setItem.mockRestore();
    getItem.mockRestore();
  });

  it('commits a validated backup only after its replacement is saved successfully', async () => {
    const user = userEvent.setup();
    render(
      <AppStateProvider>
        <BackupImportHarness />
      </AppStateProvider>,
    );

    await waitFor(() => expect(localStorage.getItem('tablespark.state.v1')).not.toBeNull());
    await user.click(screen.getByRole('button', { name: 'Replace from backup' }));

    expect(screen.getByLabelText('Import result')).toHaveTextContent('imported');
    expect(screen.getByLabelText('Active profile')).toHaveTextContent('Imported learner');
    const stored = JSON.parse(localStorage.getItem('tablespark.state.v1') ?? '{}') as {
      activeProfileId?: string;
    };
    expect(stored.activeProfileId).toBe('replacement');
  });

  it('leaves current state unchanged when a backup replacement cannot be saved', async () => {
    const user = userEvent.setup();
    render(
      <AppStateProvider>
        <BackupImportHarness />
      </AppStateProvider>,
    );

    await waitFor(() => expect(localStorage.getItem('tablespark.state.v1')).not.toBeNull());
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    await user.click(screen.getByRole('button', { name: 'Replace from backup' }));

    expect(screen.getByLabelText('Import result')).toHaveTextContent('failed');
    expect(screen.getByLabelText('Active profile')).toHaveTextContent('Learner');
    setItem.mockRestore();
  });
});
