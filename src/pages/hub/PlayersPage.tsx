import type { CSSProperties } from 'react';
import { hubPlayerCards } from '../../data/hub/hubSelectors';

export function PlayersPage() {
  return (
    <div className="page page--hub-players">
      <div className="page-header">
        <h1>Players</h1>
        <p>See who keeps showing up, who the room remembers, and where to jump back into their history.</p>
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
                <span>Nights</span>
                <strong>{player.attendanceCount}</strong>
              </div>
              <div className="hub-player-row__history">
                <span>Last seen</span>
                <strong>{player.lastSeen}</strong>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
