import type { TransmissionNote } from '../types/content';

interface TransmissionSectionProps {
  notes: TransmissionNote[];
}

export function TransmissionSection({ notes }: TransmissionSectionProps) {
  return (
    <section className="panel transmission" id="rsvp">
      <div className="transmission-copy">
        <p className="section-eyebrow">RSVP signal</p>
        <h2>Step into the lobby before the good seats and better alibis disappear.</h2>
        <p className="section-lede">
          The page is ready for a real RSVP flow later, but the emotional core is already
          here: friends, suspicion, snacks, and the sort of group chemistry that turns a
          quick session into house lore.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#top">
            Re-open transmission
          </a>
          <a className="ghost-button" href="#memory">
            Replay the memories
          </a>
        </div>
      </div>

      <div className="transmission-stack">
        {notes.map((note) => (
          <article className="transmission-card" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
