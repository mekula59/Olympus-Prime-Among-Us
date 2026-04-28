import { useHubViewModel } from '../../data/hub/hubSelectors';

export function YearbookPage() {
  const { yearbookEntries } = useHubViewModel();
  const featuredMemory = yearbookEntries[1] ?? yearbookEntries[0];
  const memoryFragments = yearbookEntries.filter((entry) => entry.title !== featuredMemory?.title);

  return (
    <div className="page page--hub-yearbook">
      <section className="hub-yearbook-scene" aria-label="Yearbook opening">
        <div className="page-header">
          <span className="page-header__marker">Archive Vault</span>
          <h1>Memory archive.</h1>
          <p>The fragments, titles, and remembered lines Olympus Prime keeps carrying forward after the night is over.</p>
        </div>

        {featuredMemory ? (
          <article className={`hub-yearbook-feature hub-yearbook-feature--${featuredMemory.tone}`}>
            <div className="hub-yearbook-feature__topline">
              <span>Recovered fragment</span>
              <small>Held in archive</small>
            </div>

            <blockquote>{featuredMemory.detail}</blockquote>

            <div className="hub-yearbook-feature__footer">
              <strong>{featuredMemory.title}</strong>
              <p>{featuredMemory.note}</p>
            </div>
            <span className="object-activation">Recover fragment</span>
          </article>
        ) : null}
      </section>

      <section className="hub-yearbook-fragments" aria-label="Memory fragments">
        <div className="hub-home-section__header">
          <span>Archive fragments</span>
        </div>

        <div className="hub-yearbook-fragments__stack">
          {memoryFragments.map((entry) => (
            <article className={`hub-yearbook-fragment hub-yearbook-fragment--${entry.tone}`} key={entry.title}>
              <span>{entry.title}</span>
              <strong>{entry.note}</strong>
              <p>{entry.detail}</p>
              <span className="object-activation">Reveal memory</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
