import { describe, expect, it } from 'vitest';
import { formatEquation, generateTable, validateTableConfig } from './tables';

const base = { from: 2, to: 3, multiplierFrom: 1, multiplierTo: 3, step: 1 } as const;

describe('multiplication tables', () => {
  it('generates every requested row in deterministic order', () => {
    expect(generateTable(base)).toEqual([
      { multiplicand: 2, multiplier: 1, product: 2 },
      { multiplicand: 2, multiplier: 2, product: 4 },
      { multiplicand: 2, multiplier: 3, product: 6 },
      { multiplicand: 3, multiplier: 1, product: 3 },
      { multiplicand: 3, multiplier: 2, product: 6 },
      { multiplicand: 3, multiplier: 3, product: 9 },
    ]);
  });

  it('respects table step sizes', () => {
    const rows = generateTable({ ...base, from: 2, to: 6, multiplierTo: 1, step: 2 });
    expect(rows.map((row) => row.multiplicand)).toEqual([2, 4, 6]);
  });

  it('rejects invalid ranges and steps', () => {
    expect(() => validateTableConfig({ ...base, step: 0 })).toThrow(
      'Step must be greater than zero',
    );
    expect(() => validateTableConfig({ ...base, from: 8, to: 2 })).toThrow('must not exceed');
  });

  it('formats equations consistently', () => {
    expect(formatEquation({ multiplicand: 7, multiplier: 8, product: 56 })).toBe('7 × 8 = 56');
  });
});
