import { masteryPercent } from './mastery';
import type { MasteryStat } from './types';

export type MasteryFilter = 'all' | 'needs-practice' | 'mastered';

export function isMastered(stat: MasteryStat): boolean {
  return stat.attempts >= 3 && masteryPercent(stat) >= 90;
}

function normalizeFactQuery(query: string): string {
  return query.trim().toLowerCase().replaceAll('×', 'x').replaceAll(' ', '');
}

export function filterMasteryStats(
  stats: readonly MasteryStat[],
  query: string,
  filter: MasteryFilter,
): MasteryStat[] {
  const normalizedQuery = normalizeFactQuery(query);

  return stats
    .filter((stat) => {
      if (normalizedQuery && !stat.key.toLowerCase().includes(normalizedQuery)) return false;
      if (filter === 'mastered') return isMastered(stat);
      if (filter === 'needs-practice') return !isMastered(stat);
      return true;
    })
    .sort((a, b) => b.attempts - a.attempts || a.key.localeCompare(b.key));
}
