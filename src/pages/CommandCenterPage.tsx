import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  commandZones,
} from '../data/games/among-us/amongUsData';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import { useAmongUsPublicSyncState } from '../hooks/games/among-us/useAmongUsPublicSyncState';

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
  const { commandCenter, shell, sync } = useAmongUsPublicSyncState();
  const modeConfig = simModes.find((mode) => mode.id === activeMode) ?? simModes[0];
  const liveRoster = commandCenter.roomRoster.slice(0, 5);
  const liveWhispers =
    activeMode === 'lobby'
      ? commandCenter.commandWhispers.slice(0, 2)
      : activeMode === 'meeting'
        ? commandCenter.commandWhispers.slice(1)
        : [...commandCenter.commandWhispers.slice(2), commandCenter.commandWhispers[0]].filter(Boolean);

  function loadMode(modeId: (typeof simModes)[number]['id']) {
    setActiveMode(modeId);
    setSystemEvent(
      modeId === 'meeting' ? 'MEETING LOCKED' : modeId === 'vote' ? 'VOTE ACTIVE' : 'LOBBY LOADED',
    );
  }

  return (
    <div className="page page--command-center">
      <PageIntro
        eyebrow="Tonight"
        title="Lobby, meeting, vote."
        lede={`${shell.detail} The home screen should feel like the match companion you check between rounds: quick to read, easy to press, and still warm with social-deduction tension.`}
        tags={[sync.phaseLabel, 'Live room', 'Crew loaded']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--soft">
            <p className="memory-orb__label">Up next</p>
            <strong>{shell.title}</strong>
            <span>{sync.phaseDetail}</span>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Live room"
        title={modeConfig.title}
        lede="One strong focus card, one clear mode row, one quick glance at the people driving the night."
        tone="warm"
        className="command-console command-console--mobile"
      >
        <div className="system-event-strip">
          <span>Live update</span>
          <strong>{systemEvent}</strong>
          <small>{sync.runtimeEnabled ? `${shell.statusLabel} // ${modeConfig.detail}` : modeConfig.detail}</small>
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
            {commandCenter.commandStats.slice(0, 3).map((stat) => (
              <article className={`system-card system-card--${stat.tone}`} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </ModuleFrame>

      <div className="command-flow-stack">
        <ModuleFrame
          eyebrow="Crew"
          title="Who the room is watching"
          lede="Keep the player colors close to the top so the screen feels alive before you read a single stat."
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
          eyebrow="Feed"
          title="What the room sounds like"
          lede="Short lines, fast reads, no extra chrome."
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

            {commandCenter.bridgeReadouts.map((item) => (
              <article className="system-feed__item system-feed__item--readout" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>
      </div>

      <ModuleFrame
        eyebrow="Explore"
        title="Jump to the next room"
        lede="Keep the map simple and thumb-friendly."
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
