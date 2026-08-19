import { copy } from '../../i18n/en';

export function AboutPage() {
  return (
    <section className="page-stack" aria-labelledby="about-title">
      <div className="hero-card">
        <div>
          <p className="eyebrow">{copy.about.eyebrow}</p>
          <h2 id="about-title">{copy.about.title}</h2>
          <p>{copy.about.description}</p>
        </div>
        <img
          className="about-logo"
          src="/logo.svg"
          alt={copy.about.logoAlt}
          width="96"
          height="96"
        />
      </div>

      <div className="panel prose-panel">
        <h3>{copy.about.project}</h3>
        <p>
          <strong>{copy.about.versionLabel}</strong> {copy.about.version}
        </p>
        <p>
          <strong>{copy.about.licenseLabel}</strong> {copy.about.license}
        </p>
        <p>
          <strong>{copy.about.privacyLabel}</strong> {copy.about.privacy}
        </p>
        <p>
          <strong>{copy.about.creditLabel}</strong> {copy.credit}
        </p>
      </div>

      <div className="panel prose-panel">
        <h3>{copy.about.contactSupport}</h3>
        <ul className="link-list">
          <li>
            <a href="mailto:sanskarin@outlook.in">{copy.about.businessOutlook}</a>
          </li>
          <li>
            <a href="mailto:sanskarin.business@gmail.com">{copy.about.businessGmail}</a>
          </li>
          <li>
            <a href="mailto:supportramsandesh@gmail.com">{copy.about.supportEmail}</a>
          </li>
          <li>
            <a href="https://github.com/sanskarIN" target="_blank" rel="noreferrer">
              {copy.about.githubProfile}
            </a>
          </li>
          <li>
            <a href="https://github.com/sanskarIN/tablespark" target="_blank" rel="noreferrer">
              {copy.about.source}
            </a>
          </li>
          <li>
            <a href="https://buymeacoffee.com/sanskarIN" target="_blank" rel="noreferrer">
              {copy.about.funding}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
