import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import {
  awardAssignments as initialAwardAssignments,
  awardTemplates,
  correctionItems as initialCorrections,
  mediaPlaceholders as initialMediaPlaceholders,
  opsPlayers as initialPlayers,
  opsRecapDraft,
  opsSeasons as initialSeasons,
  opsSessionDraft,
} from '../data/opsData';

const engineStages = [
  { id: 'boot', label: 'Boot Session', short: 'Boot' },
  { id: 'crew', label: 'Load Crew', short: 'Crew' },
  { id: 'matches', label: 'Log Matches', short: 'Matches' },
  { id: 'outcomes', label: 'Resolve Outcomes', short: 'Outcomes' },
  { id: 'awards', label: 'Assign Awards', short: 'Awards' },
  { id: 'report', label: 'Draft Report', short: 'Report' },
  { id: 'transmit', label: 'Transmit to HQ', short: 'Transmit' },
] as const;

type StageId = (typeof engineStages)[number]['id'];

interface MatchLog {
  id: string;
  round: string;
  zone: string;
  result: string;
  note: string;
}

export function OpsConsolePage() {
  const [players, setPlayers] = useState(initialPlayers);
  const [seasons] = useState(initialSeasons);
  const [activeStageId, setActiveStageId] = useState<StageId>('boot');
  const [opsEvent, setOpsEvent] = useState('SESSION ENGINE STANDBY');
  const [sessionState, setSessionState] = useState<'standby' | 'active' | 'locked'>('standby');
  const [reportState, setReportState] = useState<'draft' | 'verified' | 'transmitted'>('draft');
  const [awardHistory, setAwardHistory] = useState(initialAwardAssignments);
  const [mediaQueue, setMediaQueue] = useState(initialMediaPlaceholders);
  const [corrections, setCorrections] = useState(initialCorrections);
  const [sessionForm, setSessionForm] = useState(opsSessionDraft);
  const [recapForm, setRecapForm] = useState(opsRecapDraft);
  const [awardForm, setAwardForm] = useState({
    playerId: initialPlayers[0]?.id ?? '',
    titleId: awardTemplates[0]?.id ?? '',
    reason: 'Called the room before the room called itself.',
  });
  const [matchDraft, setMatchDraft] = useState({
    round: 'Round 01',
    zone: 'Bridge hall',
    result: 'Tense vote',
    note: 'Room split cleanly, then one late sentence flipped the table.',
  });
  const [matches, setMatches] = useState<MatchLog[]>([
    {
      id: 'match-log-1',
      round: 'Round 01',
      zone: 'Bridge hall',
      result: 'Tense vote',
      note: 'Room split cleanly, then one late sentence flipped the table.',
    },
  ]);
  const [outcomeForm, setOutcomeForm] = useState({
    winnerId: sessionForm.winnerId,
    verdict: 'Crew recovered control after one loud final read.',
    flagged: 'One title spelling still needs a fix before transmit.',
  });
  const [transmitChecklist, setTransmitChecklist] = useState({
    reportVerified: false,
    awardsCommitted: false,
    mediaChecked: false,
    fixesChecked: false,
  });

  const activeStage = engineStages.find((stage) => stage.id === activeStageId) ?? engineStages[0];
  const checkedInPlayers = players.filter((player) => sessionForm.presentPlayerIds.includes(player.id));
  const unresolvedCorrections = corrections.filter((item) => item.status !== 'Fixed');

  const stageStatuses = useMemo(
    () => ({
      boot:
        sessionForm.sessionName.trim() && sessionForm.date && sessionForm.room && sessionForm.seasonId
          ? sessionState === 'locked'
            ? 'locked'
            : 'active'
          : 'standby',
      crew: checkedInPlayers.length >= 4 ? 'verified' : 'standby',
      matches: matches.length >= 1 ? 'logged' : 'standby',
      outcomes: outcomeForm.winnerId && outcomeForm.verdict.trim() ? 'resolved' : 'standby',
      awards: awardHistory.length >= 1 ? 'committed' : 'standby',
      report:
        reportState === 'transmitted' ? 'transmitted' : reportState === 'verified' ? 'verified' : 'draft',
      transmit:
        Object.values(transmitChecklist).every(Boolean) && reportState === 'transmitted'
          ? 'complete'
          : 'standby',
    }),
    [
      awardHistory.length,
      checkedInPlayers.length,
      matches.length,
      outcomeForm.verdict,
      outcomeForm.winnerId,
      reportState,
      sessionForm.date,
      sessionForm.room,
      sessionForm.seasonId,
      sessionForm.sessionName,
      sessionState,
      transmitChecklist,
    ],
  );

  function activateStage(stageId: StageId) {
    setActiveStageId(stageId);
    setOpsEvent(`${engineStages.find((stage) => stage.id === stageId)?.short.toUpperCase() ?? 'STAGE'} ACTIVE`);
  }

  function moveStage(direction: 'next' | 'prev') {
    const currentIndex = engineStages.findIndex((stage) => stage.id === activeStageId);
    const nextIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, engineStages.length - 1)
        : Math.max(currentIndex - 1, 0);

    activateStage(engineStages[nextIndex].id);
  }

  function togglePresentPlayer(playerId: string) {
    const player = players.find((entry) => entry.id === playerId);
    setSessionForm((current) => ({
      ...current,
      presentPlayerIds: current.presentPlayerIds.includes(playerId)
        ? current.presentPlayerIds.filter((id) => id !== playerId)
        : [...current.presentPlayerIds, playerId],
    }));
    setOpsEvent(`${player?.callsign.toUpperCase() ?? 'CREW'} VERIFIED`);
  }

  function saveBootState() {
    setSessionState('standby');
    setOpsEvent('SESSION STANDBY');
  }

  function lockSession() {
    setSessionState('locked');
    setOpsEvent('SESSION LOCKED');
  }

  function addMatchLog() {
    if (!matchDraft.note.trim()) {
      return;
    }

    setMatches((current) => [
      ...current,
      { id: `match-log-${current.length + 1}`, ...matchDraft },
    ]);
    setMatchDraft((current) => ({
      ...current,
      round: `Round ${String(matches.length + 2).padStart(2, '0')}`,
      note: '',
    }));
    setOpsEvent('MATCH LOGGED');
  }

  function commitOutcome() {
    setSessionForm((current) => ({ ...current, winnerId: outcomeForm.winnerId }));
    setTransmitChecklist((current) => ({ ...current, fixesChecked: unresolvedCorrections.length === 0 }));
    setOpsEvent('OUTCOME RESOLVED');
  }

  function assignAward() {
    const selectedAward = awardTemplates.find((award) => award.id === awardForm.titleId);
    if (!selectedAward || !awardForm.playerId) {
      return;
    }

    setAwardHistory((current) => [
      {
        id: `award-${current.length + 1}`,
        playerId: awardForm.playerId,
        title: selectedAward.title,
        reason: awardForm.reason,
        state: 'assigned',
      },
      ...current,
    ]);

    setPlayers((current) =>
      current.map((player) =>
        player.id === awardForm.playerId ? { ...player, title: selectedAward.title } : player,
      ),
    );
    setTransmitChecklist((current) => ({ ...current, awardsCommitted: true }));
    setOpsEvent('AWARD COMMITTED');
  }

  function saveReportDraft() {
    setReportState('draft');
    setOpsEvent('REPORT STANDBY');
  }

  function verifyReport() {
    setReportState('verified');
    setTransmitChecklist((current) => ({ ...current, reportVerified: true }));
    setOpsEvent('REPORT VERIFIED');
  }

  function verifyMedia() {
    setMediaQueue((current) =>
      current.map((item) => (item.state === 'waiting' ? { ...item, state: 'ready' } : item)),
    );
    setTransmitChecklist((current) => ({ ...current, mediaChecked: true }));
    setOpsEvent('MEDIA VERIFIED');
  }

  function clearFixes() {
    setCorrections((current) => current.map((item) => ({ ...item, status: 'Fixed' })));
    setTransmitChecklist((current) => ({ ...current, fixesChecked: true }));
    setOpsEvent('FIXES VERIFIED');
  }

  function transmitReport() {
    setReportState('transmitted');
    setTransmitChecklist({
      reportVerified: true,
      awardsCommitted: true,
      mediaChecked: true,
      fixesChecked: true,
    });
    setOpsEvent('HQ TRANSMITTED');
  }

  return (
    <div className="page page--ops-console">
      <PageIntro
        eyebrow="Session engine"
        title="Boot. Load. Log. Resolve. Transmit."
        lede="Hosts should feel like they are running the night through a live system. Each stage is manual on purpose, but the engine makes the next move obvious."
        tags={['ENGINE LIVE', 'HOST RUN', 'STEP STATE']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--system">
            <p className="memory-orb__label">Active stage</p>
            <strong>{activeStage.label}</strong>
            <span>{opsEvent}</span>
          </div>
        }
      />

      <div className="ops-engine-layout">
        <ModuleFrame eyebrow="Engine rail" title="Session flow" lede="Run the system in order." className="ops-engine-rail">
          <div className="system-event-strip system-event-strip--compact">
            <span>Ops event</span>
            <strong>{opsEvent}</strong>
            <small>{sessionForm.sessionName || 'New session shell'} is the live session target.</small>
          </div>

          <div className="engine-stage-list">
            {engineStages.map((stage, index) => (
              <button
                className={`engine-stage ${stage.id === activeStageId ? 'engine-stage--active' : ''}`}
                key={stage.id}
                onClick={() => activateStage(stage.id)}
                type="button"
              >
                <span>0{index + 1}</span>
                <div>
                  <strong>{stage.label}</strong>
                  <small>{stageStatuses[stage.id]}</small>
                </div>
              </button>
            ))}
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
            <ModuleFrame eyebrow="Stage 01" title="Boot Session" lede="Start the session shell and lock the room basics." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <div className="ops-field-grid">
                    <label className="ops-field">
                      <span>Session</span>
                      <input
                        onChange={(event) =>
                          setSessionForm((current) => ({ ...current, sessionName: event.target.value }))
                        }
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
                      <span>Season</span>
                      <select
                        onChange={(event) =>
                          setSessionForm((current) => ({ ...current, seasonId: event.target.value }))
                        }
                        value={sessionForm.seasonId}
                      >
                        {seasons.map((season) => (
                          <option key={season.id} value={season.id}>
                            {season.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="ops-field">
                      <span>Host</span>
                      <input
                        onChange={(event) => setSessionForm((current) => ({ ...current, host: event.target.value }))}
                        type="text"
                        value={sessionForm.host}
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
                      <select
                        onChange={(event) => setSessionForm((current) => ({ ...current, mode: event.target.value }))}
                        value={sessionForm.mode}
                      >
                        <option>Classic deduction</option>
                        <option>Chaos remix</option>
                        <option>Final-round ladder</option>
                      </select>
                    </label>
                  </div>

                  <label className="ops-field">
                    <span>Host note</span>
                    <textarea
                      onChange={(event) => setSessionForm((current) => ({ ...current, notes: event.target.value }))}
                      rows={5}
                      value={sessionForm.notes}
                    />
                  </label>

                  <div className="ops-action-row">
                    <button className="ops-button" onClick={saveBootState} type="button">
                      Standby shell
                    </button>
                    <button className="ops-button ops-button--primary" onClick={lockSession} type="button">
                      Lock session
                    </button>
                  </div>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Session state</span>
                    <strong className={`ops-chip-status ops-chip-status--${sessionState === 'locked' ? 'logged' : sessionState === 'active' ? 'drafted' : 'editing'}`}>
                      {sessionState}
                    </strong>
                  </div>
                  <h3>{sessionForm.sessionName}</h3>
                  <ul className="ops-preview-list">
                    <li>{sessionForm.date || 'Date pending'}</li>
                    <li>{sessionForm.room || 'Room pending'}</li>
                    <li>{sessionForm.mode}</li>
                    <li>{seasons.find((season) => season.id === sessionForm.seasonId)?.currentWeek ?? 'Season pending'}</li>
                  </ul>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'crew' ? (
            <ModuleFrame eyebrow="Stage 02" title="Load Crew" lede="Verify who is in the room before the first real log." className="ops-engine-module">
              <div className="ops-selector-block">
                <p>Checked-in crew</p>
                <div className="ops-pill-grid ops-pill-grid--wide">
                  {players.map((player) => (
                    <button
                      className={`ops-person-pill ${sessionForm.presentPlayerIds.includes(player.id) ? 'ops-person-pill--active' : ''}`}
                      key={player.id}
                      onClick={() => togglePresentPlayer(player.id)}
                      style={{ '--player-color': player.colorHex } as CSSProperties}
                      type="button"
                    >
                      <i aria-hidden="true" />
                      <strong>{player.callsign}</strong>
                      <span>{player.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ops-log-stack">
                {checkedInPlayers.map((player) => (
                  <article className="ops-log-item" key={player.id}>
                    <strong>{player.callsign}</strong>
                    <span>{player.title}</span>
                    <p>{player.lastSeen}</p>
                  </article>
                ))}
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'matches' ? (
            <ModuleFrame eyebrow="Stage 03" title="Log Matches" lede="Structured round logging keeps the recap easy later." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <div className="ops-field-grid">
                    <label className="ops-field">
                      <span>Round</span>
                      <input
                        onChange={(event) => setMatchDraft((current) => ({ ...current, round: event.target.value }))}
                        type="text"
                        value={matchDraft.round}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Zone</span>
                      <input
                        onChange={(event) => setMatchDraft((current) => ({ ...current, zone: event.target.value }))}
                        type="text"
                        value={matchDraft.zone}
                      />
                    </label>
                    <label className="ops-field">
                      <span>Result</span>
                      <input
                        onChange={(event) => setMatchDraft((current) => ({ ...current, result: event.target.value }))}
                        type="text"
                        value={matchDraft.result}
                      />
                    </label>
                  </div>
                  <label className="ops-field">
                    <span>Match note</span>
                    <textarea
                      onChange={(event) => setMatchDraft((current) => ({ ...current, note: event.target.value }))}
                      rows={5}
                      value={matchDraft.note}
                    />
                  </label>
                  <button className="ops-button ops-button--primary" onClick={addMatchLog} type="button">
                    Log match
                  </button>
                </div>

                <div className="ops-log-stack">
                  {matches.map((match) => (
                    <article className="ops-log-item" key={match.id}>
                      <strong>{match.round}</strong>
                      <span>
                        {match.zone} • {match.result}
                      </span>
                      <p>{match.note}</p>
                    </article>
                  ))}
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'outcomes' ? (
            <ModuleFrame eyebrow="Stage 04" title="Resolve Outcomes" lede="Set the winner and flag anything the host still needs to watch." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <label className="ops-field">
                    <span>Winning voice</span>
                    <select
                      onChange={(event) => setOutcomeForm((current) => ({ ...current, winnerId: event.target.value }))}
                      value={outcomeForm.winnerId}
                    >
                      {checkedInPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.callsign}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="ops-field">
                    <span>Outcome note</span>
                    <textarea
                      onChange={(event) => setOutcomeForm((current) => ({ ...current, verdict: event.target.value }))}
                      rows={4}
                      value={outcomeForm.verdict}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Flagged item</span>
                    <textarea
                      onChange={(event) => setOutcomeForm((current) => ({ ...current, flagged: event.target.value }))}
                      rows={3}
                      value={outcomeForm.flagged}
                    />
                  </label>
                  <button className="ops-button ops-button--primary" onClick={commitOutcome} type="button">
                    Resolve outcome
                  </button>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Outcome state</span>
                    <strong className="ops-chip-status ops-chip-status--drafted">resolved</strong>
                  </div>
                  <h3>{players.find((player) => player.id === outcomeForm.winnerId)?.callsign ?? 'Winner pending'}</h3>
                  <div className="ops-preview-note">
                    <span>Verdict</span>
                    <p>{outcomeForm.verdict}</p>
                  </div>
                  <div className="ops-preview-note">
                    <span>Flagged</span>
                    <p>{outcomeForm.flagged}</p>
                  </div>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'awards' ? (
            <ModuleFrame eyebrow="Stage 05" title="Assign Awards" lede="Commit the titles while the room memory is still fresh." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <label className="ops-field">
                    <span>Crew</span>
                    <select
                      onChange={(event) => setAwardForm((current) => ({ ...current, playerId: event.target.value }))}
                      value={awardForm.playerId}
                    >
                      {checkedInPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.callsign}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="ops-field">
                    <span>Title</span>
                    <select
                      onChange={(event) => setAwardForm((current) => ({ ...current, titleId: event.target.value }))}
                      value={awardForm.titleId}
                    >
                      {awardTemplates.map((award) => (
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
                  <button className="ops-button ops-button--primary" onClick={assignAward} type="button">
                    Commit award
                  </button>
                </div>

                <div className="ops-log-stack">
                  {awardHistory.map((award) => (
                    <article className="ops-log-item" key={award.id}>
                      <strong>{players.find((player) => player.id === award.playerId)?.callsign ?? 'Crew'}</strong>
                      <span>{award.title}</span>
                      <p>{award.reason}</p>
                    </article>
                  ))}
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'report' ? (
            <ModuleFrame eyebrow="Stage 06" title="Draft Report" lede="Write the session summary, then verify it for transmit." className="ops-engine-module">
              <div className="ops-engine-grid">
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
                    <span>Report draft</span>
                    <textarea
                      onChange={(event) => setRecapForm((current) => ({ ...current, summary: event.target.value }))}
                      rows={6}
                      value={recapForm.summary}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Highlight</span>
                    <textarea
                      onChange={(event) => setRecapForm((current) => ({ ...current, highlight: event.target.value }))}
                      rows={3}
                      value={recapForm.highlight}
                    />
                  </label>
                  <label className="ops-field">
                    <span>Transmit note</span>
                    <input
                      onChange={(event) => setRecapForm((current) => ({ ...current, publishNote: event.target.value }))}
                      type="text"
                      value={recapForm.publishNote}
                    />
                  </label>
                  <div className="ops-action-row">
                    <button className="ops-button" onClick={saveReportDraft} type="button">
                      Standby draft
                    </button>
                    <button className="ops-button ops-button--primary" onClick={verifyReport} type="button">
                      Verify report
                    </button>
                  </div>
                </div>

                <div className="ops-preview-card">
                  <div className="ops-preview-card__header">
                    <span>Report state</span>
                    <strong className={`ops-chip-status ops-chip-status--${reportState === 'verified' ? 'drafted' : reportState === 'transmitted' ? 'logged' : 'editing'}`}>
                      {reportState}
                    </strong>
                  </div>
                  <h3>{recapForm.headline}</h3>
                  <div className="ops-preview-note">
                    <span>Highlight</span>
                    <p>{recapForm.highlight}</p>
                  </div>
                  <div className="ops-preview-note">
                    <span>Transmit note</span>
                    <p>{recapForm.publishNote}</p>
                  </div>
                </div>
              </div>
            </ModuleFrame>
          ) : null}

          {activeStageId === 'transmit' ? (
            <ModuleFrame eyebrow="Stage 07" title="Transmit to HQ" lede="Verify the final checks, then push the night live." className="ops-engine-module">
              <div className="ops-engine-grid">
                <div className="ops-form-stack">
                  <div className="ops-checklist ops-checklist--engine">
                    <article className={`ops-check ${transmitChecklist.reportVerified ? 'ops-check--complete' : ''}`}>
                      <h4>Report</h4>
                      <p>{transmitChecklist.reportVerified ? 'Verified for HQ' : 'Needs report verification'}</p>
                    </article>
                    <article className={`ops-check ${transmitChecklist.awardsCommitted ? 'ops-check--complete' : ''}`}>
                      <h4>Awards</h4>
                      <p>{transmitChecklist.awardsCommitted ? 'Titles committed' : 'Awards still pending'}</p>
                    </article>
                    <article className={`ops-check ${transmitChecklist.mediaChecked ? 'ops-check--complete' : ''}`}>
                      <h4>Media</h4>
                      <p>{transmitChecklist.mediaChecked ? 'Media verified' : 'Media still waiting'}</p>
                    </article>
                    <article className={`ops-check ${transmitChecklist.fixesChecked ? 'ops-check--complete' : ''}`}>
                      <h4>Fixes</h4>
                      <p>{transmitChecklist.fixesChecked ? 'No flagged blocks' : 'Flagged items remain'}</p>
                    </article>
                  </div>

                  <div className="ops-action-row">
                    <button className="ops-button" onClick={verifyMedia} type="button">
                      Verify media
                    </button>
                    <button className="ops-button" onClick={clearFixes} type="button">
                      Verify fixes
                    </button>
                    <button className="ops-button ops-button--primary" onClick={transmitReport} type="button">
                      Transmit to HQ
                    </button>
                  </div>
                </div>

                <div className="ops-log-stack">
                  {mediaQueue.map((item) => (
                    <article className="ops-log-item" key={item.id}>
                      <strong>{item.name}</strong>
                      <span>
                        {item.type} • {item.state}
                      </span>
                      <p>{item.note}</p>
                    </article>
                  ))}

                  {unresolvedCorrections.map((item) => (
                    <article className="ops-log-item" key={item.id}>
                      <strong>{item.subject}</strong>
                      <span>{item.area}</span>
                      <p>{item.issue}</p>
                    </article>
                  ))}
                </div>
              </div>
            </ModuleFrame>
          ) : null}
        </div>
      </div>
    </div>
  );
}
