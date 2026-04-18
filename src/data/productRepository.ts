import type {
  OutcomeRecord,
  PublishStateRecord,
  RecapRecord,
  SessionRecord,
} from '../types/product';
import type { SessionEngineDraft } from '../types/sessionEngine';
import {
  getLatestOperationalSession,
  getOutcomeBySessionId,
  getPublishStateBySessionId,
  getRecapBySessionId,
  getSessionById,
} from './productSelectors';
import {
  getRuntimeProductData,
  replaceRuntimeSessionBundle,
  upsertRuntimeProductRecords,
} from './runtimeProductStore';

function getDefaultScheduledAt(date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  return `${day}T19:00:00+01:00`;
}

function createEmptyOutcome(sessionId: string): OutcomeRecord {
  return {
    id: `outcome-${sessionId}`,
    sessionId,
    winnerPlayerId: null,
    verdict: '',
    flaggedSummary: '',
    status: 'pending',
  };
}

function createEmptyRecap(sessionId: string): RecapRecord {
  return {
    id: `recap-${sessionId}`,
    sessionId,
    headline: '',
    summary: '',
    highlight: '',
    publishNote: '',
    verdict: '',
    recommendation: '',
    status: 'draft',
  };
}

function createEmptyPublishState(sessionId: string): PublishStateRecord {
  return {
    id: `publish-${sessionId}`,
    sessionId,
    reportStatus: 'draft',
    awardsStatus: 'draft',
    mediaStatus: 'draft',
    publicStatus: 'draft',
    transmittedAt: null,
  };
}

export function createSessionDraftRecord(gameId = 'among-us') {
  const { players, seasons, sessions } = getRuntimeProductData();
  const gameSessions = sessions.filter((session) => session.gameId === gameId);
  const nextSessionNumber =
    gameSessions.reduce((max, session) => Math.max(max, session.sessionNumber), 0) + 1;
  const suffix = Date.now().toString(36).slice(-4);
  const sessionId = `session-${String(nextSessionNumber).padStart(2, '0')}-${suffix}`;
  const activeSeason = seasons.find((season) => season.status === 'active') ?? seasons[0];
  const hostPlayer = players[0];

  const session: SessionRecord = {
    id: sessionId,
    gameId,
    seasonId: activeSeason?.id ?? '',
    label: `Night ${String(nextSessionNumber).padStart(2, '0')} // Pending room`,
    sessionNumber: nextSessionNumber,
    scheduledAt: getDefaultScheduledAt(),
    venue: 'Discord voice room',
    format: gameId === 'among-us' ? 'Among Us session' : 'Gamesnight session',
    hostPlayerId: hostPlayer?.id ?? '',
    status: 'draft',
    attendanceCount: 0,
    winningPlayerId: null,
    hostNotes: '',
  };

  replaceRuntimeSessionBundle({
    session,
    participants: [],
    matches: [],
    outcome: createEmptyOutcome(sessionId),
    awards: [],
    quotes: [],
    recap: createEmptyRecap(sessionId),
    media: [],
    publishState: createEmptyPublishState(sessionId),
  });

  return session;
}

export function saveGenericSessionEditor(
  sessionId: string,
  payload: {
    sessionName: string;
    date: string;
    room: string;
    mode: string;
    notes: string;
    headline: string;
    summary: string;
    highlight: string;
    publishNote: string;
  },
) {
  const existingSession = getSessionById(sessionId);
  if (!existingSession) {
    throw new Error(`Missing session record for ${sessionId}`);
  }

  const nextSession: SessionRecord = {
    ...existingSession,
    label: payload.sessionName.trim() || existingSession.label,
    scheduledAt: payload.date
      ? `${payload.date}T19:00:00+01:00`
      : existingSession.scheduledAt,
    venue: payload.room.trim() || existingSession.venue,
    format: payload.mode.trim() || existingSession.format,
    hostNotes: payload.notes,
    status: existingSession.status === 'planned' ? 'draft' : existingSession.status,
  };

  const recap = getRecapBySessionId(sessionId) ?? createEmptyRecap(sessionId);
  const publishState = getPublishStateBySessionId(sessionId) ?? createEmptyPublishState(sessionId);

  upsertRuntimeProductRecords({
    sessions: [nextSession],
    recaps: [
      {
        ...recap,
        headline: payload.headline,
        summary: payload.summary,
        highlight: payload.highlight,
        publishNote: payload.publishNote,
        status: recap.status === 'published' ? 'published' : 'draft',
      },
    ],
    publishStates: [publishState],
  });
}

export function persistSessionEngineDraft(draft: SessionEngineDraft) {
  replaceRuntimeSessionBundle({
    session: draft.session,
    participants: draft.participants,
    matches: draft.matches,
    outcome: draft.outcome,
    awards: draft.awards,
    quotes: draft.quotes,
    recap: draft.recap,
    media: draft.media,
    publishState: draft.publishState,
  });
}

export function getDefaultHubOpsSessionId() {
  return getLatestOperationalSession()?.id ?? 'session-09';
}
