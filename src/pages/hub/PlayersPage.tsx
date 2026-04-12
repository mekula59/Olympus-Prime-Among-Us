import type { CSSProperties } from 'react';
import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { hubPlayerCards } from '../../data/hub/hubSelectors';

export function PlayersPage() {
  return (
    <div className="page page--hub-players">
      <PageIntro
        eyebrow="Recurring players"
        title="The people behind the nights."
        lede="This is the broad player layer for Olympus Prime, not a single-game roster. It should feel easy to scan from a phone and easy to jump into from Discord."
        tags={['Cross-game', 'Attendance memory', 'Player first']}
      />

      <ModuleFrame
        eyebrow="Player index"
        title="Regulars and returners"
        lede="A calm directory first. Richer profile memory comes after the tap."
      >
        <div className="hub-directory">
          {hubPlayerCards.map((player) => (
            <a className={`hub-directory-card hub-directory-card--${player.tone}`} href="#/players/profile" key={player.id}>
              <div className="hub-directory-card__head">
                <span className="hub-player-card__token" style={{ '--player-color': player.colorHex } as CSSProperties} />
                <div>
                  <strong>{player.callsign}</strong>
                  <p>{player.role}</p>
                </div>
              </div>
              <small>{player.title}</small>
              <p>{player.summary}</p>
              <div className="hub-directory-card__meta">
                <span>{player.attendanceCount} nights</span>
                <span>{player.lastSeen}</span>
              </div>
            </a>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
