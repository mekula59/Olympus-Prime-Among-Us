import { yearbookEntries } from '../../data/hub/hubSelectors';

export function YearbookPage() {
  const featuredMemory = yearbookEntries[1] ?? yearbookEntries[0];
  const memoryFragments = yearbookEntries.filter((entry) => entry.title !== featuredMemory?.title);

  return (
    <div className="page page--hub-yearbook">
      <section className="hub-yearbook-scene" aria-label="Yearbook opening">
        <div className="page-header">
          <h1>Yearbook</h1>
          <p>The lines, titles, and moments Olympus Prime keeps carrying forward after the night is over.</p>
        </div>

        {featuredMemory ? (
          <article className={`hub-yearbook-feature hub-yearbook-feature--${featuredMemory.tone}`}>
            <div className="hub-yearbook-feature__topline">
              <span>Remembered line</span>
              <small>Held onto</small>
            </div>

            <blockquote>{featuredMemory.detail}</blockquote>

            <div className="hub-yearbook-feature__footer">
              <strong>{featuredMemory.title}</strong>
              <p>{featuredMemory.note}</p>
            </div>
          </article>
        ) : null}
      </section>

      <section className="hub-yearbook-fragments" aria-label="Memory fragments">
        <div className="hub-home-section__header">
          <span>Kept in orbit</span>
        </div>

        <div className="hub-yearbook-fragments__stack">
          {memoryFragments.map((entry) => (
            <article className={`hub-yearbook-fragment hub-yearbook-fragment--${entry.tone}`} key={entry.title}>
              <span>{entry.title}</span>
              <strong>{entry.note}</strong>
              <p>{entry.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
