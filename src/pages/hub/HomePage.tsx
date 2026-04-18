import type { CSSProperties } from 'react';
import {
  featuredPlayers,
  hubGameCards,
  hubHomeFeatures,
  hubHomeMemoryRail,
} from '../../data/hub/hubSelectors';

export function HomePage() {
  const primaryFeature = hubHomeFeatures[0];
  const supportingFeatures = hubHomeFeatures.slice(1, 3);

  return (
    <div className="page page--hub-home">
      <div className="page-header">
        <h1>Gamesnight Hub</h1>
        <p>The latest night, the people driving it, and the game everyone will click back into first.</p>
      </div>

      {primaryFeature ? (
        <a className="hub-hero-card hub-hero-card--story" href={primaryFeature.href}>
          <div className="hub-hero-card__eyebrow">
            <span className="hub-hero-card__brand">Olympus Prime</span>
            <span className="hub-hero-card__label">{primaryFeature.label}</span>
          </div>
          <strong>{primaryFeature.title}</strong>
          <p>{primaryFeature.detail}</p>

          {supportingFeatures.length ? (
            <div className="hub-hero-card__rail" aria-label="Supporting pulse">
              {supportingFeatures.map((feature) => (
                <span className="hub-hero-card__rail-item" key={feature.title}>
                  <em>{feature.label}</em>
                  <strong>{feature.title}</strong>
                </span>
              ))}
            </div>
          ) : null}
        </a>
      ) : null}

      <section className="hub-home-section" aria-label="People to watch">
        <div className="hub-home-section__header">
          <span>People to watch</span>
        </div>

        <div className="hub-row-list hub-row-list--secondary">
          {featuredPlayers.slice(0, 2).map((player) => (
            <a
              className="hub-player-row"
              href="#/players/profile"
              key={player.id}
              style={{ '--player-color': player.colorHex } as CSSProperties}
            >
              <div className="hub-player-row__info">
                <strong>{player.callsign}</strong>
                <p>{player.title}</p>
              </div>
              <small className="hub-player-row__badge">{player.badge}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="hub-home-section" aria-label="Where the night leads next">
        <div className="hub-home-section__header">
          <span>Where the night leads next</span>
        </div>

        <div className="hub-row-list hub-row-list--secondary">
          {hubGameCards.map((game) => (
            <a className="hub-game-row" href={game.href} key={game.id}>
              <div className="hub-game-row__info">
                <strong>{game.name}</strong>
                <p>{game.summary}</p>
              </div>
              <div className="hub-game-row__meta">
                <span>Latest</span>
                <small>{game.latestLabel}</small>
              </div>
            </a>
          ))}
          {hubHomeMemoryRail.slice(0, 1).map((item) => (
            <div className="hub-memory-row" key={item.title}>
              <span>{item.title}</span>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
