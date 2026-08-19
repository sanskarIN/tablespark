import { createContext } from 'react';
import type { AppSettings, Attempt, PersistedState, Profile } from '../domain/types';

export interface AppStateValue {
  readonly state: PersistedState;
  readonly activeProfile: Profile;
  readonly persistenceAvailable: boolean;
  readonly setActiveProfile: (id: string) => void;
  readonly addProfile: (name: string) => void;
  readonly deleteProfile: (id: string) => void;
  readonly updateSettings: (settings: Partial<AppSettings>) => void;
  readonly recordAttempt: (attempt: Attempt) => void;
  readonly replaceFromBackup: (raw: string) => void;
  readonly resetProgress: () => void;
}

export const AppStateContext = createContext<AppStateValue | null>(null);
