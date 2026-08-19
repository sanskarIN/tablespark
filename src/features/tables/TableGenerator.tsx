import { useMemo, useState } from 'react';
import { generateTable } from '../../domain/tables';
import type { TableConfig } from '../../domain/types';
import { buildWorksheet } from '../../domain/worksheet';
import { copy } from '../../i18n/en';
import { speak } from '../../infrastructure/speech';
import { useAppState } from '../../state/useAppState';

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
  const [worksheetMode, setWorksheetMode] = useState(false);

  const result = useMemo(() => {
    try {
      return { items: buildWorksheet(generateTable(config)), error: '' };
    } catch (error) {
      return {
        items: [],
        error: error instanceof Error ? error.message : copy.tables.invalidSettings,
      };
    }
  }, [config]);

  const update = (key: keyof TableConfig, raw: string) => {
    setConfig((current) => ({ ...current, [key]: numberValue(raw, current[key]) }));
  };

  return (
    <section className="page-stack" aria-labelledby="tables-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">{copy.tables.eyebrow}</p>
          <h2 id="tables-title">{copy.tables.title}</h2>
          <p>{copy.tables.description}</p>
        </div>
        <button className="secondary-button no-print" type="button" onClick={() => window.print()}>
          {worksheetMode ? copy.tables.printPracticeWorksheet : copy.tables.printStudySheet}
        </button>
      </div>

      <form className="control-grid" onSubmit={(event) => event.preventDefault()}>
        <label>
          {copy.tables.tableStart}
          <input
            type="number"
            value={config.from}
            onChange={(event) => update('from', event.target.value)}
            min={-1000}
            max={1000}
          />
        </label>
        <label>
          {copy.tables.tableEnd}
          <input
            type="number"
            value={config.to}
            onChange={(event) => update('to', event.target.value)}
            min={-1000}
            max={1000}
          />
        </label>
        <label>
          {copy.tables.multiplierStart}
          <input
            type="number"
            value={config.multiplierFrom}
            onChange={(event) => update('multiplierFrom', event.target.value)}
            min={-1000}
            max={1000}
          />
        </label>
        <label>
          {copy.tables.multiplierEnd}
          <input
            type="number"
            value={config.multiplierTo}
            onChange={(event) => update('multiplierTo', event.target.value)}
            min={-1000}
            max={1000}
          />
        </label>
        <label>
          {copy.tables.tableStep}
          <input
            type="number"
            value={config.step}
            onChange={(event) => update('step', event.target.value)}
            min={1}
            max={1000}
          />
        </label>
        <label className="check-row worksheet-toggle">
          <input
            type="checkbox"
            checked={worksheetMode}
            onChange={(event) => setWorksheetMode(event.target.checked)}
          />
          {copy.tables.hideAnswers}
        </label>
      </form>

      {result.error ? (
        <div className="status error" role="alert">
          {result.error}
        </div>
      ) : (
        <>
          <header className="print-only worksheet-print-header">
            <h1>
              {worksheetMode ? copy.tables.worksheetTitle : copy.tables.studySheetTitle}
            </h1>
            <div className="worksheet-print-meta">
              <span>{copy.tables.learnerLine}</span>
              <span>{copy.tables.dateLine}</span>
            </div>
          </header>
          <div className="table-grid" aria-live="polite">
            {result.items.map((item) => (
              <article className="equation-card" key={item.id}>
                <strong>{worksheetMode ? item.prompt : item.solvedEquation}</strong>
                {!worksheetMode && state.settings.speechEnabled ? (
                  <button
                    className="icon-button no-print"
                    type="button"
                    aria-label={copy.tables.readEquation(item.solvedEquation)}
                    onClick={() => speak(item.solvedEquation)}
                  >
                    🔊
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
