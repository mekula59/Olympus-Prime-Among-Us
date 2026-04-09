import { crewMoods, heroMetrics, memoryBeats, ritualTimeline, transmissionNotes } from './data/siteContent';
import { CrewSection } from './sections/CrewSection';
import { HeroSection } from './sections/HeroSection';
import { MemoryStrip } from './sections/MemoryStrip';
import { RitualSection } from './sections/RitualSection';
import { TransmissionSection } from './sections/TransmissionSection';
import './styles/index.css';

function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Olympus Prime home">
          <img src="/assets/olympus-signal.svg" alt="" />
          <span>
            Olympus Prime
            <strong>gamesnight signal</strong>
          </span>
        </a>

        <nav className="site-nav" aria-label="Section navigation">
          <a href="#memory">Memories</a>
          <a href="#ritual">Ritual</a>
          <a href="#crew">Crew</a>
          <a href="#rsvp">RSVP</a>
        </nav>
      </header>

      <main className="site-main">
        <HeroSection metrics={heroMetrics} />
        <MemoryStrip beats={memoryBeats} />
        <RitualSection stops={ritualTimeline} />
        <CrewSection moods={crewMoods} />
        <TransmissionSection notes={transmissionNotes} />
      </main>

      <footer className="site-footer">
        <p>Olympus Prime Gamesnight</p>
        <p>Built as a nostalgic social-deduction memory capsule with React, Vite, and TypeScript.</p>
      </footer>
    </div>
  );
}

export default App;
