import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useAmongUsModuleData } from '../../../data/games/among-us/amongUsData';
import { ModuleFrame } from '../../../components/ModuleFrame';
import { useAmongUsPublicSyncState } from '../../../hooks/games/among-us/useAmongUsPublicSyncState';

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

export function AmongUsOverviewPage() {
  const [activeMode, setActiveMode] = useState<(typeof simModes)[number]['id']>('lobby');
  const { commandZones } = useAmongUsModuleData();
  const { commandCenter, sync } = useAmongUsPublicSyncState();
  const modeConfig = simModes.find((mode) => mode.id === activeMode) ?? simModes[0];
  const liveRoster = commandCenter.roomRoster.slice(0, 5);
  const nextZones = commandZones.slice(0, 4);
  const liveWhispers =
    activeMode === 'lobby'
      ? commandCenter.commandWhispers.slice(0, 2)
      : activeMode === 'meeting'
        ? commandCenter.commandWhispers.slice(1)
        : [...commandCenter.commandWhispers.slice(2), commandCenter.commandWhispers[0]].filter(Boolean);

  function loadMode(modeId: (typeof simModes)[number]['id']) {
    setActiveMode(modeId);
  }

  return (
    <div className="page page--command-center">
      <section className="module-screen-header" aria-label="Among Us live room">
        <p className="module-screen-header__eyebrow">Among Us</p>
        <h2>Live room</h2>
        <p className="module-screen-header__lede">Check the room before the next button gets hit: who’s loud, who’s clean, and where the table is leaning.</p>

        <div className="module-utility-row" aria-label="Among Us live summary">
          <article>
            <span>Mode</span>
            <strong>{modeConfig.label}</strong>
          </article>
          <article>
            <span>Crew</span>
            <strong>{liveRoster.length} live</strong>
          </article>
          <article>
            <span>Status</span>
            <strong>{sync.phaseLabel}</strong>
          </article>
        </div>
      </section>

      <ModuleFrame tone="warm" className={`command-console command-console--mobile command-console--${activeMode} module-screen-module`}>
        <div className="system-switcher" role="tablist" aria-label="Command states">
          {simModes.map((mode) => (
            <button
              aria-selected={mode.id === activeMode}
              className={`system-switch ${mode.id === activeMode ? 'system-switch--active' : ''}`}
              key={mode.id}
              onClick={() => loadMode(mode.id)}
              role="tab"
              type="button"
            >
              <span>{mode.id === activeMode ? 'Live' : 'Switch'}</span>
              <strong>{mode.title}</strong>
            </button>
          ))}
        </div>

        <div className="command-console__grid">
          <div className={`meeting-core meeting-core--${activeMode}`} key={activeMode}>
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
                    title={`${player.callsign} · ${player.colorName}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="system-stack" key={`stats-${activeMode}`}>
            {commandCenter.commandStats.slice(0, 2).map((stat) => (
              <article className={`system-card system-card--${stat.tone}`} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </ModuleFrame>

      <ModuleFrame className="zone-map zone-map--system zone-map--overview module-screen-module">
        <div className="module-inline-heading">
          <span>Next stops</span>
          <strong>Check the board, crew files, or archive next.</strong>
        </div>

        <div className="zone-grid zone-grid--system">
          {nextZones.map((zone) => (
            <a className={`zone-card zone-card--${zone.tone}`} href={`#${zone.destination}`} key={zone.name}>
              <span>{zone.mood}</span>
              <h4>{zone.name}</h4>
              <p>{zone.description}</p>
            </a>
          ))}
        </div>
      </ModuleFrame>

      <div className="command-flow-stack command-flow-stack--secondary">
        <ModuleFrame className="crew-slot-board module-screen-module">
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

        <ModuleFrame tone="cool" className="command-feed module-screen-module">
          <div className="system-feed" key={`feed-${activeMode}`}>
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
    </div>
  );
}
