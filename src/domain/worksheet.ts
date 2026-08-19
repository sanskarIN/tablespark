import type { TableRow } from './types';

export interface WorksheetItem {
  readonly id: string;
  readonly prompt: string;
  readonly answer: number;
  readonly solvedEquation: string;
}

export function buildWorksheet(rows: readonly TableRow[]): WorksheetItem[] {
  return rows.map((row) => ({
    id: `${row.multiplicand}-${row.multiplier}`,
    prompt: `${row.multiplicand} × ${row.multiplier} = ______`,
    answer: row.product,
    solvedEquation: `${row.multiplicand} × ${row.multiplier} = ${row.product}`,
  }));
}
