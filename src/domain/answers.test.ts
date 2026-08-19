import { describe, expect, it } from 'vitest';
import {
  isValidPracticeResponse,
  MAX_PRACTICE_RESPONSE,
  MIN_PRACTICE_RESPONSE,
} from './answers';

describe('practice answer validation', () => {
  it('accepts safe whole numbers inside the supported response range', () => {
    expect(isValidPracticeResponse(0)).toBe(true);
    expect(isValidPracticeResponse(MIN_PRACTICE_RESPONSE)).toBe(true);
    expect(isValidPracticeResponse(MAX_PRACTICE_RESPONSE)).toBe(true);
  });

  it('rejects fractional and out-of-range values', () => {
    expect(isValidPracticeResponse(1.5)).toBe(false);
    expect(isValidPracticeResponse(MIN_PRACTICE_RESPONSE - 1)).toBe(false);
    expect(isValidPracticeResponse(MAX_PRACTICE_RESPONSE + 1)).toBe(false);
  });

  it('rejects non-finite values', () => {
    expect(isValidPracticeResponse(Number.NaN)).toBe(false);
    expect(isValidPracticeResponse(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
