import type {
  OpsRecapDraft,
  OpsSessionDraft,
  OpsSummaryCard,
} from '../../types/ops';
import { players, seasons } from '../productSource';
import {
  getLatestOperationalSession,
  getPlayerById,
  getRecapBySessionId,
} from '../productSelectors';

const latestOperationalSession = getLatestOperationalSession();
const latestOperationalRecap = latestOperationalSession
  ? getRecapBySessionId(latestOperationalSession.id)
  : null;

export const currentHubOpsSessionId = latestOperationalSession?.id ?? 'session-09';

export const opsSessionDraft: OpsSessionDraft = latestOperationalSession
  ? {
      sessionName: latestOperationalSession.label,
      date: latestOperationalSession.scheduledAt.slice(0, 10),
      seasonId: latestOperationalSession.seasonId,
      host: getPlayerById(latestOperationalSession.hostPlayerId)?.fullName ?? 'Unassigned host',
      room: latestOperationalSession.venue,
      mode: latestOperationalSession.format,
      attendance: String(latestOperationalSession.attendanceCount),
      winnerId: latestOperationalSession.winningPlayerId ?? players[0]?.id ?? '',
      notes: latestOperationalSession.hostNotes,
      presentPlayerIds: [],
    }
  : {
      sessionName: 'New Olympus Prime session',
      date: '',
      seasonId: seasons[0]?.id ?? '',
      host: '',
      room: '',
      mode: 'Gamesnight session',
      attendance: '0',
      winnerId: players[0]?.id ?? '',
      notes: '',
      presentPlayerIds: [],
    };

export const opsRecapDraft: OpsRecapDraft = latestOperationalRecap
  ? {
      headline: latestOperationalRecap.headline,
      summary: latestOperationalRecap.summary,
      highlight: latestOperationalRecap.highlight,
      publishNote: latestOperationalRecap.publishNote,
    }
  : {
      headline: '',
      summary: '',
      highlight: '',
      publishNote: '',
    };

export const opsSummaryCards: OpsSummaryCard[] = [
  {
    label: 'Next session',
    value: latestOperationalSession
      ? `${latestOperationalSession.label} // ${latestOperationalSession.venue}`
      : 'No draft open',
    detail: latestOperationalSession
      ? 'The broad record is already open so hosts can capture the night before deeper game-level detail is needed.'
      : 'Create the next session shell before the room fills up.',
    tone: 'cool',
  },
  {
    label: 'Recap state',
    value:
      latestOperationalRecap?.status === 'published'
        ? 'Published to Hub'
        : latestOperationalRecap?.status === 'ready'
          ? 'Ready for publish'
          : 'Draft open',
    detail:
      latestOperationalRecap?.publishNote ??
      'The broad Hub recap stays light. Richer game-specific detail can live in the module engine.',
    tone: 'warm',
  },
  {
    label: 'Deep engine',
    value: 'Among Us available',
    detail: 'Use the staged engine only when the session needs richer match, award, and report logging.',
    tone: 'hot',
  },
];
