import { masteryKey } from './questions';
import type { Attempt, Question } from './types';

export function buildMistakeReview(attempts: readonly Attempt[], count: number): Question[] {
  if (!Number.isInteger(count) || count < 1 || count > 200) {
    throw new RangeError('Review question count must be between 1 and 200.');
  }

  const seen = new Set<string>();
  const questions: Question[] = [];

  for (const attempt of attempts) {
    const key = masteryKey(attempt.question.left, attempt.question.right);
    if (seen.has(key)) continue;

    seen.add(key);
    questions.push({
      ...attempt.question,
      id: `review-${questions.length}-${attempt.question.id}`,
    });

    if (questions.length >= count) break;
  }

  return questions;
}
