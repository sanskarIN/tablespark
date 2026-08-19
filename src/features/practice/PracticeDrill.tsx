import { useEffect, useMemo, useRef, useState } from 'react';
import { difficultyPresets, type DifficultyLevel } from '../../domain/difficulty';
import { generateQuestions, MAX_SEED } from '../../domain/questions';
import { buildMistakeReview } from '../../domain/review';
import type { DrillMode, Question } from '../../domain/types';
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
    return `Score ${score} of ${questions.length}`;
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
    setFeedback(`${preset.label}: ${preset.description}`);
  };

  const chooseNewSeed = () => {
    const seed = createPracticeSeed();
    setSetup((value) => ({ ...value, seed }));
    setFeedback(`New random seed: ${seed}`);
  };

  const start = (nextQuestions?: Question[]) => {
    try {
      const generated = nextQuestions ?? generateQuestions(setup);
      setQuestions(generated);
      setIndex(0);
      setScore(0);
      setResponse('');
      setFeedback('');
      setRemaining(setup.seconds);
      startedAt.current = performance.now();
      if (state.settings.speechEnabled && generated[0]) {
        speak(`${generated[0].left} times ${generated[0].right}`);
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not start the drill.');
    }
  };

  const reviewMistakes = () => {
    try {
      const review = buildMistakeReview(activeProfile.mistakes, setup.count);
      if (review.length === 0) {
        setFeedback('No mistakes to review yet. Complete a drill first.');
        return;
      }
      start(review);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not create mistake review.');
    }
  };

  const submit = () => {
    if (!current) return;
    const parsed = Number(response);
    if (!Number.isInteger(parsed)) {
      setFeedback('Enter a whole-number answer.');
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
    setFeedback(correct ? 'Correct!' : `Not quite. The answer is ${current.answer}.`);

    const nextIndex = index + 1;
    setIndex(nextIndex);
    setResponse('');
    startedAt.current = now;
    const next = questions[nextIndex];
    if (state.settings.speechEnabled && next) {
      speak(`${next.left} times ${next.right}`);
    }
  };

  const resetSession = (randomize: boolean) => {
    setQuestions([]);
    setFeedback('');
    if (randomize) {
      setSetup((value) => ({ ...value, seed: createPracticeSeed() }));
    }
  };

  return (
    <section className="page-stack" aria-labelledby="practice-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Focused practice</p>
          <h2 id="practice-title">Drill your multiplication skills</h2>
          <p>
            Start with a random mix, or reuse the visible seed to replay exactly the same session.
            Difficulty presets and mistake review help target the right facts.
          </p>
        </div>
        {setup.mode === 'timed' && isRunning ? (
          <strong className="timer" aria-live="polite">
            {remaining}s
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
            Difficulty preset
            <select
              defaultValue="custom"
              onChange={(event) =>
                applyDifficulty(event.target.value as DifficultyLevel | 'custom')
              }
            >
              <option value="custom">Custom</option>
              <option value="starter">Starter · 0–5</option>
              <option value="builder">Builder · 2–12</option>
              <option value="challenge">Challenge · 2–20</option>
            </select>
          </label>
          <label>
            Minimum
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
            Maximum
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
            Questions
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
              Seed
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
              New random seed
            </button>
          </div>
          <label>
            Mode
            <select
              value={setup.mode}
              onChange={(event) =>
                setSetup((value) => ({ ...value, mode: event.target.value as DrillMode }))
              }
            >
              <option value="untimed">Untimed</option>
              <option value="timed">Timed</option>
            </select>
          </label>
          {setup.mode === 'timed' ? (
            <label>
              Time limit (seconds)
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
              Start drill
            </button>
            <button className="secondary-button" type="button" onClick={reviewMistakes}>
              Review mistakes
            </button>
          </div>
        </form>
      ) : null}

      {isRunning && current ? (
        <div className="drill-card">
          <p>
            Question {index + 1} of {questions.length}
          </p>
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
              Your answer
              <input
                inputMode="numeric"
                type="number"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
            </label>
            <button className="primary-button" type="submit">
              Check answer
            </button>
          </form>
        </div>
      ) : null}

      {finished ? (
        <div className="drill-card center">
          <h3>Session complete</h3>
          <p className="question">{summary}</p>
          <p>Seed {setup.seed} can be reused for the same generated drill.</p>
          <div className="button-row">
            <button className="primary-button" type="button" onClick={() => resetSession(true)}>
              New random drill
            </button>
            <button className="secondary-button" type="button" onClick={() => resetSession(false)}>
              Repeat this seed
            </button>
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
