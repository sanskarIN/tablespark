import { describe, expect, it } from 'vitest';
import { difficultyPresets } from './difficulty';

describe('difficulty progression', () => {
  it('increases range and practice volume across the full preset ladder', () => {
    const presets = [
      difficultyPresets.starter,
      difficultyPresets.foundation,
      difficultyPresets.builder,
      difficultyPresets.fluency,
      difficultyPresets.challenge,
    ];

    for (let index = 1; index < presets.length; index += 1) {
      expect(presets[index]?.max).toBeGreaterThanOrEqual(presets[index - 1]?.max ?? 0);
      expect(presets[index]?.count).toBeGreaterThan(presets[index - 1]?.count ?? 0);
    }
  });

  it('keeps each preset within supported practice bounds', () => {
    for (const preset of Object.values(difficultyPresets)) {
      expect(preset.min).toBeGreaterThanOrEqual(0);
      expect(preset.max).toBeLessThanOrEqual(1000);
      expect(preset.min).toBeLessThanOrEqual(preset.max);
      expect(preset.count).toBeGreaterThanOrEqual(1);
      expect(preset.count).toBeLessThanOrEqual(200);
    }
  });
});
