import { z } from 'zod';
import type { PersistedState } from '../domain/types';
import { logger } from './logger';
import { migratePersistedState } from './migrations';

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

const persistedStateSchema = z
  .object({
    schemaVersion: z.literal(1),
    activeProfileId: z.string(),
    profiles: z.array(profileSchema).min(1),
    settings: z.object({
      theme: z.enum(['system', 'light', 'dark']),
      largeText: z.boolean(),
      reducedMotion: z.boolean(),
      speechEnabled: z.boolean(),
      defaultQuestionCount: z.number().int().min(1).max(200),
      defaultTimeLimitSeconds: z.number().int().min(10).max(3600),
    }),
  })
  .superRefine((value, context) => {
    if (!value.profiles.some((profile) => profile.id === value.activeProfileId)) {
      context.addIssue({
        code: 'custom',
        path: ['activeProfileId'],
        message: 'Active profile must exist.',
      });
    }
  });

function parseState(raw: string): PersistedState {
  const json: unknown = JSON.parse(raw);
  const migrated = migratePersistedState(json);
  return persistedStateSchema.parse(migrated) as PersistedState;
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseState(raw) : null;
  } catch {
    logger.warn('storage_read_failed');
    return null;
  }
}

export function saveState(state: PersistedState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    logger.warn('storage_write_failed');
    return false;
  }
}

export function exportState(state: PersistedState): string {
  return JSON.stringify(state, null, 2);
}

export function importState(raw: string): PersistedState {
  return parseState(raw);
}

export function clearState(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    logger.warn('storage_clear_failed');
    return false;
  }
}
