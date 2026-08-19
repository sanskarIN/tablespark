export function AboutPage() {
  return (
    <section className="page-stack" aria-labelledby="about-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Open source learning</p>
          <h2 id="about-title">About TableSpark</h2>
          <p>TableSpark is an offline-first multiplication practice tool built for learners, families, and classrooms.</p>
        </div>
        <img className="about-logo" src="/logo.svg" alt="TableSpark logo" width="96" height="96" />
      </div>

      <div className="panel prose-panel">
        <h3>Project</h3>
        <p><strong>Version:</strong> 0.1.0</p>
        <p><strong>License:</strong> MIT</p>
        <p><strong>Privacy:</strong> Core learning data is stored locally in your browser. No account or donation is required.</p>
        <p><strong>Credit:</strong> Made by the Sanskar</p>
      </div>

      <div className="panel prose-panel">
        <h3>Contact & support</h3>
        <ul className="link-list">
          <li><a href="mailto:sanskarin@outlook.in">Business: sanskarin@outlook.in</a></li>
          <li><a href="mailto:sanskarin.business@gmail.com">Business: sanskarin.business@gmail.com</a></li>
          <li><a href="mailto:supportramsandesh@gmail.com">Support: supportramsandesh@gmail.com</a></li>
          <li><a href="https://github.com/sanskarIN" target="_blank" rel="noreferrer">GitHub profile</a></li>
          <li><a href="https://github.com/sanskarIN/tablespark" target="_blank" rel="noreferrer">TableSpark source</a></li>
          <li><a href="https://buymeacoffee.com/sanskarIN" target="_blank" rel="noreferrer">Buy Me a Coffee — optional support</a></li>
        </ul>
      </div>
    </section>
  );
}
