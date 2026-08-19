import { useRef, useState, type ChangeEvent } from 'react';
import { copy } from '../../i18n/en';
import { canSpeak } from '../../infrastructure/speech';
import { exportState, MAX_BACKUP_BYTES, MAX_PROFILES } from '../../infrastructure/storage';
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
  const speechAvailable = canSpeak();

  const downloadBackup = () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `tablespark-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(copy.settings.backupExported);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error(copy.settings.backupTooLarge);
      const confirmed = window.confirm(copy.settings.confirmBackupImport);
      if (!confirmed) return;
      replaceFromBackup(await file.text());
      setMessage(copy.settings.backupImported);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? copy.settings.importFailed(error.message)
          : copy.settings.importFailedGeneric,
      );
    } finally {
      event.target.value = '';
    }
  };

  const confirmProfileDelete = (id: string, name: string) => {
    const confirmed = window.confirm(copy.settings.confirmDeleteProfile(name));
    if (confirmed) deleteProfile(id);
  };

  return (
    <section className="page-stack" aria-labelledby="settings-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">{copy.settings.eyebrow}</p>
          <h2 id="settings-title">{copy.settings.title}</h2>
          <p>{copy.settings.description}</p>
        </div>
      </div>

      <div className="panel settings-grid">
        <div>
          <h3>{copy.settings.appearanceAccessibility}</h3>
          <label>
            {copy.settings.theme}
            <select
              value={state.settings.theme}
              onChange={(event) =>
                updateSettings({
                  theme: event.target.value as 'system' | 'light' | 'dark',
                })
              }
            >
              <option value="system">{copy.settings.systemTheme}</option>
              <option value="light">{copy.settings.lightTheme}</option>
              <option value="dark">{copy.settings.darkTheme}</option>
            </select>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={state.settings.largeText}
              onChange={(event) => updateSettings({ largeText: event.target.checked })}
            />
            {copy.settings.largeText}
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={state.settings.reducedMotion}
              onChange={(event) => updateSettings({ reducedMotion: event.target.checked })}
            />
            {copy.settings.reducedMotion}
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={state.settings.speechEnabled && speechAvailable}
              disabled={!speechAvailable}
              aria-describedby={!speechAvailable ? 'speech-support-note' : undefined}
              onChange={(event) => updateSettings({ speechEnabled: event.target.checked })}
            />
            {copy.settings.speech}
          </label>
          {!speechAvailable ? (
            <p id="speech-support-note" className="help-text">
              {copy.settings.speechUnavailable}
            </p>
          ) : null}
        </div>
        <div>
          <h3>{copy.settings.practiceDefaults}</h3>
          <label>
            {copy.settings.defaultQuestions}
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
            {copy.settings.timedSeconds}
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
        <h3>{copy.settings.profiles}</h3>
        <p id="profile-capacity">
          {copy.settings.profileCapacity(state.profiles.length, MAX_PROFILES)}
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
                {copy.settings.delete}
              </button>
            </div>
          ))}
        </div>
        <form
          className="inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (profileLimitReached) {
              setMessage(copy.settings.profileLimit);
              return;
            }
            addProfile(newProfileName);
            setNewProfileName('');
          }}
        >
          <label>
            {copy.settings.newProfileName}
            <input
              maxLength={40}
              value={newProfileName}
              disabled={profileLimitReached}
              aria-describedby="profile-capacity"
              onChange={(event) => setNewProfileName(event.target.value)}
            />
          </label>
          <button className="secondary-button" type="submit" disabled={profileLimitReached}>
            {copy.settings.addProfile}
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>{copy.settings.dataPrivacy}</h3>
        <p>{copy.settings.backupNotice}</p>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={downloadBackup}>
            {copy.settings.exportBackup}
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            {copy.settings.importBackup}
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
              if (window.confirm(copy.settings.confirmReset)) {
                resetProgress();
                setMessage(copy.settings.progressReset);
              }
            }}
          >
            {copy.settings.resetProgress}
          </button>
        </div>
      </div>

      <div className="panel prose-panel">
        <h3>{copy.settings.updatesAbout}</h3>
        <p>{copy.settings.updateNotice}</p>
        <p>{copy.settings.versionSummary}</p>
      </div>

      {message ? (
        <div className="status" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}
    </section>
  );
}
