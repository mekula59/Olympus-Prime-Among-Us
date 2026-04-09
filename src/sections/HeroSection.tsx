import type { HeroMetric } from '../types/content';

interface HeroSectionProps {
  metrics: HeroMetric[];
}

export function HeroSection({ metrics }: HeroSectionProps) {
  return (
    <section className="hero panel" id="top">
      <div className="hero-copy">
        <p className="section-eyebrow">Olympus Prime transmission</p>
        <h1>Gamesnight, remembered through ship lights and suspicious side-eyes.</h1>
        <p className="hero-lede">
          Olympus Prime&apos;s gamesnight site is built around the part everyone actually
          remembers: fake confidence, emergency meetings, loud laughter, and that
          perfect final reveal that makes the whole room lose it.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#rsvp">
            Board the lobby
          </a>
          <a className="ghost-button" href="#ritual">
            Read tonight&apos;s ritual
          </a>
        </div>
      </div>

      <div className="hero-window">
        <div className="hero-window__header">
          <span className="status-light status-light--hot" aria-hidden="true" />
          <span>Lobby memory buffer</span>
        </div>

        <div className="hero-window__quote">
          &ldquo;Nobody had proof. Everybody had a speech.&rdquo;
        </div>

        <ul className="hero-window__list">
          <li>Dim lights, quick rounds, and a room full of unreliable narrators.</li>
          <li>Warm warning glows and soft visor blues set the emotional temperature.</li>
          <li>The interface feels like a memory capsule, not a stats dashboard.</li>
        </ul>

        <div className="metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <p className="metric-card__label">{metric.label}</p>
              <h2>{metric.value}</h2>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
