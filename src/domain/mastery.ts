import { masteryKey } from './questions';
import type { Attempt, MasteryStat, Profile } from './types';

const MAX_MISTAKES = 100;

export function applyAttempt(profile: Profile, attempt: Attempt): Profile {
  const key = masteryKey(attempt.question.left, attempt.question.right);
  const previous: MasteryStat = profile.mastery[key] ?? {
    key,
    attempts: 0,
    correct: 0,
    streak: 0,
    lastAttemptAt: attempt.answeredAt,
  };

  const nextStat: MasteryStat = {
    key,
    attempts: previous.attempts + 1,
    correct: previous.correct + (attempt.correct ? 1 : 0),
    streak: attempt.correct ? previous.streak + 1 : 0,
    lastAttemptAt: attempt.answeredAt,
  };

  const mistakes = attempt.correct ? profile.mistakes : [attempt, ...profile.mistakes].slice(0, MAX_MISTAKES);
  return { ...profile, mastery: { ...profile.mastery, [key]: nextStat }, mistakes };
}

export function masteryPercent(stat: MasteryStat): number {
  if (stat.attempts === 0) return 0;
  return Math.round((stat.correct / stat.attempts) * 100);
}

export function profileAccuracy(profile: Profile): number {
  const stats = Object.values(profile.mastery);
  const attempts = stats.reduce((sum, stat) => sum + stat.attempts, 0);
  if (attempts === 0) return 0;
  const correct = stats.reduce((sum, stat) => sum + stat.correct, 0);
  return Math.round((correct / attempts) * 100);
}
