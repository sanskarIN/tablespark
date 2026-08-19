import { useMemo, useState } from 'react';
import { formatEquation, generateTable } from '../../domain/tables';
import type { TableConfig } from '../../domain/types';
import { speak } from '../../infrastructure/speech';
import { useAppState } from '../../state/AppState';

const initialConfig: TableConfig = {
  from: 2,
  to: 5,
  multiplierFrom: 1,
  multiplierTo: 12,
  step: 1,
};

function numberValue(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function TableGenerator() {
  const { state } = useAppState();
  const [config, setConfig] = useState<TableConfig>(initialConfig);

  const result = useMemo(() => {
    try {
      return { rows: generateTable(config), error: '' };
    } catch (error) {
      return { rows: [], error: error instanceof Error ? error.message : 'Invalid table settings.' };
    }
  }, [config]);

  const update = (key: keyof TableConfig, raw: string) => {
    setConfig((current) => ({ ...current, [key]: numberValue(raw, current[key]) }));
  };

  return (
    <section className="page-stack" aria-labelledby="tables-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Generate · Learn · Print</p>
          <h2 id="tables-title">Multiplication tables</h2>
          <p>Create a custom range, change the step, then print a classroom-ready worksheet.</p>
        </div>
        <button className="secondary-button no-print" type="button" onClick={() => window.print()}>
          Print worksheet
        </button>
      </div>

      <form className="control-grid" onSubmit={(event) => event.preventDefault()}>
        <label>
          Table start
          <input type="number" value={config.from} onChange={(event) => update('from', event.target.value)} min={-1000} max={1000} />
        </label>
        <label>
          Table end
          <input type="number" value={config.to} onChange={(event) => update('to', event.target.value)} min={-1000} max={1000} />
        </label>
        <label>
          Multiplier start
          <input type="number" value={config.multiplierFrom} onChange={(event) => update('multiplierFrom', event.target.value)} min={-1000} max={1000} />
        </label>
        <label>
          Multiplier end
          <input type="number" value={config.multiplierTo} onChange={(event) => update('multiplierTo', event.target.value)} min={-1000} max={1000} />
        </label>
        <label>
          Table step
          <input type="number" value={config.step} onChange={(event) => update('step', event.target.value)} min={1} max={1000} />
        </label>
      </form>

      {result.error ? (
        <div className="status error" role="alert">{result.error}</div>
      ) : (
        <div className="table-grid" aria-live="polite">
          {result.rows.map((row) => (
            <article className="equation-card" key={`${row.multiplicand}-${row.multiplier}`}>
              <strong>{formatEquation(row)}</strong>
              {state.settings.speechEnabled ? (
                <button className="icon-button no-print" type="button" aria-label={`Read ${formatEquation(row)}`} onClick={() => speak(formatEquation(row))}>
                  🔊
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
