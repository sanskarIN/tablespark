import { describe, expect, it } from 'vitest';
import type { Attempt } from './types';
import { buildMistakeReview } from './review';

function mistake(id: string, left: number, right: number, answeredAt: string): Attempt {
  return {
    question: { id, left, right, answer: left * right },
    response: left * right - 1,
    correct: false,
    answeredAt,
    elapsedMs: 500,
  };
}

describe('mistake review', () => {
  it('keeps the most recent occurrence of each commutative fact', () => {
    const questions = buildMistakeReview(
      [
        mistake('latest', 7, 4, '2026-08-19T01:00:00.000Z'),
        mistake('duplicate', 4, 7, '2026-08-19T00:59:00.000Z'),
        mistake('second', 8, 6, '2026-08-19T00:58:00.000Z'),
      ],
      10,
    );

    expect(questions).toHaveLength(2);
    expect(questions[0]).toMatchObject({ left: 7, right: 4, answer: 28 });
    expect(questions[1]).toMatchObject({ left: 8, right: 6, answer: 48 });
  });

  it('caps the review to the requested count', () => {
    const questions = buildMistakeReview(
      [
        mistake('a', 2, 3, '2026-08-19T01:00:00.000Z'),
        mistake('b', 4, 5, '2026-08-19T00:59:00.000Z'),
      ],
      1,
    );
    expect(questions).toHaveLength(1);
  });

  it('rejects invalid review counts', () => {
    expect(() => buildMistakeReview([], 0)).toThrow('Review question count must be between');
  });
});
