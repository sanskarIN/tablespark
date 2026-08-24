import { describe, expect, it } from 'vitest';
import { applyAttempt, masteryPercent, profileAccuracy } from './mastery';
import type { Attempt, Profile } from './types';

const profile: Profile = {
  id: 'p1',
  name: 'Learner',
  createdAt: '2026-08-19T00:00:00.000Z',
  mastery: {},
  mistakes: [],
  sessions: [],
  masteredFactsGoal: null,
};

function attempt(correct: boolean): Attempt {
  return {
    question: { id: 'q1', left: 4, right: 7, answer: 28 },
    response: correct ? 28 : 27,
    correct,
    answeredAt: '2026-08-19T00:00:01.000Z',
    elapsedMs: 500,
  };
}

describe('mastery tracking', () => {
  it('records correct attempts and streaks', () => {
    const first = applyAttempt(profile, attempt(true));
    const second = applyAttempt(first, attempt(true));
    expect(second.mastery['4x7']).toMatchObject({ attempts: 2, correct: 2, streak: 2 });
    expect(profileAccuracy(second)).toBe(100);
  });

  it('resets a streak and stores mistakes on an incorrect attempt', () => {
    const first = applyAttempt(profile, attempt(true));
    const second = applyAttempt(first, attempt(false));
    expect(second.mastery['4x7']?.streak).toBe(0);
    expect(second.mistakes).toHaveLength(1);
    expect(profileAccuracy(second)).toBe(50);
  });

  it('preserves session history and profile goals while recording attempts', () => {
    const withLearningMetadata: Profile = {
      ...profile,
      masteredFactsGoal: 12,
      sessions: [
        {
          id: 'session-1',
          kind: 'generated',
          mode: 'untimed',
          completedAt: '2026-08-19T00:00:00.000Z',
          questionCount: 10,
          correctCount: 8,
          elapsedMs: 1000,
          seed: 42,
        },
      ],
    };

    const result = applyAttempt(withLearningMetadata, attempt(true));
    expect(result.sessions).toEqual(withLearningMetadata.sessions);
    expect(result.masteredFactsGoal).toBe(12);
  });

  it('calculates rounded mastery percentages', () => {
    expect(
      masteryPercent({ key: '2x3', attempts: 3, correct: 2, streak: 0, lastAttemptAt: '' }),
    ).toBe(67);
  });
});
