import { createContext } from 'react';
import type {
  AppSettings,
  Attempt,
  PersistedState,
  Profile,
  SessionSummary,
} from '../domain/types';

export interface AppStateValue {
  readonly state: PersistedState;
  readonly activeProfile: Profile;
  readonly persistenceAvailable: boolean;
  readonly unreadableStoredState: boolean;
  readonly storageReadUnavailable: boolean;
  readonly setActiveProfile: (id: string) => void;
  readonly addProfile: (name: string) => void;
  readonly deleteProfile: (id: string) => void;
  readonly updateSettings: (settings: Partial<AppSettings>) => void;
  readonly recordAttempt: (attempt: Attempt) => void;
  readonly recordSession: (summary: SessionSummary) => void;
  readonly setMasteredFactsGoal: (goal: number | null) => void;
  readonly replaceFromBackup: (raw: string) => boolean;
  readonly discardUnreadableState: () => boolean;
  readonly resetProgress: () => void;
}

export const AppStateContext = createContext<AppStateValue | null>(null);
