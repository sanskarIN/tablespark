export const MIN_PRACTICE_RESPONSE = -1_000_000;
export const MAX_PRACTICE_RESPONSE = 1_000_000;

export function isValidPracticeResponse(value: number): boolean {
  return (
    Number.isSafeInteger(value) &&
    value >= MIN_PRACTICE_RESPONSE &&
    value <= MAX_PRACTICE_RESPONSE
  );
}
