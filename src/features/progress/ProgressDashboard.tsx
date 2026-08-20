import { useMemo, useState } from 'react';
import { masteryPercent, profileAccuracy } from '../../domain/mastery';
import {
  filterMasteryStats,
  isMastered,
  type MasteryFilter,
} from '../../domain/progress';
import { useLocale } from '../../i18n/LocaleContext';
import { useAppState } from '../../state/useAppState';

function formatSessionDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ProgressDashboard() {
  const { activeProfile, state } = useAppState();
  const { locale, messages } = useLocale();
  const { copy, learning } = messages;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MasteryFilter>('all');
  const allStats = useMemo(() => Object.values(activeProfile.mastery), [activeProfile.mastery]);
  const stats = useMemo(
    () => filterMasteryStats(allStats, query, filter),
    [allStats, filter, query],
  );
  const totalAttempts = allStats.reduce((sum, stat) => sum + stat.attempts, 0);
  const masteredCount = allStats.filter(isMastered).length;
  const goal = activeProfile.masteredFactsGoal;
  const goalPercent = goal === null ? 0 : Math.min(100, Math.round((masteredCount / goal) * 100));

  return (
    <section className="page-stack" aria-labelledby="progress-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">{copy.progress.eyebrow}</p>
          <h2 id="progress-title">{copy.progress.title(activeProfile.name)}</h2>
          <p>{copy.progress.description}</p>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>{copy.progress.accuracy}</span>
          <strong>{profileAccuracy(activeProfile)}%</strong>
        </article>
        <article className="metric-card">
          <span>{copy.progress.attempts}</span>
          <strong>{totalAttempts}</strong>
        </article>
        <article className="metric-card">
          <span>{copy.progress.factsPracticed}</span>
          <strong>{allStats.length}</strong>
        </article>
        <article className="metric-card">
          <span>{copy.progress.masteredFacts}</span>
          <strong>{masteredCount}</strong>
        </article>
        <article className="metric-card">
          <span>{copy.progress.mistakesSaved}</span>
          <strong>{activeProfile.mistakes.length}</strong>
        </article>
      </div>

      <div className="panel goal-panel">
        <div className="section-heading">
          <div>
            <h3>{learning.progress.goalHeading}</h3>
            <p>
              {goal === null
                ? learning.progress.noGoal
                : learning.progress.goalProgress(masteredCount, goal)}
            </p>
          </div>
          {goal !== null ? <strong className="goal-percent">{goalPercent}%</strong> : null}
        </div>
        {goal !== null ? (
          <>
            <div className="progress-track" aria-label={`${goalPercent}%`}>
              <span style={{ width: `${goalPercent}%` }} />
            </div>
            {masteredCount >= goal ? <p>{learning.progress.goalComplete}</p> : null}
          </>
        ) : null}
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h3>{copy.progress.factMastery}</h3>
            <p>{copy.progress.masteryRule}</p>
          </div>
        </div>
        {allStats.length === 0 ? (
          <p className="empty-state">{copy.progress.noProgress}</p>
        ) : (
          <>
            <div className="control-grid no-print">
              <label>
                {copy.progress.searchFacts}
                <input
                  type="search"
                  placeholder={copy.progress.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label>
                {copy.progress.show}
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as MasteryFilter)}
                >
                  <option value="all">{copy.progress.allFacts}</option>
                  <option value="needs-practice">{copy.progress.needsPractice}</option>
                  <option value="mastered">{copy.progress.mastered}</option>
                </select>
              </label>
            </div>
            {stats.length === 0 ? (
              <p className="empty-state">{copy.progress.noMatches}</p>
            ) : (
              <div className="mastery-list">
                {stats.map((stat) => {
                  const percent = masteryPercent(stat);
                  return (
                    <div className="mastery-row" key={stat.key}>
                      <div>
                        <strong>{stat.key.replace('x', ' × ')}</strong>
                        <small>
                          {copy.progress.factStats(stat.correct, stat.attempts, stat.streak)}
                        </small>
                      </div>
                      <div
                        className="progress-track"
                        aria-label={copy.progress.masteryPercent(percent)}
                      >
                        <span style={{ width: `${percent}%` }} />
                      </div>
                      <strong>{percent}%</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h3>{learning.progress.recentSessions}</h3>
            <p>
              {learning.progress.retainedSessions(
                activeProfile.sessions.length,
                state.settings.sessionHistoryLimit,
              )}
            </p>
          </div>
        </div>
        {activeProfile.sessions.length === 0 ? (
          <p className="empty-state">{learning.progress.noSessions}</p>
        ) : (
          <ul className="session-list">
            {activeProfile.sessions.slice(0, 12).map((session) => (
              <li key={session.id}>
                <div>
                  <strong>
                    {session.kind === 'generated'
                      ? learning.progress.generated
                      : learning.progress.mistakeReview}
                  </strong>
                  <time dateTime={session.completedAt}>
                    {formatSessionDate(session.completedAt, locale)}
                  </time>
                </div>
                <span>
                  {session.mode === 'timed'
                    ? learning.progress.timed
                    : learning.progress.untimed}
                </span>
                <span>
                  {learning.progress.sessionScore(session.correctCount, session.questionCount)}
                </span>
                <span>
                  {learning.progress.sessionDuration(Math.round(session.elapsedMs / 1000))}
                </span>
                {session.seed !== null ? (
                  <code>{learning.progress.sessionSeed(session.seed)}</code>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h3>{copy.progress.recentMistakes}</h3>
        {activeProfile.mistakes.length === 0 ? (
          <p className="empty-state">{copy.progress.noMistakes}</p>
        ) : (
          <ul className="mistake-list">
            {activeProfile.mistakes.slice(0, 12).map((attempt) => (
              <li key={`${attempt.question.id}-${attempt.answeredAt}`}>
                <span>
                  {attempt.question.left} × {attempt.question.right}
                </span>
                <span>{copy.progress.yourAnswer(attempt.response)}</span>
                <strong>{copy.progress.correctAnswer(attempt.question.answer)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
