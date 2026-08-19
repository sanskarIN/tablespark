import { useMemo, useState, type CSSProperties } from 'react';
import { generateTable } from '../../domain/tables';
import type { TableConfig } from '../../domain/types';
import { buildWorksheet, type WorksheetBlankStyle } from '../../domain/worksheet';
import { useLocale } from '../../i18n/LocaleContext';
import { speak } from '../../infrastructure/speech';
import { useAppState } from '../../state/useAppState';

type WorksheetOutput = 'study' | 'worksheet' | 'answer-key';
type PaperSize = 'a4' | 'letter';
type PrintColumns = 1 | 2 | 3;

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
  const { messages } = useLocale();
  const { copy } = messages;
  const [config, setConfig] = useState<TableConfig>(initialConfig);
  const [output, setOutput] = useState<WorksheetOutput>('study');
  const [blankStyle, setBlankStyle] = useState<WorksheetBlankStyle>('line');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [printColumns, setPrintColumns] = useState<PrintColumns>(3);

  const result = useMemo(() => {
    try {
      return {
        items: buildWorksheet(generateTable(config), { blankStyle }),
        error: '',
      };
    } catch (error) {
      return {
        items: [],
        error: error instanceof Error ? error.message : copy.tables.invalidSettings,
      };
    }
  }, [blankStyle, config, copy.tables.invalidSettings]);

  const update = (key: keyof TableConfig, raw: string) => {
    setConfig((current) => ({ ...current, [key]: numberValue(raw, current[key]) }));
  };

  const isPracticeWorksheet = output === 'worksheet';
  const printButtonLabel =
    output === 'worksheet'
      ? copy.tables.printPracticeWorksheet
      : output === 'answer-key'
        ? copy.tables.printAnswerKey
        : copy.tables.printStudySheet;
  const printTitle =
    output === 'worksheet'
      ? copy.tables.worksheetTitle
      : output === 'answer-key'
        ? copy.tables.answerKeyTitle
        : copy.tables.studySheetTitle;
  const worksheetStyle = {
    '--worksheet-columns': String(printColumns),
  } as CSSProperties;

  return (
    <section className="page-stack" aria-labelledby="tables-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">{copy.tables.eyebrow}</p>
          <h2 id="tables-title">{copy.tables.title}</h2>
          <p>{copy.tables.description}</p>
        </div>
        <button className="secondary-button no-print" type="button" onClick={() => window.print()}>
          {printButtonLabel}
        </button>
      </div>

      <form className="control-grid no-print" onSubmit={(event) => event.preventDefault()}>
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
      </form>

      <section className="panel worksheet-composer no-print" aria-labelledby="worksheet-composer-title">
        <div className="section-heading">
          <div>
            <h3 id="worksheet-composer-title">{copy.tables.composerHeading}</h3>
            <p>{copy.tables.composerDescription}</p>
          </div>
        </div>
        <div className="control-grid composer-grid">
          <label>
            {copy.tables.worksheetOutput}
            <select
              value={output}
              onChange={(event) => setOutput(event.target.value as WorksheetOutput)}
            >
              <option value="study">{copy.tables.outputStudy}</option>
              <option value="worksheet">{copy.tables.outputPractice}</option>
              <option value="answer-key">{copy.tables.outputAnswerKey}</option>
            </select>
          </label>
          <label>
            {copy.tables.answerBlankStyle}
            <select
              value={blankStyle}
              disabled={!isPracticeWorksheet}
              onChange={(event) => setBlankStyle(event.target.value as WorksheetBlankStyle)}
            >
              <option value="line">{copy.tables.blankLine}</option>
              <option value="box">{copy.tables.blankBox}</option>
              <option value="space">{copy.tables.blankSpace}</option>
            </select>
          </label>
          <label>
            {copy.tables.paperSize}
            <select
              value={paperSize}
              onChange={(event) => setPaperSize(event.target.value as PaperSize)}
            >
              <option value="a4">{copy.tables.paperA4}</option>
              <option value="letter">{copy.tables.paperLetter}</option>
            </select>
          </label>
          <label>
            {copy.tables.printColumns}
            <select
              value={printColumns}
              onChange={(event) => setPrintColumns(Number(event.target.value) as PrintColumns)}
            >
              <option value={1}>{copy.tables.columns(1)}</option>
              <option value={2}>{copy.tables.columns(2)}</option>
              <option value={3}>{copy.tables.columns(3)}</option>
            </select>
          </label>
        </div>
      </section>

      {result.error ? (
        <div className="status error" role="alert">
          {result.error}
        </div>
      ) : (
        <div
          className="worksheet-page"
          data-paper-size={paperSize}
          data-output={output}
          style={worksheetStyle}
        >
          <header className="print-only worksheet-print-header">
            <h1>{printTitle}</h1>
            {output !== 'answer-key' ? (
              <div className="worksheet-print-meta">
                <span>{copy.tables.learnerLine}</span>
                <span>{copy.tables.dateLine}</span>
              </div>
            ) : null}
          </header>
          <div className="table-grid worksheet-grid" aria-live="polite">
            {result.items.map((item) => (
              <article className="equation-card" key={item.id}>
                <strong>{isPracticeWorksheet ? item.prompt : item.solvedEquation}</strong>
                {!isPracticeWorksheet && state.settings.speechEnabled ? (
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
        </div>
      )}
    </section>
  );
}
