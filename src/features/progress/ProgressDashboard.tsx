import { useMemo, useState } from 'react';
import { masteryPercent, profileAccuracy } from '../../domain/mastery';
import {
  filterMasteryStats,
  isMastered,
  type MasteryFilter,
} from '../../domain/progress';
import { useAppState } from '../../state/useAppState';

export function ProgressDashboard() {
  const { activeProfile } = useAppState();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MasteryFilter>('all');
  const allStats = useMemo(() => Object.values(activeProfile.mastery), [activeProfile.mastery]);
  const stats = useMemo(
    () => filterMasteryStats(allStats, query, filter),
    [allStats, filter, query],
  );
  const totalAttempts = allStats.reduce((sum, stat) => sum + stat.attempts, 0);
  const masteredCount = allStats.filter(isMastered).length;

  return (
    <section className="page-stack" aria-labelledby="progress-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Mastery</p>
          <h2 id="progress-title">Progress for {activeProfile.name}</h2>
          <p>
            See accuracy, practice volume, streaks, and recent multiplication facts that need
            another look.
          </p>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Accuracy</span>
          <strong>{profileAccuracy(activeProfile)}%</strong>
        </article>
        <article className="metric-card">
          <span>Attempts</span>
          <strong>{totalAttempts}</strong>
        </article>
        <article className="metric-card">
          <span>Facts practiced</span>
          <strong>{allStats.length}</strong>
        </article>
        <article className="metric-card">
          <span>Mastered facts</span>
          <strong>{masteredCount}</strong>
        </article>
        <article className="metric-card">
          <span>Mistakes saved</span>
          <strong>{activeProfile.mistakes.length}</strong>
        </article>
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h3>Fact mastery</h3>
            <p>Mastered means at least three attempts with 90% or better accuracy.</p>
          </div>
        </div>
        {allStats.length === 0 ? (
          <p className="empty-state">
            No progress yet. Complete a practice drill to start building mastery.
          </p>
        ) : (
          <>
            <div className="control-grid no-print">
              <label>
                Search facts
                <input
                  type="search"
                  placeholder="e.g. 4 × 7"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label>
                Show
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as MasteryFilter)}
                >
                  <option value="all">All practiced facts</option>
                  <option value="needs-practice">Needs practice</option>
                  <option value="mastered">Mastered</option>
                </select>
              </label>
            </div>
            {stats.length === 0 ? (
              <p className="empty-state">No practiced facts match this search and filter.</p>
            ) : (
              <div className="mastery-list">
                {stats.map((stat) => (
                  <div className="mastery-row" key={stat.key}>
                    <div>
                      <strong>{stat.key.replace('x', ' × ')}</strong>
                      <small>
                        {stat.correct}/{stat.attempts} correct · streak {stat.streak}
                      </small>
                    </div>
                    <div
                      className="progress-track"
                      aria-label={`${masteryPercent(stat)} percent mastery`}
                    >
                      <span style={{ width: `${masteryPercent(stat)}%` }} />
                    </div>
                    <strong>{masteryPercent(stat)}%</strong>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="panel">
        <h3>Recent mistakes</h3>
        {activeProfile.mistakes.length === 0 ? (
          <p className="empty-state">No mistakes recorded.</p>
        ) : (
          <ul className="mistake-list">
            {activeProfile.mistakes.slice(0, 12).map((attempt) => (
              <li key={`${attempt.question.id}-${attempt.answeredAt}`}>
                <span>
                  {attempt.question.left} × {attempt.question.right}
                </span>
                <span>Your answer: {attempt.response ?? 'Skipped'}</span>
                <strong>Correct: {attempt.question.answer}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
