import { useEffect, useMemo, useRef, useState } from 'react';
import { difficultyPresets, type DifficultyLevel } from '../../domain/difficulty';
import { generateQuestions, MAX_SEED } from '../../domain/questions';
import { buildMistakeReview } from '../../domain/review';
import type { DrillMode, Question } from '../../domain/types';
import { copy } from '../../i18n/en';
import { createPracticeSeed } from '../../infrastructure/random';
import { speak } from '../../infrastructure/speech';
import { useAppState } from '../../state/useAppState';

interface Setup {
  min: number;
  max: number;
  count: number;
  seed: number;
  mode: DrillMode;
  seconds: number;
}

type SessionKind = 'generated' | 'mistake-review';

const defaultSetup = {
  min: 2,
  max: 12,
  count: 10,
  mode: 'untimed' as const,
  seconds: 60,
};

export function PracticeDrill() {
  const { activeProfile, recordAttempt, state } = useAppState();
  const [setup, setSetup] = useState<Setup>(() => ({
    ...defaultSetup,
    seed: createPracticeSeed(),
    count: state.settings.defaultQuestionCount,
    seconds: state.settings.defaultTimeLimitSeconds,
  }));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionKind, setSessionKind] = useState<SessionKind>('generated');
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(setup.seconds);
  const [feedback, setFeedback] = useState('');
  const startedAt = useRef(0);

  const current = questions[index];
  const finished = questions.length > 0 && index >= questions.length;
  const isRunning = questions.length > 0 && !finished;

  useEffect(() => {
    if (!isRunning || setup.mode !== 'timed') return undefined;
    const id = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, setup.mode]);

  useEffect(() => {
    if (isRunning && setup.mode === 'timed' && remaining === 0) {
      setIndex(questions.length);
    }
  }, [isRunning, questions.length, remaining, setup.mode]);

  const summary = useMemo(() => {
    if (!finished) return '';
    return copy.practice.score(score, questions.length);
  }, [finished, questions.length, score]);

  const applyDifficulty = (level: DifficultyLevel | 'custom') => {
    if (level === 'custom') return;
    const preset = difficultyPresets[level];
    setSetup((value) => ({
      ...value,
      min: preset.min,
      max: preset.max,
      count: preset.count,
    }));
    setFeedback(copy.practice.presetSelected(preset.label, preset.description));
  };

  const chooseNewSeed = () => {
    const seed = createPracticeSeed();
    setSetup((value) => ({ ...value, seed }));
    setFeedback(copy.practice.randomSeedSelected(seed));
  };

  const start = (nextQuestions?: Question[], kind: SessionKind = 'generated') => {
    try {
      const generated = nextQuestions ?? generateQuestions(setup);
      setSessionKind(kind);
      setQuestions(generated);
      setIndex(0);
      setScore(0);
      setResponse('');
      setFeedback('');
      setRemaining(setup.seconds);
      startedAt.current = performance.now();
      if (state.settings.speechEnabled && generated[0]) {
        speak(copy.practice.spokenQuestion(generated[0].left, generated[0].right));
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : copy.practice.couldNotStart);
    }
  };

  const reviewMistakes = () => {
    try {
      const review = buildMistakeReview(activeProfile.mistakes, setup.count);
      if (review.length === 0) {
        setFeedback(copy.practice.noMistakes);
        return;
      }
      start(review, 'mistake-review');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : copy.practice.couldNotReview);
    }
  };

  const submit = () => {
    if (!current) return;
    const parsed = Number(response);
    if (!Number.isInteger(parsed)) {
      setFeedback(copy.practice.wholeNumber);
      return;
    }

    const correct = parsed === current.answer;
    const now = performance.now();
    recordAttempt({
      question: current,
      response: parsed,
      correct,
      answeredAt: new Date().toISOString(),
      elapsedMs: Math.max(0, now - startedAt.current),
    });
    if (correct) setScore((value) => value + 1);
    setFeedback(correct ? copy.practice.correct : copy.practice.incorrect(current.answer));

    const nextIndex = index + 1;
    setIndex(nextIndex);
    setResponse('');
    startedAt.current = now;
    const next = questions[nextIndex];
    if (state.settings.speechEnabled && next) {
      speak(copy.practice.spokenQuestion(next.left, next.right));
    }
  };

  const resetSession = (randomize: boolean) => {
    setQuestions([]);
    setSessionKind('generated');
    setFeedback('');
    if (randomize) {
      setSetup((value) => ({ ...value, seed: createPracticeSeed() }));
    }
  };

  return (
    <section className="page-stack" aria-labelledby="practice-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">{copy.practice.eyebrow}</p>
          <h2 id="practice-title">{copy.practice.title}</h2>
          <p>{copy.practice.description}</p>
        </div>
        {setup.mode === 'timed' && isRunning ? (
          <strong className="timer" aria-live="polite">
            {copy.practice.timer(remaining)}
          </strong>
        ) : null}
      </div>

      {!isRunning && !finished ? (
        <form
          className="control-grid"
          onSubmit={(event) => {
            event.preventDefault();
            start();
          }}
        >
          <label>
            {copy.practice.difficultyPreset}
            <select
              defaultValue="custom"
              onChange={(event) =>
                applyDifficulty(event.target.value as DifficultyLevel | 'custom')
              }
            >
              <option value="custom">{copy.practice.custom}</option>
              <option value="starter">{copy.practice.starter}</option>
              <option value="builder">{copy.practice.builder}</option>
              <option value="challenge">{copy.practice.challenge}</option>
            </select>
          </label>
          <label>
            {copy.practice.minimum}
            <input
              type="number"
              min={0}
              max={1000}
              value={setup.min}
              onChange={(event) =>
                setSetup((value) => ({ ...value, min: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            {copy.practice.maximum}
            <input
              type="number"
              min={0}
              max={1000}
              value={setup.max}
              onChange={(event) =>
                setSetup((value) => ({ ...value, max: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            {copy.practice.questions}
            <input
              type="number"
              min={1}
              max={200}
              value={setup.count}
              onChange={(event) =>
                setSetup((value) => ({ ...value, count: Number(event.target.value) }))
              }
            />
          </label>
          <div>
            <label>
              {copy.practice.seed}
              <input
                type="number"
                min={0}
                max={MAX_SEED}
                step={1}
                value={setup.seed}
                onChange={(event) =>
                  setSetup((value) => ({ ...value, seed: Number(event.target.value) }))
                }
              />
            </label>
            <button className="text-button" type="button" onClick={chooseNewSeed}>
              {copy.practice.newRandomSeed}
            </button>
          </div>
          <label>
            {copy.practice.mode}
            <select
              value={setup.mode}
              onChange={(event) =>
                setSetup((value) => ({ ...value, mode: event.target.value as DrillMode }))
              }
            >
              <option value="untimed">{copy.practice.untimed}</option>
              <option value="timed">{copy.practice.timed}</option>
            </select>
          </label>
          {setup.mode === 'timed' ? (
            <label>
              {copy.practice.timeLimit}
              <input
                type="number"
                min={10}
                max={3600}
                value={setup.seconds}
                onChange={(event) =>
                  setSetup((value) => ({ ...value, seconds: Number(event.target.value) }))
                }
              />
            </label>
          ) : null}
          <div className="button-row">
            <button className="primary-button" type="submit">
              {copy.practice.start}
            </button>
            <button className="secondary-button" type="button" onClick={reviewMistakes}>
              {copy.practice.reviewMistakes}
            </button>
          </div>
        </form>
      ) : null}

      {isRunning && current ? (
        <div className="drill-card">
          <p>{copy.practice.questionProgress(index + 1, questions.length)}</p>
          <div className="question" aria-live="polite">
            {current.left} × {current.right} = ?
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <label className="answer-label">
              {copy.practice.yourAnswer}
              <input
                inputMode="numeric"
                type="number"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
            </label>
            <button className="primary-button" type="submit">
              {copy.practice.checkAnswer}
            </button>
          </form>
        </div>
      ) : null}

      {finished ? (
        <div className="drill-card center">
          <h3>{copy.practice.complete}</h3>
          <p className="question">{summary}</p>
          <p>
            {sessionKind === 'generated'
              ? copy.practice.seedReplay(setup.seed)
              : copy.practice.reviewCompleteNote}
          </p>
          <div className="button-row">
            {sessionKind === 'generated' ? (
              <>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => resetSession(true)}
                >
                  {copy.practice.newRandomDrill}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => resetSession(false)}
                >
                  {copy.practice.repeatSeed}
                </button>
              </>
            ) : (
              <button className="primary-button" type="button" onClick={() => resetSession(false)}>
                {copy.practice.backToSetup}
              </button>
            )}
          </div>
        </div>
      ) : null}
      {feedback ? (
        <div className="status" role="status" aria-live="polite">
          {feedback}
        </div>
      ) : null}
    </section>
  );
}
