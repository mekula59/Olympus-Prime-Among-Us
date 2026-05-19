import { useState } from 'react';
import { ModuleFrame } from '../../../components/ModuleFrame';
import { useAmongUsModuleData } from '../../../data/games/among-us/amongUsData';
import { useAmongUsPublicSyncState } from '../../../hooks/games/among-us/useAmongUsPublicSyncState';

const archiveModes = [
  { id: 'legends', label: 'Legends' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'signals', label: 'Signals' },
] as const;

export function AmongUsArchivePage() {
  const { incidentNotes, legendEntries } = useAmongUsModuleData();
  const { transmissions } = useAmongUsPublicSyncState();
  const [activeMode, setActiveMode] = useState<(typeof archiveModes)[number]['id']>('legends');
  const [featuredLegend, ...legendShelf] = legendEntries;
  const visibleSignals = transmissions.slice(0, 4);
  const visibleIncidents = incidentNotes.slice(0, 4);

  return (
    <div className="page page--among-us-archive">
      <section className="module-screen-header" aria-label="Among Us archive">
        <p className="module-screen-header__eyebrow">Among Us</p>
        <h2>Archive</h2>
        <p className="module-screen-header__lede">Legends, incidents, and saved moments from the sessions people kept talking about.</p>

        <div className="module-utility-row" aria-label="Archive summary">
          <article>
            <span>Mode</span>
            <strong>{archiveModes.find((mode) => mode.id === activeMode)?.label}</strong>
          </article>
          <article>
            <span>Legends</span>
            <strong>{legendEntries.length}</strong>
          </article>
          <article>
            <span>Signals</span>
            <strong>{transmissions.length}</strong>
          </article>
        </div>
      </section>

      <ModuleFrame className="among-us-archive-switcher module-screen-module">
        <div className="system-switcher" role="tablist" aria-label="Archive modes">
          {archiveModes.map((mode) => (
            <button
              className={`system-switch ${mode.id === activeMode ? 'system-switch--active' : ''}`}
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              type="button"
            >
              <span>{mode.id === activeMode ? 'ACTIVE' : 'LOAD'}</span>
              <strong>{mode.label}</strong>
            </button>
          ))}
        </div>
      </ModuleFrame>

      {activeMode === 'legends' ? (
        <>
          {featuredLegend ? (
            <ModuleFrame
              tone={featuredLegend.tone}
              className="legend-monument module-screen-module"
            >
              <div className="legend-monument__layout">
                <div className="legend-monument__seal">
                  <span>{featuredLegend.season}</span>
                  <strong>{featuredLegend.result}</strong>
                </div>
                <div className="legend-monument__story">
                  <p className="legend-monument__myth">{featuredLegend.myth}</p>
                  <blockquote>{featuredLegend.witness}</blockquote>
                  <small>{featuredLegend.relic}</small>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          <div className="archive-grid among-us-archive-grid">
            {legendShelf.map((legend) => (
              <ModuleFrame
                key={legend.title}
                tone={legend.tone}
                className="legend-card module-screen-module"
              >
                <span className="legend-card__eyebrow">{legend.season}</span>
                <h3>{legend.title}</h3>
                <p>{legend.myth}</p>
                <blockquote>{legend.witness}</blockquote>
                <span className="legend-card__relic">{legend.relic}</span>
              </ModuleFrame>
            ))}
          </div>
        </>
      ) : null}

      {activeMode === 'incidents' ? (
        <>
          <ModuleFrame
            className="incident-board among-us-archive-panel module-screen-module"
          >
            <div className="incident-grid">
              {visibleIncidents.map((note) => (
                <article className={`incident-note incident-note--${note.tone}`} key={note.title}>
                  <span>{note.severity}</span>
                  <h4>{note.title}</h4>
                  <p>{note.detail}</p>
                  <small>{note.thread}</small>
                  <div className="incident-note__footer">
                    <strong>{note.owner}</strong>
                    <em>{note.state}</em>
                  </div>
                </article>
              ))}
            </div>
          </ModuleFrame>
        </>
      ) : null}

      {activeMode === 'signals' ? (
        <>
          <ModuleFrame
            className="transmission-feed among-us-archive-panel module-screen-module"
          >
            <div className="transmission-stack">
              {visibleSignals.map((item) => (
                <article className={`transmission-item transmission-item--${item.tone}`} key={`${item.stamp}-${item.title}`}>
                  <div className="transmission-item__meta">
                    <span>{item.channel}</span>
                    <strong>{item.stamp}</strong>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                  <small>{item.author}</small>
                </article>
              ))}
            </div>
          </ModuleFrame>
        </>
      ) : null}
    </div>
  );
}
