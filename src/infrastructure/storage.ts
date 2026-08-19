import { z } from 'zod';
import type { PersistedState } from '../domain/types';
import { logger } from './logger';
import { migratePersistedState } from './migrations';

const STORAGE_KEY = 'tablespark.state.v1';
export const MAX_BACKUP_BYTES = 2_000_000;
const MAX_PROFILES = 100;
const MAX_MASTERY_FACTS_PER_PROFILE = 10_000;

const masteryStatSchema = z
  .object({
    key: z.string().min(1).max(32),
    attempts: z.number().int().nonnegative(),
    correct: z.number().int().nonnegative(),
    streak: z.number().int().nonnegative(),
    lastAttemptAt: z.string().max(64),
  })
  .superRefine((value, context) => {
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
    const masteryEntries = Object.entries(value.mastery);
    if (masteryEntries.length > MAX_MASTERY_FACTS_PER_PROFILE) {
      context.addIssue({
        code: 'custom',
        path: ['mastery'],
        message: `A profile cannot contain more than ${MAX_MASTERY_FACTS_PER_PROFILE} mastery facts.`,
      });
    }
    for (const [key, stat] of masteryEntries) {
      if (stat.key !== key) {
        context.addIssue({
          code: 'custom',
          path: ['mastery', key, 'key'],
          message: 'Mastery record key must match its object key.',
        });
      }
    }
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

function parseState(raw: string): PersistedState {
  if (rawByteLength(raw) > MAX_BACKUP_BYTES) {
    throw new RangeError(`Backup data cannot exceed ${MAX_BACKUP_BYTES} bytes.`);
  }
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
