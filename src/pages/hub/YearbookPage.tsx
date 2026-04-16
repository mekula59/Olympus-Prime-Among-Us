import { ModuleFrame } from '../../components/ModuleFrame';
import { yearbookEntries } from '../../data/hub/hubSelectors';

export function YearbookPage() {
  return (
    <div className="page page--hub-yearbook">
      <section className="hub-screen-header" aria-label="Yearbook overview">
        <p className="hub-screen-header__eyebrow">Yearbook</p>
        <h2>Hall of fame</h2>
        <p className="hub-screen-header__lede">The moments, lines, and titles worth keeping outside the Discord scroll.</p>

        <div className="hub-utility-row" aria-label="Yearbook summary">
          <article>
            <span>Entries</span>
            <strong>{yearbookEntries.length}</strong>
          </article>
          <article>
            <span>Latest</span>
            <strong>{yearbookEntries[0]?.title ?? 'No entry yet'}</strong>
          </article>
          <article>
            <span>Type</span>
            <strong>Quotes & moments</strong>
          </article>
        </div>
      </section>

      <ModuleFrame className="hub-list-module">
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
