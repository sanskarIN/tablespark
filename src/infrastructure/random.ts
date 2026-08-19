import { MAX_SEED } from '../domain/questions';

export function createPracticeSeed(random: () => number = Math.random): number {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('Random source must return a finite value from 0 inclusive to 1 exclusive.');
  }
  return Math.floor(value * (MAX_SEED + 1));
}
