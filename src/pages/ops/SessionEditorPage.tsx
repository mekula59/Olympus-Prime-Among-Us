import { useState } from 'react';
import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { currentAmongUsOpsSessionId } from '../../data/games/among-us/amongUsOpsData';
import { opsRecapDraft, opsSessionDraft } from '../../data/ops/hubOpsData';

export function SessionEditorPage() {
  const [sessionForm, setSessionForm] = useState(opsSessionDraft);
  const [recapForm, setRecapForm] = useState(opsRecapDraft);

  return (
    <div className="page page--session-editor">
      <PageIntro
        eyebrow="Session editor"
        title="A lightweight editor for the broad record."
        lede="This is the generic Ops lane for hosts who need the session shell, attendance memory, and recap basics without dropping straight into a game-specific engine."
        tags={['Broad record', 'Simple flow', 'Mobile first']}
      />

      <ModuleFrame
        eyebrow="Session basics"
        title={sessionForm.sessionName}
        lede="Fast broad edits first. Game-specific detail can stay inside the module engine."
        className="ops-engine-module"
      >
        <div className="ops-engine-grid">
          <div className="ops-form-stack">
            <div className="ops-field-grid">
              <label className="ops-field">
                <span>Session</span>
                <input
                  onChange={(event) => setSessionForm((current) => ({ ...current, sessionName: event.target.value }))}
                  type="text"
                  value={sessionForm.sessionName}
                />
              </label>
              <label className="ops-field">
                <span>Date</span>
                <input
                  onChange={(event) => setSessionForm((current) => ({ ...current, date: event.target.value }))}
                  type="date"
                  value={sessionForm.date}
                />
              </label>
              <label className="ops-field">
                <span>Room</span>
                <input
                  onChange={(event) => setSessionForm((current) => ({ ...current, room: event.target.value }))}
                  type="text"
                  value={sessionForm.room}
                />
              </label>
              <label className="ops-field">
                <span>Mode</span>
                <input
                  onChange={(event) => setSessionForm((current) => ({ ...current, mode: event.target.value }))}
                  type="text"
                  value={sessionForm.mode}
                />
              </label>
            </div>

            <label className="ops-field">
              <span>Host note</span>
              <textarea
                onChange={(event) => setSessionForm((current) => ({ ...current, notes: event.target.value }))}
                rows={4}
                value={sessionForm.notes}
              />
            </label>
          </div>

          <div className="ops-preview-card">
            <div className="ops-preview-card__header">
              <span>Broad session view</span>
              <strong className="ops-chip-status ops-chip-status--editing">Draft</strong>
            </div>
            <h3>{sessionForm.sessionName}</h3>
            <ul className="ops-preview-list">
              <li>{sessionForm.date || 'Date pending'}</li>
              <li>{sessionForm.room}</li>
              <li>{sessionForm.mode}</li>
              <li>{sessionForm.notes}</li>
            </ul>
          </div>
        </div>
      </ModuleFrame>

      <ModuleFrame
        eyebrow="Recap basics"
        title="Publish prep"
        lede="The generic editor covers the broad memory layer. Among Us-specific flow still lives in its own engine."
        tone="warm"
      >
        <div className="ops-form-stack">
          <label className="ops-field">
            <span>Headline</span>
            <input
              onChange={(event) => setRecapForm((current) => ({ ...current, headline: event.target.value }))}
              type="text"
              value={recapForm.headline}
            />
          </label>
          <label className="ops-field">
            <span>Summary</span>
            <textarea
              onChange={(event) => setRecapForm((current) => ({ ...current, summary: event.target.value }))}
              rows={5}
              value={recapForm.summary}
            />
          </label>
          <div className="hub-placeholder__actions">
            <a className="primary-link" href={`#/ops/among-us/sessions/${currentAmongUsOpsSessionId}`}>
              Open Among Us Engine
            </a>
            <a className="secondary-link" href="#/ops">
              Back to Ops Home
            </a>
          </div>
        </div>
      </ModuleFrame>
    </div>
  );
}
