import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { generateQuestions, masteryKey } from './questions';

describe('question generation', () => {
  it('is deterministic for the same seed', () => {
    const config = { min: 2, max: 12, count: 20, seed: 42 };
    expect(generateQuestions(config)).toEqual(generateQuestions(config));
  });

  it('changes the sequence for a different seed', () => {
    const first = generateQuestions({ min: 2, max: 12, count: 10, seed: 1 });
    const second = generateQuestions({ min: 2, max: 12, count: 10, seed: 2 });
    expect(first).not.toEqual(second);
  });

  it('keeps operands and products valid across generated ranges', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer(),
        (a, b, seed) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          return generateQuestions({ min, max, count: 25, seed }).every(
            (question) =>
              question.left >= min &&
              question.left <= max &&
              question.right >= min &&
              question.right <= max &&
              question.answer === question.left * question.right,
          );
        },
      ),
    );
  });

  it('normalizes mastery keys for commutative facts', () => {
    expect(masteryKey(8, 4)).toBe(masteryKey(4, 8));
  });
});
