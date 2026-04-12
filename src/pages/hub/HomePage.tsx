import type { CSSProperties } from 'react';
import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import {
  featuredPlayers,
  hubGameCards,
  hubHomeFeatures,
  hubHomeMemoryRail,
} from '../../data/hub/hubSelectors';

export function HomePage() {
  return (
    <div className="page page--hub-home">
      <PageIntro
        eyebrow="Gamesnight Hub"
        title="The memory layer for Olympus Prime."
        lede="Discord is still where the night happens. This Hub is where the best parts stay readable later: recaps, recurring players, season memory, and the games worth replaying."
        tags={['Discord first', 'Mobile companion', 'Memory layer']}
      />

      <ModuleFrame
        eyebrow="Right now"
        title={hubHomeFeatures[0]?.title ?? 'Gamesnight memory'}
        lede={hubHomeFeatures[0]?.detail ?? 'Latest recap will appear here.'}
        className="hub-hero-card"
      >
        <div className="hub-feature-stack">
          {hubHomeFeatures.map((feature) => (
            <a className={`hub-feature hub-feature--${feature.tone}`} href={feature.href} key={feature.label}>
              <span>{feature.label}</span>
              <strong>{feature.title}</strong>
              <p>{feature.detail}</p>
            </a>
          ))}
        </div>
      </ModuleFrame>

      <ModuleFrame
        eyebrow="Featured players"
        title="The people who keep the room memorable"
        lede="Recurring players belong at Hub level, even when one game is carrying the loudest energy."
      >
        <div className="hub-player-grid">
          {featuredPlayers.map((player) => (
            <article className={`hub-player-card hub-player-card--${player.tone}`} key={player.id}>
              <div className="hub-player-card__head">
                <span className="hub-player-card__token" style={{ '--player-color': player.colorHex } as CSSProperties} />
                <div>
                  <strong>{player.callsign}</strong>
                  <p>{player.title}</p>
                </div>
              </div>
              <small>{player.badge}</small>
            </article>
          ))}
        </div>
      </ModuleFrame>

      <div className="hub-two-up">
        <ModuleFrame
          eyebrow="Games"
          title="Featured modules"
          lede="Among Us is the flagship, but the shell now belongs to the broader Gamesnight Hub."
        >
          <div className="hub-game-list">
            {hubGameCards.map((game) => (
              <a className={`hub-game-card hub-game-card--${game.tone}`} href={game.href} key={game.id}>
                <span>{game.name}</span>
                <strong>{game.latestLabel}</strong>
                <p>{game.summary}</p>
              </a>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame
          eyebrow="Memory rail"
          title="Fast links from Discord"
          lede="This should feel useful when someone taps in from chat for thirty seconds."
          tone="cool"
        >
          <div className="hub-memory-list">
            {hubHomeMemoryRail.map((item) => (
              <article className="hub-memory-item" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>
      </div>
    </div>
  );
}
