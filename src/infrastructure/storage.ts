import { z } from 'zod';
import type { PersistedState } from '../domain/types';

const STORAGE_KEY = 'tablespark.state.v1';

const masteryStatSchema = z.object({
  key: z.string(),
  attempts: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  streak: z.number().int().nonnegative(),
  lastAttemptAt: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  left: z.number().int(),
  right: z.number().int(),
  answer: z.number().int(),
});

const attemptSchema = z.object({
  question: questionSchema,
  response: z.number().int().nullable(),
  correct: z.boolean(),
  answeredAt: z.string(),
  elapsedMs: z.number().nonnegative(),
});

const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(40),
  createdAt: z.string(),
  mastery: z.record(z.string(), masteryStatSchema),
  mistakes: z.array(attemptSchema).max(100),
});

const persistedStateSchema = z.object({
  schemaVersion: z.literal(1),
  activeProfileId: z.string(),
  profiles: z.array(profileSchema).min(1),
  settings: z.object({
    theme: z.enum(['system', 'light', 'dark']),
    largeText: z.boolean(),
    reducedMotion: z.boolean(),
    soundEnabled: z.boolean(),
    speechEnabled: z.boolean(),
    defaultQuestionCount: z.number().int().min(1).max(200),
    defaultTimeLimitSeconds: z.number().int().min(10).max(3600),
  }),
});

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? (parsed.data as PersistedState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportState(state: PersistedState): string {
  return JSON.stringify(state, null, 2);
}

export function importState(raw: string): PersistedState {
  const parsed = persistedStateSchema.parse(JSON.parse(raw));
  return parsed as PersistedState;
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
