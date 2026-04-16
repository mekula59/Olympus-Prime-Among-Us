import { useState } from 'react';
import type { CSSProperties } from 'react';
import { crewProfiles } from '../../../data/games/among-us/amongUsData';
import { ModuleFrame } from '../../../components/ModuleFrame';

const fileModes = [
  { id: 'read', label: 'Read' },
  { id: 'tells', label: 'Tells' },
  { id: 'circle', label: 'Circle' },
] as const;

export function AmongUsPlayersPage() {
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
      <section className="module-screen-header" aria-label="Among Us player files">
        <p className="module-screen-header__eyebrow">Among Us</p>
        <h2>Player files</h2>
        <p className="module-screen-header__lede">Pick a color, load the file, and skim the useful cues fast.</p>

        <div className="module-utility-row" aria-label="Player file summary">
          <article>
            <span>Loaded</span>
            <strong>{activeProfile.callsign}</strong>
          </article>
          <article>
            <span>Mode</span>
            <strong>{fileTitle}</strong>
          </article>
          <article>
            <span>Status</span>
            <strong>{activeProfile.status}</strong>
          </article>
        </div>
      </section>

      <div className="crew-file-layout crew-file-layout--system">
        <ModuleFrame className="crew-selector crew-selector--system module-screen-module">
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

        <ModuleFrame tone={activeProfile.tone} className="dossier-panel dossier-panel--system module-screen-module">
          <div className="system-event-strip system-event-strip--compact">
            <span>File update</span>
            <strong>{fileEvent}</strong>
            <small>{activeProfile.callsign} is the live file target.</small>
          </div>

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

      <ModuleFrame tone={activeProfile.tone} className="dossier-scanrail dossier-scanrail--system module-screen-module">
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
