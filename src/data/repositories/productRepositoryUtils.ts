import type {
  OutcomeRecord,
  PublishStateRecord,
  RecapRecord,
  SessionRecord,
} from '../../types/product';
import type { RuntimeProductData, RuntimeSessionBundle } from '../runtimeProductStore';

export function getDefaultScheduledAt(date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  return `${day}T19:00:00+01:00`;
}

export function createEmptyOutcome(sessionId: string): OutcomeRecord {
  return {
    id: `outcome-${sessionId}`,
    sessionId,
    winnerPlayerId: null,
    verdict: '',
    flaggedSummary: '',
    status: 'pending',
  };
}

export function createEmptyRecap(sessionId: string): RecapRecord {
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

export function createEmptyPublishState(sessionId: string): PublishStateRecord {
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

export function buildDraftSessionBundle(
  gameId: string,
  data: RuntimeProductData,
): RuntimeSessionBundle {
  const gameSessions = data.sessions.filter((session) => session.gameId === gameId);
  const nextSessionNumber =
    gameSessions.reduce((max, session) => Math.max(max, session.sessionNumber), 0) + 1;
  const suffix = Date.now().toString(36).slice(-4);
  const sessionId = `session-${String(nextSessionNumber).padStart(2, '0')}-${suffix}`;
  const activeSeason = data.seasons.find((season) => season.status === 'active') ?? data.seasons[0];
  const hostPlayer = data.players[0];

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

  return {
    session,
    participants: [],
    matches: [],
    outcome: createEmptyOutcome(sessionId),
    awards: [],
    quotes: [],
    recap: createEmptyRecap(sessionId),
    media: [],
    publishState: createEmptyPublishState(sessionId),
  };
}
