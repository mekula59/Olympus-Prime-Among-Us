import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ModuleFrame } from '../../../components/ModuleFrame';
import { PageIntro } from '../../../components/PageIntro';
import { useSessionEngine } from '../../../hooks/useSessionEngine';

export function AmongUsOpsEnginePage() {
  const engine = useSessionEngine();
  const { stages, activeStageId, eventLabel, draft, derived, actions } = engine;

  const [matchDraft, setMatchDraft] = useState({
    title: 'Bridge hall split',
    locationLabel: 'Bridge hall',
    resultLabel: 'Tense vote',
    summary: 'Room split cleanly, then one late sentence flipped the table.',
  });
  const [awardForm, setAwardForm] = useState({
    playerId: derived.checkedInPlayers[0]?.id ?? derived.players[0]?.id ?? '',
    definitionId: derived.awardTemplates[0]?.id ?? '',
    reason: 'Called the room before the room called itself.',
  });

  const activeStage = stages.find((stage) => stage.id === activeStageId) ?? stages[0];
  const winnerPlayer = derived.players.find((player) => player.id === draft.outcome.winnerPlayerId);

  const stageCards = useMemo(
    () =>
      stages.map((stage, index) => ({
        ...stage,
        index,
        status: derived.statuses[stage.id],
      })),
    [derived.statuses, stages],
  );

  function moveStage(direction: 'next' | 'prev') {
    const currentIndex = stages.findIndex((stage) => stage.id === activeStageId);
    const nextIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, stages.length - 1)
        : Math.max(currentIndex - 1, 0);

    actions.activateStage(stages[nextIndex].id);
  }

  return (
    <div className="page page--ops-console">
      <PageIntro
        eyebrow="Session engine"
        title="Boot. Load. Log. Resolve. Transmit."
        lede="Hosts are now running a staged engine tied directly to the canonical session records. Each step updates source-of-truth draft state first, then drives public readiness from there."
        tags={['ENGINE LIVE', 'SOURCE FIRST', 'HQ READY']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--system">
            <p className="memory-orb__label">Active stage</p>
            <strong>{activeStage.label}</strong>
            <span>{eventLabel}</span>
          </div>
        }
      />

      <div className="ops-engine-layout">
        <ModuleFrame eyebrow="Engine rail" title="Session flow" lede="Each stage maps to canonical records." className="ops-engine-rail">
          <div className="system-event-strip system-event-strip--compact">
            <span>Ops event</span>
            <strong>{eventLabel}</strong>
            <small>{draft.session.label} is the live draft record.</small>
          </div>

          <div className="engine-stage-list">
            {stageCards.map((stage) => (
              <button
                className={`engine-stage ${stage.id === activeStageId ? 'engine-stage--active' : ''}`}
                key={stage.id}
                onClick={() => actions.activateStage(stage.id)}
                type="button"
              >
                <span>0{stage.index + 1}</span>
                <div>
                  <strong>{stage.label}</strong>
                  <small>{stage.status}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="ops-preview-note">
            <span>Source of truth</span>
            <p>{activeStage.sourceOfTruth.join(' + ')}</p>
          </div>

          <div className="ops-preview-note">
            <span>Public outputs</span>
            <p>{activeStage.publicOutputs.join(' + ')}</p>
          </div>

          <div className="engine-stage-actions">
            <button className="ops-button" onClick={() => moveStage('prev')} type="button">
              Previous stage
            </button>
            <button className="ops-button ops-button--primary" onClick={() => moveStage('next')} type="button">
              Load next stage
            </button>
          </div>
        </ModuleFrame>

        <div className="ops-engine-stage">
          {activeStageId === 'boot' ? (
            <ModuleFrame eyebrow="Stage 01" title="Boot Session" lede="Writes to the session draft record." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <div className="ops-field-grid">
                    <label className="ops-field">
                      <span>Session</span>
                      <input
                        onChange={(event) => actions.updateSession('label', event.target.value)}
                        type="text"
                        value={draft.session.label}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Date</span>
                      <input
                        onChange={(event) => actions.updateSession('scheduledAt', `${event.target.value}T19:00:00+01:00`)}
                        type="date"
                        value={draft.session.scheduledAt.slice(0, 10)}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Season</span>
                      <select
                        onChange={(event) => actions.updateSession('seasonId', event.target.value)}
                        value={draft.session.seasonId}
                      >
                        {derived.seasons.map((season) => (
                          <option key={season.id} value={season.id}>
                            {season.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="ops-field">
                      <span>Room</span>
                      <input
                        onChange={(event) => actions.updateSession('venue', event.target.value)}
                        type="text"
                        value={draft.session.venue}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Mode</span>
                      <input
                        onChange={(event) => actions.updateSession('format', event.target.value)}
                        type="text"
                        value={draft.session.format}
                      />
                    </label>
                  </div>

                  <label className="ops-field">
                    <span>Host note</span>
                    <textarea
                      onChange={(event) => actions.updateSession('hostNotes', event.target.value)}
                      rows={5}
                      value={draft.session.hostNotes}
                    />
                  </label>

                  <div className="ops-action-row">
                    <button className="ops-button" onClick={actions.saveBoot} type="button">
                      Standby shell
                    </button>
                    <button className="ops-button ops-button--primary" onClick={actions.lockSession} type="button">
                      Lock session
                    </button>
                  </div>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Session record</span>
                    <strong className={`ops-chip-status ops-chip-status--${draft.session.status === 'published' || draft.session.status === 'logged' ? 'logged' : 'editing'}`}>
                      {draft.session.status}
                    </strong>
                  </div>
                  <h3>{draft.session.label}</h3>
                  <ul className="ops-preview-list">
                    <li>{draft.session.scheduledAt.slice(0, 10)}</li>
                    <li>{draft.session.venue}</li>
                    <li>{draft.session.format}</li>
                    <li>{draft.session.hostNotes}</li>
                  </ul>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'crew' ? (
            <ModuleFrame eyebrow="Stage 02" title="Load Crew" lede="Writes to session participant records." className="ops-engine-module">
              <div className="ops-selector-block">
                <p>Present crew</p>
                <div className="ops-pill-grid ops-pill-grid--wide">
                  {derived.players.map((player) => {
                    const active = draft.participants.some(
                      (participant) =>
                        participant.playerId === player.id &&
                        (participant.attendanceStatus === 'present' || participant.attendanceStatus === 'host'),
                    );

                    return (
                      <button
                        className={`ops-person-pill ${active ? 'ops-person-pill--active' : ''}`}
                        key={player.id}
                        onClick={() => actions.toggleParticipant(player.id)}
                        style={{ '--player-color': player.colorHex } as CSSProperties}
                        type="button"
                      >
                        <i aria-hidden="true" />
                        <strong>{player.callsign}</strong>
                        <span>{player.role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'matches' ? (
            <ModuleFrame eyebrow="Stage 03" title="Log Matches" lede="Writes to match records and later feeds mission logs." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <div className="ops-field-grid">
                    <label className="ops-field">
                      <span>Title</span>
                      <input
                        onChange={(event) => setMatchDraft((current) => ({ ...current, title: event.target.value }))}
                        type="text"
                        value={matchDraft.title}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Zone</span>
                      <input
                        onChange={(event) => setMatchDraft((current) => ({ ...current, locationLabel: event.target.value }))}
                        type="text"
                        value={matchDraft.locationLabel}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Result</span>
                      <input
                        onChange={(event) => setMatchDraft((current) => ({ ...current, resultLabel: event.target.value }))}
                        type="text"
                        value={matchDraft.resultLabel}
                      />
                    </label>
                  </div>

                  <label className="ops-field">
                    <span>Match note</span>
                    <textarea
                      onChange={(event) => setMatchDraft((current) => ({ ...current, summary: event.target.value }))}
                      rows={5}
                      value={matchDraft.summary}
                    />
                  </label>

                  <button className="ops-button ops-button--primary" onClick={() => actions.addMatch(matchDraft)} type="button">
                    Log match
                  </button>
                </div>

                <div className="ops-log-stack">
                  {draft.matches.map((match) => (
                    <article className="ops-log-item" key={match.id}>
                      <strong>{match.title}</strong>
                      <span>
                        {match.locationLabel} • {match.resultLabel}
                      </span>
                      <p>{match.summary}</p>
                    </article>
                  ))}
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'outcomes' ? (
            <ModuleFrame eyebrow="Stage 04" title="Resolve Outcomes" lede="Writes to the outcome record and updates the session winner." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <label className="ops-field">
                    <span>Winner</span>
                    <select
                      onChange={(event) =>
                        actions.resolveOutcome({
                          winnerPlayerId: event.target.value,
                          verdict: draft.outcome.verdict,
                          flaggedSummary: draft.outcome.flaggedSummary,
                        })
                      }
                      value={draft.outcome.winnerPlayerId ?? ''}
                    >
                      {derived.checkedInPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.callsign}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="ops-field">
                    <span>Verdict</span>
                    <textarea
                      onChange={(event) =>
                        actions.resolveOutcome({
                          winnerPlayerId: draft.outcome.winnerPlayerId,
                          verdict: event.target.value,
                          flaggedSummary: draft.outcome.flaggedSummary,
                        })
                      }
                      rows={4}
                      value={draft.outcome.verdict}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Flagged</span>
                    <textarea
                      onChange={(event) =>
                        actions.resolveOutcome({
                          winnerPlayerId: draft.outcome.winnerPlayerId,
                          verdict: draft.outcome.verdict,
                          flaggedSummary: event.target.value,
                        })
                      }
                      rows={3}
                      value={draft.outcome.flaggedSummary}
                    />
                  </label>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Outcome record</span>
                    <strong className="ops-chip-status ops-chip-status--drafted">{draft.outcome.status}</strong>
                  </div>
                  <h3>{winnerPlayer?.callsign ?? 'Winner pending'}</h3>
                  <div className="ops-preview-note">
                    <span>Verdict</span>
                    <p>{draft.outcome.verdict}</p>
                  </div>
                  <div className="ops-preview-note">
                    <span>Flagged</span>
                    <p>{draft.outcome.flaggedSummary}</p>
                  </div>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'awards' ? (
            <ModuleFrame eyebrow="Stage 05" title="Assign Awards" lede="Writes to award records and drives title visibility." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <label className="ops-field">
                    <span>Player</span>
                    <select
                      onChange={(event) => setAwardForm((current) => ({ ...current, playerId: event.target.value }))}
                      value={awardForm.playerId}
                    >
                      {derived.checkedInPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.callsign}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="ops-field">
                    <span>Title</span>
                    <select
                      onChange={(event) => setAwardForm((current) => ({ ...current, definitionId: event.target.value }))}
                      value={awardForm.definitionId}
                    >
                      {derived.awardTemplates.map((award) => (
                        <option key={award.id} value={award.id}>
                          {award.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="ops-field">
                    <span>Reason</span>
                    <textarea
                      onChange={(event) => setAwardForm((current) => ({ ...current, reason: event.target.value }))}
                      rows={4}
                      value={awardForm.reason}
                    />
                  </label>
                  <button
                    className="ops-button ops-button--primary"
                    onClick={() => actions.assignAward(awardForm)}
                    type="button"
                  >
                    Commit award
                  </button>
                </div>

                <div className="ops-log-stack">
                  {draft.awards.map((award) => (
                    <article className="ops-log-item" key={award.id}>
                      <strong>{derived.players.find((player) => player.id === award.playerId)?.callsign ?? 'Crew'}</strong>
                      <span>{derived.awardTemplates.find((template) => template.id === award.definitionId)?.title ?? 'Title'}</span>
                      <p>{award.reason}</p>
                    </article>
                  ))}
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'report' ? (
            <ModuleFrame eyebrow="Stage 06" title="Draft Report" lede="Writes to recap records and drives report readiness." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <label className="ops-field">
                    <span>Headline</span>
                    <input
                      onChange={(event) => actions.updateRecap('headline', event.target.value)}
                      type="text"
                      value={draft.recap.headline}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Summary</span>
                    <textarea
                      onChange={(event) => actions.updateRecap('summary', event.target.value)}
                      rows={6}
                      value={draft.recap.summary}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Highlight</span>
                    <textarea
                      onChange={(event) => actions.updateRecap('highlight', event.target.value)}
                      rows={3}
                      value={draft.recap.highlight}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Publish note</span>
                    <input
                      onChange={(event) => actions.updateRecap('publishNote', event.target.value)}
                      type="text"
                      value={draft.recap.publishNote}
                    />
                  </label>
                  <div className="ops-action-row">
                    <button className="ops-button" onClick={actions.saveReportDraft} type="button">
                      Standby draft
                    </button>
                    <button className="ops-button ops-button--primary" onClick={actions.verifyReport} type="button">
                      Verify report
                    </button>
                  </div>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Recap record</span>
                    <strong className={`ops-chip-status ops-chip-status--${draft.publishState.reportStatus === 'verified' ? 'drafted' : draft.publishState.reportStatus === 'transmitted' ? 'logged' : 'editing'}`}>
                      {draft.publishState.reportStatus}
                    </strong>
                  </div>
                  <h3>{draft.recap.headline}</h3>
                  <div className="ops-preview-note">
                    <span>Highlight</span>
                    <p>{draft.recap.highlight}</p>
                  </div>
                  <div className="ops-preview-note">
                    <span>Publish note</span>
                    <p>{draft.recap.publishNote}</p>
                  </div>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'transmit' ? (
            <ModuleFrame eyebrow="Stage 07" title="Transmit to HQ" lede="Writes to publish-state records and final public visibility." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <div className="ops-checklist ops-checklist--engine">
                    <article className={`ops-check ${draft.publishState.reportStatus !== 'draft' ? 'ops-check--complete' : ''}`}>
                      <h4>Report</h4>
                      <p>{draft.publishState.reportStatus}</p>
                    </article>
                    <article className={`ops-check ${draft.publishState.awardsStatus !== 'draft' ? 'ops-check--complete' : ''}`}>
                      <h4>Awards</h4>
                      <p>{draft.publishState.awardsStatus}</p>
                    </article>
                    <article className={`ops-check ${draft.publishState.mediaStatus !== 'draft' ? 'ops-check--complete' : ''}`}>
                      <h4>Media</h4>
                      <p>{draft.publishState.mediaStatus}</p>
                    </article>
                    <article className={`ops-check ${derived.unresolvedCorrections.length === 0 ? 'ops-check--complete' : ''}`}>
                      <h4>Fixes</h4>
                      <p>{derived.unresolvedCorrections.length === 0 ? 'verified' : 'flagged'}</p>
                    </article>
                  </div>

                  <div className="ops-action-row">
                    <button className="ops-button" onClick={actions.verifyMedia} type="button">
                      Verify media
                    </button>
                    <button className="ops-button" onClick={actions.verifyFixes} type="button">
                      Verify fixes
                    </button>
                    <button className="ops-button ops-button--primary" onClick={actions.transmitHQ} type="button">
                      Transmit to HQ
                    </button>
                  </div>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Publish state</span>
                    <strong className={`ops-chip-status ops-chip-status--${draft.publishState.publicStatus === 'transmitted' ? 'logged' : derived.publishReady ? 'drafted' : 'editing'}`}>
                      {draft.publishState.publicStatus}
                    </strong>
                  </div>
                  <ul className="ops-preview-list">
                    <li>Report: {draft.publishState.reportStatus}</li>
                    <li>Awards: {draft.publishState.awardsStatus}</li>
                    <li>Media: {draft.publishState.mediaStatus}</li>
                    <li>Public: {draft.publishState.publicStatus}</li>
                  </ul>
                </div>
              </div>
            </ModuleFrame>
          ) : null}
        </div>
      </div>
    </div>
  );
}
