import type { CSSProperties } from 'react';
import {
  featuredPlayers,
  hubGameCards,
  hubHomeFeatures,
  hubHomeMemoryRail,
} from '../../data/hub/hubSelectors';

export function HomePage() {
  return (
    <div className="page page--hub-home">
      <div className="page-header">
        <h1>Gamesnight Hub</h1>
        <p>{hubGameCards.length} games · {featuredPlayers.length} featured players</p>
      </div>

      {hubHomeFeatures[0] ? (
        <a className="hub-hero-card" href={hubHomeFeatures[0].href}>
          <span className="hub-hero-card__label">{hubHomeFeatures[0].label}</span>
          <strong>{hubHomeFeatures[0].title}</strong>
          <p>{hubHomeFeatures[0].detail}</p>
        </a>
      ) : null}

      <div className="hub-row-list">
        {featuredPlayers.map((player) => (
          <article
            className="hub-player-row"
            key={player.id}
            style={{ '--player-color': player.colorHex } as CSSProperties}
          >
            <div className="hub-player-row__info">
              <strong>{player.callsign}</strong>
              <p>{player.title}</p>
            </div>
            <small className="hub-player-row__badge">{player.badge}</small>
          </article>
        ))}
      </div>

      <div className="hub-row-list">
        {hubGameCards.map((game) => (
          <a className="hub-game-row" href={game.href} key={game.id}>
            <strong>{game.name}</strong>
            <small>{game.latestLabel}</small>
          </a>
        ))}
        {hubHomeMemoryRail.map((item) => (
          <div className="hub-memory-row" key={item.title}>
            <span>{item.title}</span>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
