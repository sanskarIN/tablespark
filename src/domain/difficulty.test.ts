import { describe, expect, it } from 'vitest';
import { difficultyPresets } from './difficulty';

describe('difficulty progression', () => {
  it('increases range and practice volume across presets', () => {
    expect(difficultyPresets.starter.max).toBeLessThan(difficultyPresets.builder.max);
    expect(difficultyPresets.builder.max).toBeLessThan(difficultyPresets.challenge.max);
    expect(difficultyPresets.starter.count).toBeLessThan(difficultyPresets.builder.count);
    expect(difficultyPresets.builder.count).toBeLessThan(difficultyPresets.challenge.count);
  });
});
