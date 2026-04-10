import { useState } from 'react';
import type { CSSProperties } from 'react';
import { crewProfiles } from '../data/hqData';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';

const fileModes = [
  { id: 'read', label: 'Read' },
  { id: 'tells', label: 'Tells' },
  { id: 'circle', label: 'Circle' },
] as const;

export function CrewFilePage() {
  const [activeCrewId, setActiveCrewId] = useState(crewProfiles[0]?.id ?? '');
  const [fileMode, setFileMode] = useState<(typeof fileModes)[number]['id']>('read');
  const [fileEvent, setFileEvent] = useState('FILE LOADED');
  const activeProfile = crewProfiles.find((profile) => profile.id === activeCrewId) ?? crewProfiles[0];

  if (!activeProfile) {
    return null;
  }

  const fileEntries =
    fileMode === 'tells'
      ? activeProfile.tells
      : fileMode === 'circle'
        ? activeProfile.trustCircle
        : activeProfile.habits;

  const fileTitle =
    fileMode === 'tells' ? 'Known tells' : fileMode === 'circle' ? 'Trust ring' : 'Pattern read';

  function loadCrewFile(crewId: string) {
    const nextProfile = crewProfiles.find((profile) => profile.id === crewId);
    setActiveCrewId(crewId);
    setFileEvent(`${nextProfile?.callsign.toUpperCase() ?? 'FILE'} LOADED`);
  }

  function switchFileMode(modeId: (typeof fileModes)[number]['id']) {
    setFileMode(modeId);
    setFileEvent(
      modeId === 'tells' ? 'TELLS VERIFIED' : modeId === 'circle' ? 'TRUST RING ACTIVE' : 'READ PATTERN ACTIVE',
    );
  }

  return (
    <div className="page page--crew-file">
      <PageIntro
        eyebrow="File console"
        title="Pick a color. Load a file."
        lede="This room should behave like a social-deduction console, not a profile page. Select a player, flip the file mode, and watch the room logic change around them."
        tags={['FILE LIVE', 'SELECT CREW', 'ROOM READ']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--system">
            <p className="memory-orb__label">File mode</p>
            <strong>{fileTitle}</strong>
            <span>Each tab should feel like another system layer coming online.</span>
          </div>
        }
      />

      <div className="crew-file-layout crew-file-layout--system">
        <ModuleFrame
          eyebrow="Roster"
          title="Crew load"
          lede="Pick the color first. Read the room second."
          className="crew-selector crew-selector--system"
        >
          <div className="system-event-strip system-event-strip--compact">
            <span>File event</span>
            <strong>{fileEvent}</strong>
            <small>{activeProfile.callsign} is the live file target.</small>
          </div>

          <div className="crew-selector__stack crew-selector__stack--system">
            {crewProfiles.map((profile) => (
              <button
                className={`crew-chip ${profile.id === activeProfile.id ? 'crew-chip--active' : ''}`}
                key={profile.id}
                onClick={() => loadCrewFile(profile.id)}
                style={{ '--player-color': profile.colorHex } as CSSProperties}
                type="button"
              >
                <span className="crew-chip__token" />
                <div>
                  <strong>{profile.callsign}</strong>
                  <small>{profile.rank}</small>
                </div>
                <em>{profile.colorName}</em>
              </button>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame
          eyebrow="Loaded"
          title={activeProfile.callsign}
          lede={activeProfile.role}
          tone={activeProfile.tone}
          className="dossier-panel dossier-panel--system"
        >
          <div className="dossier-hero dossier-hero--system">
            <div className="dossier-hero__id">
              <span
                className="dossier-hero__token"
                style={{ '--player-color': activeProfile.colorHex } as CSSProperties}
              />
              <div>
                <strong>{activeProfile.name}</strong>
                <p>{activeProfile.status}</p>
              </div>
            </div>

            <div className="dossier-badge">
              <span>Move</span>
              <strong>{activeProfile.signatureMove}</strong>
            </div>
          </div>

          <p className="dossier-quote dossier-quote--system">{activeProfile.quote}</p>

          <div className="system-switcher" role="tablist" aria-label="Crew file modes">
            {fileModes.map((mode) => (
              <button
                className={`system-switch ${mode.id === fileMode ? 'system-switch--active' : ''}`}
                key={mode.id}
                onClick={() => switchFileMode(mode.id)}
                type="button"
              >
                <span>{mode.id === fileMode ? 'ACTIVE' : 'LOAD'}</span>
                <strong>{mode.label}</strong>
              </button>
            ))}
          </div>

          <div className="dossier-columns dossier-columns--system">
            <div className="dossier-block dossier-block--system">
              <h4>Bio</h4>
              <p>{activeProfile.bio}</p>
              <h4>Alibi</h4>
              <p>{activeProfile.alibiStyle}</p>
            </div>

            <div className="dossier-block dossier-block--system">
              <h4>{fileTitle}</h4>
              <ul className="file-list">
                {fileEntries.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>
        </ModuleFrame>
      </div>

      <ModuleFrame
        eyebrow="Effect"
        title="Room impact"
        lede="The file should answer one question fast: what happens to the room when this person speaks?"
        tone={activeProfile.tone}
        className="dossier-scanrail dossier-scanrail--system"
      >
        <div className="scan-pills scan-pills--system">
          <article className="scan-pill">
            <span>Read</span>
            <strong>{activeProfile.alibiStyle}</strong>
          </article>
          <article className="scan-pill">
            <span>Ring</span>
            <strong>{activeProfile.trustCircle.length} linked crew</strong>
          </article>
          <article className="scan-pill">
            <span>Tell</span>
            <strong>{activeProfile.tells[0]}</strong>
          </article>
        </div>
      </ModuleFrame>
    </div>
  );
}
