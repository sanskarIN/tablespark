import { useRef, useState, type ChangeEvent } from 'react';
import {
  exportState,
  MAX_BACKUP_BYTES,
  MAX_PROFILES,
} from '../../infrastructure/storage';
import { useAppState } from '../../state/useAppState';

function boundedInteger(value: number, min: number, max: number, fallback: number): number {
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
}

export function SettingsPage() {
  const {
    state,
    activeProfile,
    setActiveProfile,
    addProfile,
    deleteProfile,
    updateSettings,
    replaceFromBackup,
    resetProgress,
  } = useAppState();
  const [newProfileName, setNewProfileName] = useState('');
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const profileLimitReached = state.profiles.length >= MAX_PROFILES;

  const downloadBackup = () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `tablespark-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Backup exported.');
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Backup file is too large.');
      const confirmed = window.confirm(
        'Importing this backup will replace all current TableSpark profiles, progress, and settings. Continue?',
      );
      if (!confirmed) return;
      replaceFromBackup(await file.text());
      setMessage('Backup imported successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? `Import failed: ${error.message}` : 'Import failed.');
    } finally {
      event.target.value = '';
    }
  };

  const confirmProfileDelete = (id: string, name: string) => {
    const confirmed = window.confirm(
      `Delete the offline profile “${name}” and its local progress? This cannot be undone.`,
    );
    if (confirmed) deleteProfile(id);
  };

  return (
    <section className="page-stack" aria-labelledby="settings-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Personalize</p>
          <h2 id="settings-title">Settings</h2>
          <p>Your preferences and learning data stay in this browser unless you export them.</p>
        </div>
      </div>

      <div className="panel settings-grid">
        <div>
          <h3>Appearance & accessibility</h3>
          <label>
            Theme
            <select
              value={state.settings.theme}
              onChange={(event) =>
                updateSettings({
                  theme: event.target.value as 'system' | 'light' | 'dark',
                })
              }
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={state.settings.largeText}
              onChange={(event) => updateSettings({ largeText: event.target.checked })}
            />
            Large-text classroom mode
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={state.settings.reducedMotion}
              onChange={(event) => updateSettings({ reducedMotion: event.target.checked })}
            />
            Reduce motion
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={state.settings.speechEnabled}
              onChange={(event) => updateSettings({ speechEnabled: event.target.checked })}
            />
            Text-to-speech controls
          </label>
        </div>
        <div>
          <h3>Practice defaults</h3>
          <label>
            Default questions
            <input
              type="number"
              min={1}
              max={200}
              value={state.settings.defaultQuestionCount}
              onChange={(event) =>
                updateSettings({
                  defaultQuestionCount: boundedInteger(
                    event.currentTarget.valueAsNumber,
                    1,
                    200,
                    state.settings.defaultQuestionCount,
                  ),
                })
              }
            />
          </label>
          <label>
            Timed drill seconds
            <input
              type="number"
              min={10}
              max={3600}
              value={state.settings.defaultTimeLimitSeconds}
              onChange={(event) =>
                updateSettings({
                  defaultTimeLimitSeconds: boundedInteger(
                    event.currentTarget.valueAsNumber,
                    10,
                    3600,
                    state.settings.defaultTimeLimitSeconds,
                  ),
                })
              }
            />
          </label>
        </div>
      </div>

      <div className="panel">
        <h3>Offline profiles</h3>
        <p id="profile-capacity">
          {state.profiles.length} of {MAX_PROFILES} local profiles in use.
        </p>
        <div className="profile-list">
          {state.profiles.map((profile) => (
            <div className="profile-row" key={profile.id}>
              <button
                type="button"
                className={
                  profile.id === activeProfile.id ? 'profile-button active' : 'profile-button'
                }
                onClick={() => setActiveProfile(profile.id)}
              >
                {profile.name}
              </button>
              <button
                type="button"
                className="text-button danger"
                disabled={state.profiles.length === 1}
                onClick={() => confirmProfileDelete(profile.id, profile.name)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <form
          className="inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (profileLimitReached) {
              setMessage(`Profile limit reached. Delete a profile before adding another.`);
              return;
            }
            addProfile(newProfileName);
            setNewProfileName('');
          }}
        >
          <label>
            New profile name
            <input
              maxLength={40}
              value={newProfileName}
              disabled={profileLimitReached}
              aria-describedby="profile-capacity"
              onChange={(event) => setNewProfileName(event.target.value)}
            />
          </label>
          <button className="secondary-button" type="submit" disabled={profileLimitReached}>
            Add profile
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Data & privacy</h3>
        <p>
          Backups contain local profile names, mastery statistics, and recent practice mistakes.
          Review the JSON before sharing it.
        </p>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={downloadBackup}>
            Export backup
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            Import backup
          </button>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void importBackup(event)}
          />
          <button
            className="text-button danger"
            type="button"
            onClick={() => {
              if (window.confirm('Reset progress for the active profile?')) {
                resetProgress();
                setMessage('Progress reset.');
              }
            }}
          >
            Reset active progress
          </button>
        </div>
      </div>

      <div className="panel prose-panel">
        <h3>Updates & about</h3>
        <p>
          TableSpark uses an auto-updating Progressive Web App service worker in production.
          Browser update timing can vary, so reopen the app if a newly deployed version is waiting.
        </p>
        <p>
          Version 0.1.0 · MIT License · Made by the Sanskar. Full project, support, privacy, and
          funding details are available on the About page.
        </p>
      </div>

      {message ? (
        <div className="status" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}
    </section>
  );
}
