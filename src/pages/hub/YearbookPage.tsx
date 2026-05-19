import { useHubViewModel } from '../../data/hub/hubSelectors';

export function YearbookPage() {
  const { yearbookEntries } = useHubViewModel();
  const featuredMemory = yearbookEntries[1] ?? yearbookEntries[0];
  const memoryFragments = yearbookEntries.filter((entry) => entry.title !== featuredMemory?.title);

  return (
    <div className="page page--hub-yearbook">
      <section className="hub-yearbook-scene" aria-label="Yearbook opening">
        <div className="page-header">
          <span className="page-header__marker">Culture Vault</span>
          <h1>Culture vault.</h1>
          <p>The vault keeps the lines, wins, plays, calls, and memories that made Olympus Prime feel alive.</p>
        </div>

        {featuredMemory ? (
          <article className={`hub-yearbook-feature hub-yearbook-feature--${featuredMemory.tone}`} tabIndex={0}>
            <div className="hub-yearbook-feature__topline">
              <span>Saved memory</span>
              <small>Held in vault</small>
            </div>

            <blockquote>{featuredMemory.detail}</blockquote>

            <div className="hub-yearbook-feature__footer">
              <strong>{featuredMemory.title}</strong>
              <p>{featuredMemory.note}</p>
            </div>
            <span className="object-activation">Open memory</span>
          </article>
        ) : null}
      </section>

      <section className="hub-yearbook-fragments" aria-label="Vault memories">
        <div className="hub-home-section__header">
          <span>Vault memories</span>
        </div>

        <div className="hub-yearbook-fragments__stack">
          {memoryFragments.map((entry) => (
            <article className={`hub-yearbook-fragment hub-yearbook-fragment--${entry.tone}`} key={entry.title} tabIndex={0}>
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
