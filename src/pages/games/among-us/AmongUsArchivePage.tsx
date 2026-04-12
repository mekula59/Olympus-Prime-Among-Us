import { useState } from 'react';
import { ModuleFrame } from '../../../components/ModuleFrame';
import { PageIntro } from '../../../components/PageIntro';
import { ThresholdMarker } from '../../../components/ThresholdMarker';
import {
  incidentNotes,
  legendEntries,
} from '../../../data/games/among-us/amongUsData';
import { useAmongUsPublicSyncState } from '../../../hooks/games/among-us/useAmongUsPublicSyncState';

const archiveModes = [
  { id: 'legends', label: 'Legends' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'signals', label: 'Signals' },
] as const;

export function AmongUsArchivePage() {
  const { transmissions } = useAmongUsPublicSyncState();
  const [activeMode, setActiveMode] = useState<(typeof archiveModes)[number]['id']>('legends');
  const [featuredLegend, ...legendShelf] = legendEntries;
  const visibleSignals = transmissions.slice(0, 4);
  const visibleIncidents = incidentNotes.slice(0, 4);

  return (
    <div className="page page--among-us-archive">
      <PageIntro
        eyebrow="Among Us archive"
        title="Legends, incidents, and the signals left behind."
        lede="This is the long-tail memory lane for the Among Us module. The loudest sessions become legends, the messiest moments become notes, and the best chatter keeps glowing in the archive."
        tags={['Module archive', 'Replay memory', 'Among Us lore']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--soft">
            <p className="memory-orb__label">Archive mode</p>
            <strong>{archiveModes.find((mode) => mode.id === activeMode)?.label}</strong>
            <span>The module keeps the richer nostalgia here instead of pushing it into the whole Hub shell.</span>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Archive view"
        title="One memory lane, three shelves"
        lede="Switch between the main kinds of Among Us memory without leaving the module."
        className="among-us-archive-switcher"
      >
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
              eyebrow="Featured relic"
              title={featuredLegend.title}
              lede={featuredLegend.result}
              tone={featuredLegend.tone}
              className="legend-monument"
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

          <ThresholdMarker
            eyebrow="Vault shelf"
            title="The rounds that got replayed until they stopped feeling ordinary."
            detail="This lane keeps the richer nostalgia local to the Among Us module."
            tone="hot"
          />

          <div className="archive-grid among-us-archive-grid">
            {legendShelf.map((legend) => (
              <ModuleFrame
                key={legend.title}
                eyebrow={legend.season}
                title={legend.title}
                lede={legend.result}
                tone={legend.tone}
                className="legend-card"
              >
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
          <ThresholdMarker
            eyebrow="Pinned lane"
            title="The notes that stayed messy enough to keep."
            detail="Incidents are useful because they preserve the social wobble, not just the final verdict."
            tone="hot"
          />

          <ModuleFrame
            eyebrow="Pinned threads"
            title="Among Us incident board"
            lede="The archive version keeps the strongest cases and leaves the rest behind."
            className="incident-board among-us-archive-panel"
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
          <ThresholdMarker
            eyebrow="Signal lane"
            title="The afterglow lines worth hearing again."
            detail="Signals are the archive shelf for chatter, recap lines, and room energy that still sounds alive later."
            tone="cool"
          />

          <ModuleFrame
            eyebrow="Speaker wall"
            title="Among Us signals"
            lede="A focused relay stack for the module archive."
            className="transmission-feed among-us-archive-panel"
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
