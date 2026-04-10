import { incidentNotes } from '../data/hqData';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import { ThresholdMarker } from '../components/ThresholdMarker';

export function IncidentBoardPage() {
  const hotThreads = incidentNotes.filter((note) => note.tone === 'hot').length;
  const unresolvedThreads = incidentNotes.filter((note) => !note.state.includes('Resolved')).length;

  return (
    <div className="page page--incident-board">
      <PageIntro
        eyebrow="Pinboard bay"
        title="A beautiful wall of accusations, annotations, and almost-proof."
        lede="The board should feel handmade and dramatic: pinned notes, thread energy, and every card tilted just enough to feel like someone cared a little too much."
        tags={['Thread wall', 'Pinned suspicion', 'Internal record only']}
        aside={
          <div className="memory-orb memory-orb--compact">
            <p className="memory-orb__label">Board warning</p>
            <strong>Handwriting, thread color, and confidence all count as evidence here.</strong>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Board heat"
        title="Suspicion is climbing faster than certainty tonight."
        lede="This top lane should feel like the moment a hallway whisper turns into a pinned case."
        tone="hot"
        className="incident-alert"
      >
        <div className="incident-alert__layout">
          <div className="incident-siren">
            <span>Current board mood</span>
            <strong>Everybody has a theory. Too many of them sound good.</strong>
          </div>
          <div className="incident-alert__stats">
            <article>
              <span>Open threads</span>
              <strong>{incidentNotes.length}</strong>
            </article>
            <article>
              <span>Hot cases</span>
              <strong>{hotThreads}</strong>
            </article>
            <article>
              <span>Still unresolved</span>
              <strong>{unresolvedThreads}</strong>
            </article>
          </div>
        </div>
      </ModuleFrame>

      <ThresholdMarker
        eyebrow="Pinned lane"
        title="Cross the caution tape and every note starts sounding plausible."
        detail="Danger here is social before it is factual."
        tone="hot"
      />

      <div className="incident-layout">
        <ModuleFrame
          eyebrow="Active threads"
          title="The evidence wall"
          lede="Organized enough to use. Messy enough to trust."
          className="incident-board"
        >
          <div className="incident-grid">
            {incidentNotes.map((note) => (
              <article className={`incident-note incident-note--${note.tone}`} key={note.title}>
                <span>{note.severity}</span>
                <h4>{note.title}</h4>
                <p>{note.detail}</p>
                <small>{note.thread}</small>
                <div className="incident-note__footer">
                  <strong>{note.owner}</strong>
                  <em>{note.state}</em>
                </div>
              </article>
            ))}
          </div>
        </ModuleFrame>

        <div className="stacked-side-modules">
          <ModuleFrame
            eyebrow="Resolved quietly"
            title="Items no longer taking up wall space"
            lede="Even the quiet side should stay in-world."
            tone="cool"
          >
            <div className="resolved-list">
              <p>False accusation chain cleared after replay and hallway testimony.</p>
              <p>Snack-table misunderstanding downgraded from conspiracy to poor timing.</p>
              <p>Button misuse complaint dismissed as passionate enthusiasm.</p>
            </div>
          </ModuleFrame>

          <ModuleFrame
            eyebrow="No new vent disputes"
            title="Clear lane"
            lede="Empty states should still feel like a room, not a placeholder."
            className="empty-state-module"
          >
            <div className="empty-bay empty-bay--threads">
              <p>No additional corridor incidents are waiting for pins tonight.</p>
              <span>Thread reel resting. Wall lights still on.</span>
            </div>
          </ModuleFrame>
        </div>
      </div>
    </div>
  );
}
