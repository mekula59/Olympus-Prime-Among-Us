import type { CSSProperties } from 'react';
import { useHubViewModel } from '../../data/hub/hubSelectors';

export function PlayersPage() {
  const { hubPlayerCards } = useHubViewModel();

  return (
    <div className="page page--hub-players">
      <div className="page-header">
        <span className="page-header__marker">Dossier Index</span>
        <h1>Champion files.</h1>
        <p>Open the files on the people who show up, talk big, clutch rounds, and become part of the room’s memory.</p>
      </div>

      <div className="hub-row-list">
        {hubPlayerCards.map((player) => (
          <a
            className="hub-player-row hub-player-row--full"
            href="#/players/profile"
            key={player.id}
            style={{ '--player-color': player.colorHex } as CSSProperties}
          >
            <div className="hub-player-row__lead">
              <span className="hub-player-row__token" aria-hidden="true" />
              <div className="hub-player-row__info">
                <strong>{player.callsign}</strong>
                <p>{player.role} · {player.title}</p>
              </div>
            </div>
            <div className="hub-player-row__meta">
              <div className="hub-player-row__history">
                <span>Entries</span>
                <strong>{player.attendanceCount}</strong>
              </div>
              <div className="hub-player-row__history">
                <span>Last signal</span>
                <strong>{player.lastSeen}</strong>
              </div>
            </div>
            <span className="object-activation">Open file</span>
          </a>
        ))}
      </div>
    </div>
  );
}
