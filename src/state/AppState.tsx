import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { applyAttempt } from '../domain/mastery';
import type { AppSettings, Attempt, PersistedState, Profile } from '../domain/types';
import {
  importState as parseImportedState,
  loadState,
  saveState,
} from '../infrastructure/storage';

interface AppStateValue {
  readonly state: PersistedState;
  readonly activeProfile: Profile;
  readonly setActiveProfile: (id: string) => void;
  readonly addProfile: (name: string) => void;
  readonly deleteProfile: (id: string) => void;
  readonly updateSettings: (settings: Partial<AppSettings>) => void;
  readonly recordAttempt: (attempt: Attempt) => void;
  readonly replaceFromBackup: (raw: string) => void;
  readonly resetProgress: () => void;
}

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

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState() ?? makeDefaultState());

  useEffect(() => saveState(state), [state]);

  const activeProfile =
    state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
  if (!activeProfile) throw new Error('TableSpark requires at least one profile.');

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      activeProfile,
      setActiveProfile: (id) => {
        if (state.profiles.some((profile) => profile.id === id)) {
          setState((current) => ({ ...current, activeProfileId: id }));
        }
      },
      addProfile: (name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed) return;
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
    [activeProfile, state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider.');
  return value;
}
