import type { CSSProperties } from 'react';
import { hubPlayerCards } from '../../data/hub/hubSelectors';

export function PlayersPage() {
  const returningCount = hubPlayerCards.filter((player) => player.attendanceCount >= 3).length;

  return (
    <div className="page page--hub-players">
      <div className="page-header">
        <h1>Players</h1>
        <p>{hubPlayerCards.length} crew · {returningCount} returning</p>
      </div>

      <div className="hub-row-list">
        {hubPlayerCards.map((player) => (
          <a
            className="hub-player-row hub-player-row--full"
            href="#/players/profile"
            key={player.id}
            style={{ '--player-color': player.colorHex } as CSSProperties}
          >
            <div className="hub-player-row__info">
              <strong>{player.callsign}</strong>
              <p>{player.role} · {player.title}</p>
            </div>
            <div className="hub-player-row__meta">
              <small>{player.attendanceCount} nights</small>
              <small>{player.lastSeen}</small>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
