import { masteryPercent, profileAccuracy } from '../../domain/mastery';
import { useAppState } from '../../state/useAppState';

export function ProgressDashboard() {
  const { activeProfile } = useAppState();
  const stats = Object.values(activeProfile.mastery).sort((a, b) => b.attempts - a.attempts);
  const totalAttempts = stats.reduce((sum, stat) => sum + stat.attempts, 0);

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
          <strong>{stats.length}</strong>
        </article>
        <article className="metric-card">
          <span>Mistakes saved</span>
          <strong>{activeProfile.mistakes.length}</strong>
        </article>
      </div>

      <div className="panel">
        <h3>Fact mastery</h3>
        {stats.length === 0 ? (
          <p className="empty-state">
            No progress yet. Complete a practice drill to start building mastery.
          </p>
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
