import type { SessionSummary } from './types';

export const SESSION_HISTORY_LIMIT_OPTIONS = [10, 25, 50, 100] as const;
export type SessionHistoryLimit = (typeof SESSION_HISTORY_LIMIT_OPTIONS)[number];
export const DEFAULT_SESSION_HISTORY_LIMIT: SessionHistoryLimit = 25;
export const MAX_SESSION_HISTORY = 100;
export const MAX_MASTERED_FACTS_GOAL = 10_000;

export function isSessionHistoryLimit(value: number): value is SessionHistoryLimit {
  return SESSION_HISTORY_LIMIT_OPTIONS.includes(value as SessionHistoryLimit);
}

export function retainSessions(
  sessions: readonly SessionSummary[],
  limit: SessionHistoryLimit,
): SessionSummary[] {
  return sessions.slice(0, limit);
}

export function prependSession(
  sessions: readonly SessionSummary[],
  summary: SessionSummary,
  limit: SessionHistoryLimit,
): SessionSummary[] {
  return [summary, ...sessions].slice(0, limit);
}
