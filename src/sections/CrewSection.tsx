import { SectionShell } from '../components/SectionShell';
import type { CrewMood } from '../types/content';

interface CrewSectionProps {
  moods: CrewMood[];
}

export function CrewSection({ moods }: CrewSectionProps) {
  return (
    <SectionShell
      id="crew"
      eyebrow="Crew energy"
      title="Built for every kind of player the room becomes"
      lede="Olympus Prime gamesnight works because the personalities are as memorable as the rounds themselves."
    >
      <div className="crew-grid">
        {moods.map((mood) => (
          <article className="crew-card" key={mood.title}>
            <p className="crew-card__badge">{mood.badge}</p>
            <h3>{mood.title}</h3>
            <p>{mood.copy}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
