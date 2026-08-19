import { describe, expect, it } from 'vitest';
import { MAX_SEED } from '../domain/questions';
import { createPracticeSeed } from './random';

describe('practice seed randomizer', () => {
  it('maps random values into the supported unsigned seed range', () => {
    expect(createPracticeSeed(() => 0)).toBe(0);
    expect(createPracticeSeed(() => 0.5)).toBe(2_147_483_648);
    expect(createPracticeSeed(() => 0.9999999999999999)).toBeLessThanOrEqual(MAX_SEED);
  });

  it('rejects invalid random source values', () => {
    expect(() => createPracticeSeed(() => -0.1)).toThrow('Random source must return');
    expect(() => createPracticeSeed(() => 1)).toThrow('Random source must return');
    expect(() => createPracticeSeed(() => Number.NaN)).toThrow('Random source must return');
  });
});
