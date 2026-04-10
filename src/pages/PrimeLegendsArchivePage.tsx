import { legendEntries } from '../data/hqData';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import { ThresholdMarker } from '../components/ThresholdMarker';

export function PrimeLegendsArchivePage() {
  const [featuredLegend, ...vaultShelf] = legendEntries;

  return (
    <div className="page page--prime-legends">
      <PageIntro
        eyebrow="Legend vault"
        title="The rounds that outgrew memory and became house lore."
        lede="Not every win becomes a legend. These did. The archive should feel ceremonial, a little playful, and fully convinced the stories deserve their own room."
        tags={['Trophy room', 'Retell archive', 'Ship folklore']}
        aside={
          <div className="memory-orb memory-orb--compact">
            <p className="memory-orb__label">Vault standard</p>
            <strong>If the kitchen retells it for a week, the archive opens a shelf.</strong>
          </div>
        }
      />

      {featuredLegend ? (
        <ModuleFrame
          eyebrow="Featured relic"
          title={`${featuredLegend.title} still glows brighter than the rest of the shelf.`}
          lede="The vault needed a centerpiece that feels half trophy, half story shrine."
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
        eyebrow="Vault shelf one"
        title="Step past the warm relic light and the stories become ritual."
        detail="Every shelf deeper in the vault should feel less recent and more sacred."
        tone="hot"
      />

      <div className="archive-grid">
        {vaultShelf.map((legend) => (
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

        <ModuleFrame
          eyebrow="Open shelf"
          title="Space reserved for the next absurd classic"
          lede="The archive knows another story is on the way."
          className="empty-state-module legend-empty"
        >
          <div className="empty-bay empty-bay--vault">
            <p>No new legend has been stamped into the vault since the last room-shaker.</p>
            <span>Placeholder shelf humming softly.</span>
          </div>
        </ModuleFrame>
      </div>
    </div>
  );
}
