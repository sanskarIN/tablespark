export type ThemePreference = 'system' | 'light' | 'dark';
export type DrillMode = 'timed' | 'untimed';
export type PracticeSessionKind = 'generated' | 'mistake-review';

export interface TableConfig {
  readonly from: number;
  readonly to: number;
  readonly multiplierFrom: number;
  readonly multiplierTo: number;
  readonly step: number;
}

export interface TableRow {
  readonly multiplicand: number;
  readonly multiplier: number;
  readonly product: number;
}

export interface Question {
  readonly id: string;
  readonly left: number;
  readonly right: number;
  readonly answer: number;
}

export interface Attempt {
  readonly question: Question;
  readonly response: number | null;
  readonly correct: boolean;
  readonly answeredAt: string;
  readonly elapsedMs: number;
}

export interface MasteryStat {
  readonly key: string;
  readonly attempts: number;
  readonly correct: number;
  readonly streak: number;
  readonly lastAttemptAt: string;
}

export interface SessionSummary {
  readonly id: string;
  readonly kind: PracticeSessionKind;
  readonly mode: DrillMode;
  readonly completedAt: string;
  readonly questionCount: number;
  readonly correctCount: number;
  readonly elapsedMs: number;
  readonly seed: number | null;
}

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly mastery: Record<string, MasteryStat>;
  readonly mistakes: Attempt[];
  readonly sessions: SessionSummary[];
  readonly masteredFactsGoal: number | null;
}

export interface AppSettings {
  readonly theme: ThemePreference;
  readonly largeText: boolean;
  readonly reducedMotion: boolean;
  readonly speechEnabled: boolean;
  readonly defaultQuestionCount: number;
  readonly defaultTimeLimitSeconds: number;
  readonly sessionHistoryLimit: number;
}

export interface PersistedState {
  readonly schemaVersion: 2;
  readonly activeProfileId: string;
  readonly profiles: Profile[];
  readonly settings: AppSettings;
}
