import { z } from 'zod';
import { masteryKey } from '../domain/questions';
import type { PersistedState } from '../domain/types';
import { logger } from './logger';
import { migratePersistedState } from './migrations';

const STORAGE_KEY = 'tablespark.state.v1';
export const MAX_BACKUP_BYTES = 2_000_000;
export const MAX_PROFILES = 100;

export type StateLoadResult =
  | { readonly status: 'empty'; readonly state: null }
  | { readonly status: 'loaded'; readonly state: PersistedState }
  | { readonly status: 'invalid'; readonly state: null };

function isCanonicalMasteryKey(key: string): boolean {
  const match = /^(\d{1,4})x(\d{1,4})$/.exec(key);
  if (!match) return false;
  const left = Number(match[1]);
  const right = Number(match[2]);
  return left <= 1000 && right <= 1000 && masteryKey(left, right) === key;
}

const masteryStatSchema = z
  .object({
    key: z.string().min(1).max(32),
    attempts: z.number().int().nonnegative(),
    correct: z.number().int().nonnegative(),
    streak: z.number().int().nonnegative(),
    lastAttemptAt: z.string().max(64),
  })
  .superRefine((value, context) => {
    if (!isCanonicalMasteryKey(value.key)) {
      context.addIssue({
        code: 'custom',
        path: ['key'],
        message: 'Mastery key must be a canonical multiplication fact.',
      });
    }
    if (value.correct > value.attempts) {
      context.addIssue({
        code: 'custom',
        path: ['correct'],
        message: 'Correct answers cannot exceed attempts.',
      });
    }
    if (value.streak > value.correct || value.streak > value.attempts) {
      context.addIssue({
        code: 'custom',
        path: ['streak'],
        message: 'Streak cannot exceed correct answers or attempts.',
      });
    }
  });

const questionSchema = z
  .object({
    id: z.string().min(1).max(200),
    left: z.number().int().min(0).max(1000),
    right: z.number().int().min(0).max(1000),
    answer: z.number().int().min(0).max(1_000_000),
  })
  .superRefine((value, context) => {
    if (value.answer !== value.left * value.right) {
      context.addIssue({
        code: 'custom',
        path: ['answer'],
        message: 'Question answer must match its operands.',
      });
    }
  });

const attemptSchema = z
  .object({
    question: questionSchema,
    response: z.number().int().nullable(),
    correct: z.boolean(),
    answeredAt: z.string().max(64),
    elapsedMs: z.number().finite().nonnegative(),
  })
  .superRefine((value, context) => {
    const responseMatches = value.response === value.question.answer;
    if (value.correct !== responseMatches) {
      context.addIssue({
        code: 'custom',
        path: ['correct'],
        message: 'Attempt correctness must match the recorded response.',
      });
    }
  });

const profileSchema = z
  .object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(40),
    createdAt: z.string().max(64),
    mastery: z.record(z.string(), masteryStatSchema),
    mistakes: z.array(attemptSchema).max(100),
  })
  .superRefine((value, context) => {
    for (const [key, stat] of Object.entries(value.mastery)) {
      if (stat.key !== key) {
        context.addIssue({
          code: 'custom',
          path: ['mastery', key, 'key'],
          message: 'Mastery record key must match its object key.',
        });
      }
    }

    value.mistakes.forEach((attempt, index) => {
      if (attempt.correct) {
        context.addIssue({
          code: 'custom',
          path: ['mistakes', index, 'correct'],
          message: 'Saved mistake history cannot contain correct attempts.',
        });
      }
    });
  });

const persistedStateSchema = z
  .object({
    schemaVersion: z.literal(1),
    activeProfileId: z.string().min(1).max(100),
    profiles: z.array(profileSchema).min(1).max(MAX_PROFILES),
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

    const profileIds = new Set<string>();
    value.profiles.forEach((profile, index) => {
      if (profileIds.has(profile.id)) {
        context.addIssue({
          code: 'custom',
          path: ['profiles', index, 'id'],
          message: 'Profile IDs must be unique.',
        });
      }
      profileIds.add(profile.id);
    });
  });

function rawByteLength(raw: string): number {
  return new TextEncoder().encode(raw).byteLength;
}

function assertWithinStorageBudget(raw: string): void {
  if (rawByteLength(raw) > MAX_BACKUP_BYTES) {
    throw new RangeError(`Backup data cannot exceed ${MAX_BACKUP_BYTES} bytes.`);
  }
}

function parseState(raw: string): PersistedState {
  assertWithinStorageBudget(raw);
  const json: unknown = JSON.parse(raw);
  const migrated = migratePersistedState(json);
  return persistedStateSchema.parse(migrated) as PersistedState;
}

export function loadStateResult(): StateLoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { status: 'empty', state: null };
    return { status: 'loaded', state: parseState(raw) };
  } catch {
    logger.warn('storage_read_failed');
    return { status: 'invalid', state: null };
  }
}

export function loadState(): PersistedState | null {
  return loadStateResult().state;
}

export function readRawState(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    logger.warn('storage_raw_read_failed');
    return null;
  }
}

export function saveState(state: PersistedState): boolean {
  try {
    const raw = JSON.stringify(state);
    assertWithinStorageBudget(raw);
    localStorage.setItem(STORAGE_KEY, raw);
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
