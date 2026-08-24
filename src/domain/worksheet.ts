import type { TableRow } from './types';

export type WorksheetBlankStyle = 'line' | 'box' | 'space';

export interface WorksheetOptions {
  readonly blankStyle?: WorksheetBlankStyle;
}

export interface WorksheetItem {
  readonly id: string;
  readonly prompt: string;
  readonly answer: number;
  readonly solvedEquation: string;
}

function answerBlank(style: WorksheetBlankStyle): string {
  switch (style) {
    case 'box':
      return '□';
    case 'space':
      return '          ';
    case 'line':
    default:
      return '______';
  }
}

export function buildWorksheet(
  rows: readonly TableRow[],
  options: WorksheetOptions = {},
): WorksheetItem[] {
  const blank = answerBlank(options.blankStyle ?? 'line');

  return rows.map((row) => ({
    id: `${row.multiplicand}-${row.multiplier}`,
    prompt: `${row.multiplicand} × ${row.multiplier} = ${blank}`,
    answer: row.product,
    solvedEquation: `${row.multiplicand} × ${row.multiplier} = ${row.product}`,
  }));
}
