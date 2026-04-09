import { SectionShell } from '../components/SectionShell';
import type { MemoryBeat } from '../types/content';

interface MemoryStripProps {
  beats: MemoryBeat[];
}

export function MemoryStrip({ beats }: MemoryStripProps) {
  return (
    <SectionShell
      id="memory"
      eyebrow="Crew memories"
      title="The moments that make the night feel legendary later"
      lede="Each card is a tiny snapshot from the kind of round people keep bringing up long after the lobby closes."
    >
      <div className="memory-grid">
        {beats.map((beat) => (
          <article className="memory-card" key={beat.title}>
            <p className="memory-card__note">{beat.note}</p>
            <h3>{beat.title}</h3>
            <p>{beat.copy}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
