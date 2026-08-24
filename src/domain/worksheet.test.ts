import { describe, expect, it } from 'vitest';
import { buildWorksheet } from './worksheet';

const row = { multiplicand: 6, multiplier: 7, product: 42 } as const;

describe('worksheet model', () => {
  it('creates unsolved prompts while retaining answers for answer-key use', () => {
    expect(buildWorksheet([row])).toEqual([
      {
        id: '6-7',
        prompt: '6 × 7 = ______',
        answer: 42,
        solvedEquation: '6 × 7 = 42',
      },
    ]);
  });

  it.each([
    ['line', '6 × 7 = ______'],
    ['box', '6 × 7 = □'],
    ['space', '6 × 7 =           '],
  ] as const)('supports the %s blank style', (blankStyle, prompt) => {
    expect(buildWorksheet([row], { blankStyle })[0]?.prompt).toBe(prompt);
  });
});
