import { useMemo } from 'react';
import type { OpsRecapDraft, OpsSessionDraft, OpsSummaryCard } from '../../types/ops';
import { getRuntimeProductData, useRuntimeProductData } from '../runtimeProductStore';
import {
  getLatestOperationalSession,
  getPlayerById,
  getRecapBySessionId,
  getSessionById,
} from '../productSelectors';

export interface HubOpsDataView {
  currentHubOpsSessionId: string;
  opsSessionDraft: OpsSessionDraft;
  opsRecapDraft: OpsRecapDraft;
  opsSummaryCards: OpsSummaryCard[];
}

function buildEmptySessionDraft() {
  const { players, seasons } = getRuntimeProductData();

  return {
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
  } satisfies OpsSessionDraft;
}

export function getHubOpsData(sessionId?: string): HubOpsDataView {
  const latestOperationalSession = getLatestOperationalSession();
  const activeSession = sessionId ? getSessionById(sessionId) : latestOperationalSession;
  const activeRecap = activeSession ? getRecapBySessionId(activeSession.id) : null;
  const { players } = getRuntimeProductData();

  const opsSessionDraft: OpsSessionDraft = activeSession
    ? {
        sessionName: activeSession.label,
        date: activeSession.scheduledAt.slice(0, 10),
        seasonId: activeSession.seasonId,
        host: getPlayerById(activeSession.hostPlayerId)?.fullName ?? 'Unassigned host',
        room: activeSession.venue,
        mode: activeSession.format,
        attendance: String(activeSession.attendanceCount),
        winnerId: activeSession.winningPlayerId ?? players[0]?.id ?? '',
        notes: activeSession.hostNotes,
        presentPlayerIds: [],
      }
    : buildEmptySessionDraft();

  const opsRecapDraft: OpsRecapDraft = activeRecap
    ? {
        headline: activeRecap.headline,
        summary: activeRecap.summary,
        highlight: activeRecap.highlight,
        publishNote: activeRecap.publishNote,
      }
    : {
        headline: '',
        summary: '',
        highlight: '',
        publishNote: '',
      };

  const opsSummaryCards: OpsSummaryCard[] = [
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
        activeRecap?.status === 'published'
          ? 'Published to Hub'
          : activeRecap?.status === 'ready'
            ? 'Ready for publish'
            : 'Draft open',
      detail:
        activeRecap?.publishNote ??
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

  return {
    currentHubOpsSessionId: activeSession?.id ?? latestOperationalSession?.id ?? 'session-09',
    opsSessionDraft,
    opsRecapDraft,
    opsSummaryCards,
  };
}

export function useHubOpsData(sessionId?: string) {
  const { revision } = useRuntimeProductData();

  return useMemo(() => getHubOpsData(sessionId), [revision, sessionId]);
}

const initialHubOpsData = getHubOpsData();

export const currentHubOpsSessionId = initialHubOpsData.currentHubOpsSessionId;
export const opsSessionDraft = initialHubOpsData.opsSessionDraft;
export const opsRecapDraft = initialHubOpsData.opsRecapDraft;
export const opsSummaryCards = initialHubOpsData.opsSummaryCards;
