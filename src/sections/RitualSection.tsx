import { SectionShell } from '../components/SectionShell';
import type { RitualStop } from '../types/content';

interface RitualSectionProps {
  stops: RitualStop[];
}

export function RitualSection({ stops }: RitualSectionProps) {
  return (
    <SectionShell
      id="ritual"
      eyebrow="Tonight's ritual"
      title="A gamesnight arc designed for story beats, not just rounds"
      lede="The pacing is built to rise naturally from easy banter to wild accusations, then land on a final round nobody wants to end."
    >
      <div className="timeline">
        {stops.map((stop) => (
          <article className="timeline-card" key={`${stop.slot}-${stop.title}`}>
            <p className="timeline-card__slot">{stop.slot}</p>
            <div>
              <h3>{stop.title}</h3>
              <p>{stop.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
