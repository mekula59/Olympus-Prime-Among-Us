import type { CSSProperties } from 'react';
import {
  currentProfileMoments,
  currentProfilePlayer,
  currentProfilePresence,
  currentProfileTimeline,
} from '../../data/hub/hubSelectors';

export function PlayerProfilePage() {
  if (!currentProfilePlayer) {
    return null;
  }

  return (
    <div className="page page--hub-profile">
      <section className="hub-profile-scene" aria-label="Player identity">
        <div className="hub-profile-identity" style={{ '--player-color': currentProfilePlayer.colorHex } as CSSProperties}>
          <div className="hub-profile-identity__hero">
            <span className="hub-profile-identity__token" aria-hidden="true" />
            <div>
              <p className="hub-profile-identity__eyebrow">Olympus Prime regular</p>
              <h1>{currentProfilePlayer.callsign}</h1>
              <strong>{currentProfilePlayer.role}</strong>
            </div>
          </div>

          <p className="hub-profile-identity__summary">{currentProfilePlayer.summary}</p>

          <div className="hub-profile-identity__footer">
            <span>{currentProfilePlayer.title}</span>
            <small>{currentProfilePlayer.badge}</small>
          </div>
        </div>

        <div className="hub-profile-presence" aria-label="Presence summary">
          {currentProfilePresence.map((item) => (
            <article className="hub-profile-presence__item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-profile-memory" aria-label="Personal history">
        <div className="hub-home-section__header">
          <span>Personal history</span>
        </div>

        <div className="hub-profile-timeline">
          {currentProfileTimeline.map((item) => (
            <article className="hub-profile-timeline__item" key={item.label}>
              <span>{item.label}</span>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-profile-support" aria-label="Defining memory layers">
        <div className="hub-home-section__header">
          <span>Defining memory</span>
        </div>

        <div className="hub-profile-support__stack">
          {currentProfileMoments.map((moment) => (
            <article className="hub-profile-support__item" key={moment.label}>
              <span>{moment.label}</span>
              <strong>{moment.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
