import type { CSSProperties } from 'react';
import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import {
  currentProfileMoments,
  currentProfilePlayer,
} from '../../data/hub/hubSelectors';

export function PlayerProfilePage() {
  if (!currentProfilePlayer) {
    return null;
  }

  return (
    <div className="page page--hub-profile">
      <PageIntro
        eyebrow="Player profile"
        title={`${currentProfilePlayer.callsign}, beyond one game.`}
        lede="This base profile is the shared identity page for a recurring Olympus Prime player. It starts broad here, and later can branch into game-specific memories underneath."
        tags={['Identity', 'Attendance', 'Game memory']}
      />

      <ModuleFrame
        eyebrow="Profile"
        title={currentProfilePlayer.name}
        lede={currentProfilePlayer.role}
        tone={currentProfilePlayer.tone}
        className="hub-profile-card"
      >
        <div className="hub-profile-card__hero">
          <span className="hub-profile-card__token" style={{ '--player-color': currentProfilePlayer.colorHex } as CSSProperties} />
          <div>
            <strong>{currentProfilePlayer.callsign}</strong>
            <p>{currentProfilePlayer.title}</p>
          </div>
        </div>

        <p className="hub-profile-card__summary">{currentProfilePlayer.summary}</p>

        <div className="hub-stat-row">
          <article>
            <span>Attendance</span>
            <strong>{currentProfilePlayer.attendanceCount}</strong>
          </article>
          <article>
            <span>Last seen</span>
            <strong>{currentProfilePlayer.lastSeen}</strong>
          </article>
          <article>
            <span>Featured game</span>
            <strong>Among Us</strong>
          </article>
        </div>
      </ModuleFrame>

      <ModuleFrame
        eyebrow="Profile memory"
        title="What the room remembers"
        lede="This stays broad at Hub level while the game-specific memory remains nested in its module."
      >
        <div className="hub-memory-list">
          {currentProfileMoments.map((moment) => (
            <article className="hub-memory-item" key={moment.label}>
              <span>{moment.label}</span>
              <p>{moment.value}</p>
            </article>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
