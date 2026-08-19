import { describe, expect, it } from 'vitest';
import type { MasteryStat } from './types';
import { filterMasteryStats, isMastered } from './progress';

function stat(key: string, attempts: number, correct: number): MasteryStat {
  return {
    key,
    attempts,
    correct,
    streak: correct,
    lastAttemptAt: '2026-08-19T00:00:00.000Z',
  };
}

describe('mastery progress filtering', () => {
  const mastered = stat('4x7', 5, 5);
  const learning = stat('6x8', 5, 3);
  const newFact = stat('9x9', 2, 2);

  it('requires both practice volume and accuracy for mastery', () => {
    expect(isMastered(mastered)).toBe(true);
    expect(isMastered(learning)).toBe(false);
    expect(isMastered(newFact)).toBe(false);
  });

  it('filters mastered and needs-practice facts', () => {
    expect(filterMasteryStats([mastered, learning, newFact], '', 'mastered')).toEqual([mastered]);
    expect(filterMasteryStats([mastered, learning, newFact], '', 'needs-practice')).toEqual([
      learning,
      newFact,
    ]);
  });

  it('searches normalized multiplication fact text', () => {
    expect(filterMasteryStats([mastered, learning], '4 × 7', 'all')).toEqual([mastered]);
  });

  it('sorts by practice volume and then fact key', () => {
    expect(
      filterMasteryStats([stat('5x6', 2, 2), stat('2x3', 5, 5), stat('4x4', 2, 1)], '', 'all').map(
        (item) => item.key,
      ),
    ).toEqual(['2x3', '4x4', '5x6']);
  });
});
