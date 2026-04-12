import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { yearbookEntries } from '../../data/hub/hubSelectors';

export function YearbookPage() {
  return (
    <div className="page page--hub-yearbook">
      <PageIntro
        eyebrow="Yearbook"
        title="The moments Olympus Prime keeps."
        lede="This is the hall-of-fame layer for quotes, titles, and story fragments that deserve a calmer home than chat history."
        tags={['Hall of fame', 'Quotes', 'Yearly memory']}
      />

      <ModuleFrame
        eyebrow="Highlights"
        title="What the yearbook remembers first"
        lede="Tasteful, compact, and mobile-first. Big memory energy without forcing a gimmick."
      >
        <div className="hub-yearbook-grid">
          {yearbookEntries.map((entry) => (
            <article className={`hub-yearbook-card hub-yearbook-card--${entry.tone}`} key={entry.title}>
              <span>{entry.title}</span>
              <strong>{entry.note}</strong>
              <p>{entry.detail}</p>
            </article>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
