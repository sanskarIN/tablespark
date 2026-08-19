import { describe, expect, it } from 'vitest';
import { buildWorksheet } from './worksheet';

describe('worksheet model', () => {
  it('creates unsolved prompts while retaining answers for answer-key use', () => {
    expect(buildWorksheet([{ multiplicand: 6, multiplier: 7, product: 42 }])).toEqual([
      {
        id: '6-7',
        prompt: '6 × 7 = ______',
        answer: 42,
        solvedEquation: '6 × 7 = 42',
      },
    ]);
  });
});
