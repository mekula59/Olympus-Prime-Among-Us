import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  bridgeReadouts,
  commandStats,
  commandWhispers,
  commandZones,
  crewRankings,
} from '../data/hqData';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';

const simModes = [
  {
    id: 'lobby',
    label: 'Lobby',
    title: 'Room open',
    detail: 'Names stack up. Colors matter. Everyone sounds too relaxed.',
    action: 'Load board',
  },
  {
    id: 'meeting',
    label: 'Meeting',
    title: 'Button hit',
    detail: 'Voices spike. Calm people feel suspicious. The room needs a call.',
    action: 'Lock table',
  },
  {
    id: 'vote',
    label: 'Vote',
    title: 'Choice phase',
    detail: 'Nobody wants the blame. Everybody wants the room to agree.',
    action: 'Cast read',
  },
] as const;

export function CommandCenterPage() {
  const [activeMode, setActiveMode] = useState<(typeof simModes)[number]['id']>('lobby');
  const [systemEvent, setSystemEvent] = useState('LOBBY LOADED');
  const modeConfig = simModes.find((mode) => mode.id === activeMode) ?? simModes[0];
  const liveRoster = crewRankings.slice(0, 5);
  const liveWhispers =
    activeMode === 'lobby'
      ? commandWhispers.slice(0, 2)
      : activeMode === 'meeting'
        ? commandWhispers.slice(1)
        : [...commandWhispers.slice(2), commandWhispers[0]];

  function loadMode(modeId: (typeof simModes)[number]['id']) {
    setActiveMode(modeId);
    setSystemEvent(
      modeId === 'meeting' ? 'MEETING LOCKED' : modeId === 'vote' ? 'VOTE ACTIVE' : 'LOBBY LOADED',
    );
  }

  return (
    <div className="page page--command-center">
      <PageIntro
        eyebrow="Control room"
        title="Lobby. Meeting. Vote. Repeat."
        lede="Olympus Prime should feel less like a themed site and more like a live social-deduction system. This room now runs like a match console: short labels, loud states, and one mode change away from chaos."
        tags={['SIM LIVE', 'ROOM OPEN', 'STATE DRIVEN']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--system">
            <p className="memory-orb__label">Room pulse</p>
            <strong>{modeConfig.title}</strong>
            <span>{modeConfig.detail}</span>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Core state"
        title="Command sim"
        lede="Every press should feel like the room changed."
        tone="warm"
        className="command-console"
      >
        <div className="system-event-strip">
          <span>Event</span>
          <strong>{systemEvent}</strong>
          <small>{modeConfig.detail}</small>
        </div>

        <div className="system-switcher" role="tablist" aria-label="Command states">
          {simModes.map((mode) => (
            <button
              className={`system-switch ${mode.id === activeMode ? 'system-switch--active' : ''}`}
              key={mode.id}
              onClick={() => loadMode(mode.id)}
              type="button"
            >
              <span>{mode.id === activeMode ? 'ACTIVE' : 'LOAD'}</span>
              <strong>{mode.title}</strong>
            </button>
          ))}
        </div>

        <div className="command-console__grid">
          <div className={`meeting-core meeting-core--${activeMode}`}>
            <div className="meeting-core__button">
              <span>{modeConfig.label}</span>
              <strong>{modeConfig.action}</strong>
            </div>

            <div className="meeting-core__status">
              <p>{modeConfig.detail}</p>
              <div className="crew-lights" aria-label="Live crew colors">
                {liveRoster.map((player) => (
                  <span
                    className="crew-light"
                    key={player.id}
                    style={{ '--player-color': player.colorHex } as CSSProperties}
                    title={`${player.callsign} // ${player.colorName}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="system-stack">
            {commandStats.map((stat) => (
              <article className={`system-card system-card--${stat.tone}`} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </ModuleFrame>

      <div className="two-up-grid command-two-up">
        <ModuleFrame
          eyebrow="Live slots"
          title="Room colors"
          lede="A match feels alive when the players feel like pieces in it."
          className="crew-slot-board"
        >
          <div className="crew-slot-grid">
            {liveRoster.map((player) => (
              <article className="crew-slot" key={player.id}>
                <span
                  className="crew-slot__token"
                  style={{ '--player-color': player.colorHex } as CSSProperties}
                />
                <div>
                  <strong>{player.callsign}</strong>
                  <p>{player.badge}</p>
                </div>
                <small>{player.wins}W</small>
              </article>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame
          eyebrow="Room feed"
          title="Hot lines"
          lede="Short reads. Live feeling."
          tone="cool"
          className="command-feed"
        >
          <div className="system-feed">
            {liveWhispers.map((item) => (
              <article className="system-feed__item" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}

            {bridgeReadouts.map((item) => (
              <article className="system-feed__item system-feed__item--readout" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>
      </div>

      <ModuleFrame
        eyebrow="Quick load"
        title="Jump room"
        lede="Each load target should feel like a system destination, not a content page."
        className="zone-map zone-map--system"
      >
        <div className="zone-grid zone-grid--system">
          {commandZones.map((zone) => (
            <a className={`zone-card zone-card--${zone.tone}`} href={`#/${zone.destination}`} key={zone.name}>
              <span>{zone.mood}</span>
              <h4>{zone.name}</h4>
              <p>{zone.description}</p>
              <small>LOAD</small>
            </a>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
