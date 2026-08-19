import type { TableConfig, TableRow } from './types';

const MIN_VALUE = -1000;
const MAX_VALUE = 1000;

function assertIntegerInRange(value: number, name: string): void {
  if (!Number.isInteger(value) || value < MIN_VALUE || value > MAX_VALUE) {
    throw new RangeError(`${name} must be an integer between ${MIN_VALUE} and ${MAX_VALUE}.`);
  }
}

export function validateTableConfig(config: TableConfig): void {
  assertIntegerInRange(config.from, 'Table start');
  assertIntegerInRange(config.to, 'Table end');
  assertIntegerInRange(config.multiplierFrom, 'Multiplier start');
  assertIntegerInRange(config.multiplierTo, 'Multiplier end');
  assertIntegerInRange(config.step, 'Step');

  if (config.step <= 0) throw new RangeError('Step must be greater than zero.');
  if (config.from > config.to) throw new RangeError('Table start must not exceed table end.');
  if (config.multiplierFrom > config.multiplierTo) {
    throw new RangeError('Multiplier start must not exceed multiplier end.');
  }
}

export function generateTable(config: TableConfig): TableRow[] {
  validateTableConfig(config);
  const rows: TableRow[] = [];

  for (let multiplicand = config.from; multiplicand <= config.to; multiplicand += config.step) {
    for (let multiplier = config.multiplierFrom; multiplier <= config.multiplierTo; multiplier += 1) {
      rows.push({ multiplicand, multiplier, product: multiplicand * multiplier });
    }
  }

  return rows;
}

export function formatEquation(row: TableRow): string {
  return `${row.multiplicand} × ${row.multiplier} = ${row.product}`;
}
