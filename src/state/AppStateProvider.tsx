import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { applyAttempt } from '../domain/mastery';
import type { AppSettings, PersistedState, Profile } from '../domain/types';
import {
  importState as parseImportedState,
  loadState,
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
};

function makeProfile(name = 'Learner'): Profile {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    mastery: {},
    mistakes: [],
  };
}

function makeDefaultState(): PersistedState {
  const profile = makeProfile();
  return {
    schemaVersion: 1,
    activeProfileId: profile.id,
    profiles: [profile],
    settings: defaultSettings,
  };
}

export function AppStateProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState() ?? makeDefaultState());
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);

  useEffect(() => {
    setPersistenceAvailable(saveState(state));
  }, [state]);

  const activeProfile =
    state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
  if (!activeProfile) throw new Error('TableSpark requires at least one profile.');

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      activeProfile,
      persistenceAvailable,
      setActiveProfile: (id) => {
        if (state.profiles.some((profile) => profile.id === id)) {
          setState((current) => ({ ...current, activeProfileId: id }));
        }
      },
      addProfile: (name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed || state.profiles.length >= MAX_PROFILES) return;
        const profile = makeProfile(trimmed);
        setState((current) => ({
          ...current,
          profiles: [...current.profiles, profile],
          activeProfileId: profile.id,
        }));
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
        setState((current) => ({
          ...current,
          settings: { ...current.settings, ...settings },
        })),
      recordAttempt: (attempt) =>
        setState((current) => ({
          ...current,
          profiles: current.profiles.map((profile) =>
            profile.id === current.activeProfileId ? applyAttempt(profile, attempt) : profile,
          ),
        })),
      replaceFromBackup: (raw) => setState(parseImportedState(raw)),
      resetProgress: () =>
        setState((current) => ({
          ...current,
          profiles: current.profiles.map((profile) =>
            profile.id === current.activeProfileId
              ? { ...profile, mastery: {}, mistakes: [] }
              : profile,
          ),
        })),
    }),
    [activeProfile, persistenceAvailable, state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
