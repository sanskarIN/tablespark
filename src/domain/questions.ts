import type { Question } from './types';

export const MAX_SEED = 0xffffffff;

export interface QuestionConfig {
  readonly min: number;
  readonly max: number;
  readonly count: number;
  readonly seed: number;
}

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateQuestions(config: QuestionConfig): Question[] {
  if (
    !Number.isInteger(config.min) ||
    !Number.isInteger(config.max) ||
    config.min < 0 ||
    config.max > 1000
  ) {
    throw new RangeError('Question range must use integers between 0 and 1000.');
  }
  if (config.min > config.max) {
    throw new RangeError('Question minimum must not exceed maximum.');
  }
  if (!Number.isInteger(config.count) || config.count < 1 || config.count > 200) {
    throw new RangeError('Question count must be between 1 and 200.');
  }
  if (!Number.isInteger(config.seed) || config.seed < 0 || config.seed > MAX_SEED) {
    throw new RangeError(`Seed must be an integer between 0 and ${MAX_SEED}.`);
  }

  const random = mulberry32(config.seed);
  const span = config.max - config.min + 1;
  return Array.from({ length: config.count }, (_, index) => {
    const left = config.min + Math.floor(random() * span);
    const right = config.min + Math.floor(random() * span);
    return {
      id: `${config.seed}-${index}-${left}-${right}`,
      left,
      right,
      answer: left * right,
    };
  });
}

export function masteryKey(left: number, right: number): string {
  const [small, large] = left <= right ? [left, right] : [right, left];
  return `${small}x${large}`;
}
