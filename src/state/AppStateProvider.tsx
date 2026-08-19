import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { applyAttempt } from '../domain/mastery';
import {
  DEFAULT_SESSION_HISTORY_LIMIT,
  isSessionHistoryLimit,
  MAX_MASTERED_FACTS_GOAL,
  prependSession,
  retainSessions,
} from '../domain/sessions';
import type { AppSettings, PersistedState, Profile } from '../domain/types';
import {
  clearState,
  importState as parseImportedState,
  loadStateResult,
  MAX_PROFILES,
  saveState,
} from '../infrastructure/storage';
import { AppStateContext, type AppStateValue } from './AppStateContext';

const defaultSettings: AppSettings = {
  theme: 'system',
  largeText: false,
  reducedMotion: false,
  speechEnabled: false,
  defaultQuestionCount: 10,
  defaultTimeLimitSeconds: 60,
  sessionHistoryLimit: DEFAULT_SESSION_HISTORY_LIMIT,
};

function makeProfile(name = 'Learner'): Profile {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    mastery: {},
    mistakes: [],
    sessions: [],
    masteredFactsGoal: null,
  };
}

function makeDefaultState(): PersistedState {
  const profile = makeProfile();
  return {
    schemaVersion: 2,
    activeProfileId: profile.id,
    profiles: [profile],
    settings: defaultSettings,
  };
}

export function AppStateProvider({ children }: { readonly children: ReactNode }) {
  const [initialLoad] = useState(() => loadStateResult());
  const [state, setState] = useState<PersistedState>(() => initialLoad.state ?? makeDefaultState());
  const [unreadableStoredState, setUnreadableStoredState] = useState(
    initialLoad.status === 'invalid',
  );
  const [storageReadUnavailable] = useState(initialLoad.status === 'unavailable');
  const [persistenceAvailable, setPersistenceAvailable] = useState(
    initialLoad.status === 'empty' || initialLoad.status === 'loaded',
  );

  useEffect(() => {
    if (unreadableStoredState || storageReadUnavailable) {
      setPersistenceAvailable(false);
      return;
    }
    setPersistenceAvailable(saveState(state));
  }, [state, storageReadUnavailable, unreadableStoredState]);

  const activeProfile =
    state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
  if (!activeProfile) throw new Error('TableSpark requires at least one profile.');

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      activeProfile,
      persistenceAvailable,
      unreadableStoredState,
      setActiveProfile: (id) => {
        if (state.profiles.some((profile) => profile.id === id)) {
          setState((current) => ({ ...current, activeProfileId: id }));
        }
      },
      addProfile: (name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed) return;
        setState((current) => {
          if (current.profiles.length >= MAX_PROFILES) return current;
          const profile = makeProfile(trimmed);
          return {
            ...current,
            profiles: [...current.profiles, profile],
            activeProfileId: profile.id,
          };
        });
      },
      deleteProfile: (id) => {
        setState((current) => {
          if (current.profiles.length === 1) return current;
          const profiles = current.profiles.filter((profile) => profile.id !== id);
          const activeProfileId =
            current.activeProfileId === id
              ? (profiles[0]?.id ?? current.activeProfileId)
              : current.activeProfileId;
          return { ...current, profiles, activeProfileId };
        });
      },
      updateSettings: (settings) =>
        setState((current) => {
          const requestedHistoryLimit = settings.sessionHistoryLimit;
          const sessionHistoryLimit =
            requestedHistoryLimit === undefined
              ? current.settings.sessionHistoryLimit
              : isSessionHistoryLimit(requestedHistoryLimit)
                ? requestedHistoryLimit
                : current.settings.sessionHistoryLimit;
          const nextSettings = {
            ...current.settings,
            ...settings,
            sessionHistoryLimit,
          };
          const profiles = isSessionHistoryLimit(sessionHistoryLimit)
            ? current.profiles.map((profile) => ({
                ...profile,
                sessions: retainSessions(profile.sessions, sessionHistoryLimit),
              }))
            : current.profiles;
          return { ...current, settings: nextSettings, profiles };
        }),
      recordAttempt: (attempt) =>
        setState((current) => ({
          ...current,
          profiles: current.profiles.map((profile) =>
            profile.id === current.activeProfileId ? applyAttempt(profile, attempt) : profile,
          ),
        })),
      recordSession: (summary) =>
        setState((current) => {
          const limit = isSessionHistoryLimit(current.settings.sessionHistoryLimit)
            ? current.settings.sessionHistoryLimit
            : DEFAULT_SESSION_HISTORY_LIMIT;
          return {
            ...current,
            profiles: current.profiles.map((profile) =>
              profile.id === current.activeProfileId
                ? { ...profile, sessions: prependSession(profile.sessions, summary, limit) }
                : profile,
            ),
          };
        }),
      setMasteredFactsGoal: (goal) => {
        if (
          goal !== null &&
          (!Number.isInteger(goal) || goal < 1 || goal > MAX_MASTERED_FACTS_GOAL)
        ) {
          return;
        }
        setState((current) => ({
          ...current,
          profiles: current.profiles.map((profile) =>
            profile.id === current.activeProfileId
              ? { ...profile, masteredFactsGoal: goal }
              : profile,
          ),
        }));
      },
      replaceFromBackup: (raw) => {
        const replacement = parseImportedState(raw);
        setState(replacement);
        setUnreadableStoredState(false);
      },
      discardUnreadableState: () => {
        if (!unreadableStoredState) return true;
        const cleared = clearState();
        if (cleared) setUnreadableStoredState(false);
        return cleared;
      },
      resetProgress: () =>
        setState((current) => ({
          ...current,
          profiles: current.profiles.map((profile) =>
            profile.id === current.activeProfileId
              ? { ...profile, mastery: {}, mistakes: [], sessions: [] }
              : profile,
          ),
        })),
    }),
    [activeProfile, persistenceAvailable, state, unreadableStoredState],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
