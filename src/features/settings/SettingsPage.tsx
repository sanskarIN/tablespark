import { useRef, useState, type ChangeEvent } from 'react';
import {
  MAX_MASTERED_FACTS_GOAL,
  SESSION_HISTORY_LIMIT_OPTIONS,
} from '../../domain/sessions';
import { useLocale } from '../../i18n/LocaleContext';
import { SUPPORTED_LOCALES, type Locale } from '../../i18n/localePreference';
import { canSpeak } from '../../infrastructure/speech';
import {
  exportState,
  MAX_BACKUP_BYTES,
  MAX_PROFILES,
  readRawState,
} from '../../infrastructure/storage';
import { useAppState } from '../../state/useAppState';

function boundedInteger(value: number, min: number, max: number, fallback: number): number {
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
}

function downloadText(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SettingsPage() {
  const {
    state,
    activeProfile,
    unreadableStoredState,
    storageReadUnavailable,
    setActiveProfile,
    addProfile,
    deleteProfile,
    updateSettings,
    setMasteredFactsGoal,
    replaceFromBackup,
    discardUnreadableState,
    resetProgress,
  } = useAppState();
  const { locale, setLocale, messages } = useLocale();
  const { copy, learning } = messages;
  const [newProfileName, setNewProfileName] = useState('');
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const profileLimitReached = state.profiles.length >= MAX_PROFILES;
  const speechAvailable = canSpeak();
  const exportBlocked = unreadableStoredState || storageReadUnavailable;

  const downloadBackup = () => {
    downloadText(
      exportState(state),
      `tablespark-backup-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json',
    );
    setMessage(copy.settings.backupExported);
  };

  const downloadUnreadableState = () => {
    const raw = readRawState();
    if (raw === null) {
      setMessage(copy.settings.unreadableUnavailable);
      return;
    }

    downloadText(
      raw,
      `tablespark-unreadable-recovery-${new Date().toISOString().slice(0, 10)}.txt`,
      'text/plain;charset=utf-8',
    );
    setMessage(copy.settings.unreadableDownloaded);
  };

  const discardUnreadable = () => {
    if (!window.confirm(copy.settings.confirmDiscardUnreadable)) return;
    if (discardUnreadableState()) {
      setMessage(copy.settings.unreadableDiscarded);
    } else {
      setMessage(copy.settings.unreadableDiscardFailed);
    }
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > MAX_BACKUP_BYTES) {
        setMessage(copy.settings.backupTooLarge);
        return;
      }
      const confirmed = window.confirm(copy.settings.confirmBackupImport);
      if (!confirmed) return;
      const imported = replaceFromBackup(await file.text());
      setMessage(imported ? copy.settings.backupImported : copy.settings.importFailedGeneric);
    } catch {
      setMessage(copy.settings.importFailedGeneric);
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
            Language / भाषा
            <select
              value={locale}
              aria-describedby="locale-help"
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {SUPPORTED_LOCALES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <p id="locale-help" className="help-text">
            Interface language / इंटरफ़ेस भाषा
          </p>
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

      <div className="panel settings-grid learning-records-panel">
        <div>
          <h3>{learning.settings.recordsHeading}</h3>
          <label>
            {learning.settings.historyRetention}
            <select
              value={state.settings.sessionHistoryLimit}
              aria-describedby="history-retention-help"
              onChange={(event) =>
                updateSettings({ sessionHistoryLimit: Number(event.target.value) })
              }
            >
              {SESSION_HISTORY_LIMIT_OPTIONS.map((limit) => (
                <option value={limit} key={limit}>
                  {learning.settings.historyOption(limit)}
                </option>
              ))}
            </select>
          </label>
          <p id="history-retention-help" className="help-text">
            {learning.settings.historyHelp}
          </p>
        </div>
        <div>
          <h3>{learning.settings.goalHeading}</h3>
          <label>
            {learning.settings.masteredFactsGoal}
            <input
              type="number"
              min={1}
              max={MAX_MASTERED_FACTS_GOAL}
              placeholder={learning.settings.goalPlaceholder}
              value={activeProfile.masteredFactsGoal ?? ''}
              aria-describedby="mastery-goal-help"
              onChange={(event) => {
                const value = event.currentTarget.valueAsNumber;
                setMasteredFactsGoal(Number.isNaN(value) ? null : value);
              }}
            />
          </label>
          <p id="mastery-goal-help" className="help-text">
            {learning.settings.goalHelp}
          </p>
          <button
            className="text-button"
            type="button"
            disabled={activeProfile.masteredFactsGoal === null}
            onClick={() => setMasteredFactsGoal(null)}
          >
            {learning.settings.clearGoal}
          </button>
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

        {storageReadUnavailable ? (
          <p id="storage-read-note" className="help-text">
            {copy.status.storageBody}
          </p>
        ) : null}

        {unreadableStoredState ? (
          <div className="recovery-panel" id="recovery-note">
            <h4>{copy.settings.recoveryTitle}</h4>
            <p>{copy.settings.recoveryBody}</p>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={downloadUnreadableState}>
                {copy.settings.downloadUnreadable}
              </button>
              <button className="text-button danger" type="button" onClick={discardUnreadable}>
                {copy.settings.discardUnreadable}
              </button>
            </div>
          </div>
        ) : null}

        <div className="button-row">
          <button
            className="secondary-button"
            type="button"
            disabled={exportBlocked}
            aria-describedby={
              unreadableStoredState
                ? 'recovery-note'
                : storageReadUnavailable
                  ? 'storage-read-note'
                  : undefined
            }
            onClick={downloadBackup}
          >
            {copy.settings.exportBackup}
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={storageReadUnavailable}
            aria-describedby={storageReadUnavailable ? 'storage-read-note' : undefined}
            onClick={() => fileInput.current?.click()}
          >
            {copy.settings.importBackup}
          </button>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            disabled={storageReadUnavailable}
            aria-label={copy.settings.importBackup}
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
