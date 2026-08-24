import { describe, expect, it } from 'vitest';
import type { SessionSummary } from './types';
import {
  isSessionHistoryLimit,
  prependSession,
  retainSessions,
  SESSION_HISTORY_LIMIT_OPTIONS,
} from './sessions';

function session(index: number): SessionSummary {
  return {
    id: `session-${index}`,
    kind: 'generated',
    mode: 'untimed',
    completedAt: `2026-08-19T00:00:${String(index).padStart(2, '0')}.000Z`,
    questionCount: 10,
    correctCount: 8,
    elapsedMs: 10_000,
    seed: index,
  };
}

describe('session history retention', () => {
  it('recognizes only supported retention options', () => {
    for (const option of SESSION_HISTORY_LIMIT_OPTIONS) {
      expect(isSessionHistoryLimit(option)).toBe(true);
    }
    expect(isSessionHistoryLimit(0)).toBe(false);
    expect(isSessionHistoryLimit(11)).toBe(false);
    expect(isSessionHistoryLimit(101)).toBe(false);
  });

  it('prepends the latest summary and enforces the selected limit', () => {
    const existing = Array.from({ length: 25 }, (_, index) => session(index + 1));
    const latest = session(0);
    const result = prependSession(existing, latest, 10);

    expect(result).toHaveLength(10);
    expect(result[0]).toEqual(latest);
    expect(result.at(-1)?.id).toBe('session-9');
  });

  it('trims an existing history when retention is reduced', () => {
    const existing = Array.from({ length: 30 }, (_, index) => session(index));
    expect(retainSessions(existing, 25)).toEqual(existing.slice(0, 25));
  });
});
