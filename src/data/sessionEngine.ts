import { useEffect, useMemo, useReducer } from 'react';
import { useAuthState } from '../auth/authStore';
import type { CorrectionItem } from '../types/ops';
import type {
  AttendanceStatus,
  QuoteRecord,
  RecapRecord,
  SessionParticipantRecord,
  SessionRecord,
} from '../types/product';
import type {
  SessionEngineDraft,
  SessionEngineStageDefinition,
  SessionEngineStageId,
  SessionEngineStatusMap,
} from '../types/sessionEngine';
import { getActiveProductRepositoryDriver, persistSessionEngineDraft } from './productRepository';
import { getAmongUsOpsData } from './games/among-us/amongUsOpsData';
import { replaceRuntimeSessionBundle } from './runtimeProductStore';
import {
  getAwardsBySessionId,
  getLatestOperationalSession,
  getMediaBySessionId,
  getMatchesBySessionId,
  getOutcomeBySessionId,
  getParticipantsBySessionId,
  getPublishStateBySessionId,
  getQuotesBySessionId,
  getRecapBySessionId,
  getSessionById,
} from './productSelectors';

function getDefaultSessionId() {
  return getLatestOperationalSession('among-us')?.id ?? 'session-09';
}

const SESSION_ENGINE_REMOTE_AUTOSAVE_DELAY_MS = 900;

export const sessionEngineStages: SessionEngineStageDefinition[] = [
  {
    id: 'boot',
    label: 'Boot Session',
    short: 'Boot',
    sourceOfTruth: ['sessions'],
    publicOutputs: ['mission header', 'command room status'],
  },
  {
    id: 'crew',
    label: 'Load Crew',
    short: 'Crew',
    sourceOfTruth: ['session_participants'],
    publicOutputs: ['crew presence', 'player visibility'],
  },
  {
    id: 'matches',
    label: 'Log Matches',
    short: 'Matches',
    sourceOfTruth: ['matches', 'quotes'],
    publicOutputs: ['mission logs', 'legend candidates'],
  },
  {
    id: 'outcomes',
    label: 'Resolve Outcomes',
    short: 'Outcomes',
    sourceOfTruth: ['outcomes'],
    publicOutputs: ['winner state', 'flagged review state'],
  },
  {
    id: 'awards',
    label: 'Assign Awards',
    short: 'Awards',
    sourceOfTruth: ['awards'],
    publicOutputs: ['crew rankings', 'player titles'],
  },
  {
    id: 'report',
    label: 'Draft Report',
    short: 'Report',
    sourceOfTruth: ['recaps', 'quotes'],
    publicOutputs: ['mission report', 'transmission-ready summary'],
  },
  {
    id: 'transmit',
    label: 'Transmit to HQ',
    short: 'Transmit',
    sourceOfTruth: ['media_uploads', 'publish_state'],
    publicOutputs: ['public HQ visibility', 'publish readiness'],
  },
];

interface SessionEngineState {
  activeStageId: SessionEngineStageId;
  eventLabel: string;
  draft: SessionEngineDraft;
  corrections: CorrectionItem[];
}

type SessionEngineAction =
  | { type: 'load_session'; sessionId: string }
  | { type: 'activate_stage'; stageId: SessionEngineStageId }
  | { type: 'update_session'; field: keyof SessionRecord; value: string | number | null }
  | { type: 'toggle_participant'; playerId: string }
  | { type: 'save_boot' }
  | { type: 'lock_session' }
  | { type: 'add_match'; payload: { title: string; locationLabel: string; resultLabel: string; summary: string } }
  | { type: 'resolve_outcome'; payload: { winnerPlayerId: string | null; verdict: string; flaggedSummary: string } }
  | { type: 'assign_award'; payload: { playerId: string; definitionId: string; reason: string } }
  | { type: 'update_recap'; field: keyof RecapRecord; value: string }
  | { type: 'save_report_draft' }
  | { type: 'verify_report' }
  | { type: 'verify_media' }
  | { type: 'verify_fixes' }
  | { type: 'transmit_hq' };

function buildInitialDraft(sessionId: string): SessionEngineDraft {
  const session = getSessionById(sessionId);
  if (!session) {
    throw new Error(`Missing session seed for ${sessionId}`);
  }

  return {
    session: { ...session },
    participants: getParticipantsBySessionId(sessionId).map((participant) => ({ ...participant })),
    matches: getMatchesBySessionId(sessionId).map((match) => ({ ...match })),
    outcome: {
      ...(getOutcomeBySessionId(sessionId) ?? {
        id: `outcome-${sessionId}`,
        sessionId,
        winnerPlayerId: session.winningPlayerId,
        verdict: '',
        flaggedSummary: '',
        status: 'pending' as const,
      }),
    },
    awards: getAwardsBySessionId(sessionId).map((award) => ({ ...award })),
    quotes: getQuotesBySessionId(sessionId).map((quote) => ({ ...quote })),
    recap: {
      ...(getRecapBySessionId(sessionId) ?? {
        id: `recap-${sessionId}`,
        sessionId,
        headline: '',
        summary: '',
        highlight: '',
        publishNote: '',
        verdict: '',
        recommendation: '',
        status: 'draft' as const,
      }),
    },
    media: getMediaBySessionId(sessionId).map((item) => ({ ...item })),
    publishState: {
      ...(getPublishStateBySessionId(sessionId) ?? {
        id: `publish-${sessionId}`,
        sessionId,
        reportStatus: 'draft' as const,
        awardsStatus: 'draft' as const,
        mediaStatus: 'draft' as const,
        publicStatus: 'draft' as const,
        transmittedAt: null,
      }),
    },
  };
}

function getStageEvent(stageId: SessionEngineStageId) {
  return `${sessionEngineStages.find((stage) => stage.id === stageId)?.short.toUpperCase() ?? 'STAGE'} ACTIVE`;
}

function engineReducer(state: SessionEngineState, action: SessionEngineAction): SessionEngineState {
  const { opsPlayers, awardTemplates } = getAmongUsOpsData(state.draft.session.id);

  switch (action.type) {
    case 'load_session':
      return {
        activeStageId: 'boot',
        eventLabel: 'SESSION ENGINE STANDBY',
        draft: buildInitialDraft(action.sessionId),
        corrections: getAmongUsOpsData(action.sessionId).correctionItems.map((item) => ({ ...item })),
      };
    case 'activate_stage':
      return { ...state, activeStageId: action.stageId, eventLabel: getStageEvent(action.stageId) };
    case 'update_session':
      return {
        ...state,
        draft: {
          ...state.draft,
          session: { ...state.draft.session, [action.field]: action.value },
        },
      };
    case 'toggle_participant':
      return {
        ...state,
        eventLabel: `${opsPlayers.find((player) => player.id === action.playerId)?.callsign.toUpperCase() ?? 'CREW'} VERIFIED`,
        draft: (() => {
          const participants: SessionParticipantRecord[] = state.draft.participants.map((participant) => {
            if (participant.playerId !== action.playerId) {
              return participant;
            }

            const attendanceStatus: AttendanceStatus =
              participant.attendanceStatus === 'present' || participant.attendanceStatus === 'host'
                ? 'guest'
                : 'present';

            return {
              ...participant,
              attendanceStatus,
            };
          });
          const attendanceCount = participants.filter(
            (participant) =>
              participant.attendanceStatus === 'present' || participant.attendanceStatus === 'host',
          ).length;

          return {
            ...state.draft,
            session: { ...state.draft.session, attendanceCount },
            participants,
          };
        })(),
      };
    case 'save_boot':
      return {
        ...state,
        eventLabel: 'SESSION STANDBY',
        draft: {
          ...state.draft,
          session: { ...state.draft.session, status: 'draft' },
        },
      };
    case 'lock_session':
      return {
        ...state,
        eventLabel: 'SESSION LOCKED',
        draft: {
          ...state.draft,
          session: { ...state.draft.session, status: 'logged' },
        },
      };
    case 'add_match':
      return {
        ...state,
        eventLabel: 'MATCH LOGGED',
        draft: {
          ...state.draft,
          matches: [
            ...state.draft.matches,
            {
              id: `match-${state.draft.session.id}-${state.draft.matches.length + 1}`,
              sessionId: state.draft.session.id,
              sequence: state.draft.matches.length + 1,
              title: action.payload.title,
              locationLabel: action.payload.locationLabel,
              tagLabel: `Round ${String(state.draft.matches.length + 1).padStart(2, '0')}`,
              resultLabel: action.payload.resultLabel,
              summary: action.payload.summary,
              detail: action.payload.summary,
              artifactLabel: 'Pending archive review.',
              tone: 'warm',
              legendCandidate: false,
            },
          ],
          quotes: [
            ...state.draft.quotes,
            {
              id: `quote-${state.draft.session.id}-${state.draft.matches.length + 1}`,
              speakerLabel: 'Host log',
              playerId: null,
              sessionId: state.draft.session.id,
              matchId: `match-${state.draft.session.id}-${state.draft.matches.length + 1}`,
              context: 'incident',
              channel: null,
              locationLabel: action.payload.locationLabel,
              stamp: null,
              text: action.payload.summary,
              tone: 'warm',
            },
          ],
        },
      };
    case 'resolve_outcome':
      return {
        ...state,
        eventLabel: 'OUTCOME RESOLVED',
        draft: {
          ...state.draft,
          session: { ...state.draft.session, winningPlayerId: action.payload.winnerPlayerId },
          outcome: {
            ...state.draft.outcome,
            winnerPlayerId: action.payload.winnerPlayerId,
            verdict: action.payload.verdict,
            flaggedSummary: action.payload.flaggedSummary,
            status: 'resolved',
          },
        },
      };
    case 'assign_award': {
      return {
        ...state,
        eventLabel: 'AWARD COMMITTED',
        draft: {
          ...state.draft,
          awards: [
            {
              id: `award-${state.draft.session.id}-${state.draft.awards.length + 1}`,
              sessionId: state.draft.session.id,
              playerId: action.payload.playerId,
              awardType: 'title',
              definitionId: action.payload.definitionId,
              reason: action.payload.reason,
              state: 'assigned',
            },
            ...state.draft.awards,
          ],
          publishState: { ...state.draft.publishState, awardsStatus: 'verified' },
        },
      };
    }
    case 'update_recap':
      return {
        ...state,
        draft: {
          ...state.draft,
          recap: { ...state.draft.recap, [action.field]: action.value },
          quotes:
            action.field === 'highlight'
              ? [
                  ...state.draft.quotes.filter((quote) => quote.context !== 'recap'),
                  {
                    id: `quote-recap-${state.draft.session.id}`,
                    speakerLabel: 'HQ recap',
                    playerId: state.draft.outcome.winnerPlayerId,
                    sessionId: state.draft.session.id,
                    matchId: null,
                    context: 'recap',
                    channel: 'Post-round',
                    locationLabel: null,
                    stamp: null,
                    text: action.value,
                    tone: 'warm',
                  },
                ]
              : state.draft.quotes,
        },
      };
    case 'save_report_draft':
      return {
        ...state,
        eventLabel: 'REPORT STANDBY',
        draft: {
          ...state.draft,
          recap: { ...state.draft.recap, status: 'draft' },
          publishState: { ...state.draft.publishState, reportStatus: 'draft' },
        },
      };
    case 'verify_report':
      return {
        ...state,
        eventLabel: 'REPORT VERIFIED',
        draft: {
          ...state.draft,
          recap: { ...state.draft.recap, status: 'ready' },
          publishState: { ...state.draft.publishState, reportStatus: 'verified' },
        },
      };
    case 'verify_media':
      return {
        ...state,
        eventLabel: 'MEDIA VERIFIED',
        draft: {
          ...state.draft,
          media: state.draft.media.map((item) =>
            item.status === 'placeholder' ? { ...item, status: 'ready' } : item,
          ),
          publishState: { ...state.draft.publishState, mediaStatus: 'verified' },
        },
      };
    case 'verify_fixes':
      return {
        ...state,
        eventLabel: 'FIXES VERIFIED',
        corrections: state.corrections.map((item) => ({ ...item, status: 'Fixed' })),
      };
    case 'transmit_hq':
      return {
        ...state,
        eventLabel: 'HQ TRANSMITTED',
        draft: {
          ...state.draft,
          session: { ...state.draft.session, status: 'published' },
          outcome: { ...state.draft.outcome, status: 'published' },
          recap: { ...state.draft.recap, status: 'published' },
          awards: state.draft.awards.map((award) => ({ ...award, state: 'published' })),
          media: state.draft.media.map((item) =>
            item.status === 'ready' ? { ...item, status: 'published' } : item,
          ),
          publishState: {
            ...state.draft.publishState,
            reportStatus: 'transmitted',
            awardsStatus: 'transmitted',
            mediaStatus: 'transmitted',
            publicStatus: 'transmitted',
            transmittedAt: new Date().toISOString(),
          },
        },
      };
    default:
      return state;
  }
}

function getEngineStatuses(draft: SessionEngineDraft, corrections: CorrectionItem[]): SessionEngineStatusMap {
  const checkedInCount = draft.participants.filter(
    (participant) => participant.attendanceStatus === 'present' || participant.attendanceStatus === 'host',
  ).length;
  const unresolvedFixes = corrections.filter((item) => item.status !== 'Fixed').length;

  return {
    boot:
      draft.session.label.trim() && draft.session.scheduledAt && draft.session.venue
        ? draft.session.status === 'published' || draft.session.status === 'logged'
          ? 'locked'
          : 'active'
        : 'standby',
    crew: checkedInCount > 0 ? 'verified' : 'standby',
    matches: draft.matches.length > 0 ? 'logged' : 'standby',
    outcomes: draft.outcome.status === 'pending' ? 'standby' : 'resolved',
    awards: draft.awards.length > 0 ? 'committed' : 'standby',
    report:
      draft.publishState.reportStatus === 'transmitted'
        ? 'transmitted'
        : draft.publishState.reportStatus === 'verified'
          ? 'verified'
          : 'draft',
    transmit:
      draft.publishState.publicStatus === 'transmitted'
        ? 'complete'
        : draft.publishState.reportStatus === 'verified' &&
            draft.publishState.awardsStatus !== 'draft' &&
            draft.publishState.mediaStatus !== 'draft' &&
            unresolvedFixes === 0
          ? 'ready'
          : 'standby',
  };
}

export function useSessionEngine(sessionId = getDefaultSessionId()) {
  const resolvedSessionId = sessionId || getDefaultSessionId();
  const auth = useAuthState();
  const [state, dispatch] = useReducer(engineReducer, {
    activeStageId: 'boot' as SessionEngineStageId,
    eventLabel: 'SESSION ENGINE STANDBY',
    draft: buildInitialDraft(resolvedSessionId),
    corrections: getAmongUsOpsData(resolvedSessionId).correctionItems.map((item) => ({ ...item })),
  });

  const { opsPlayers, opsSeasons, awardTemplates } = getAmongUsOpsData(state.draft.session.id);

  useEffect(() => {
    if (state.draft.session.id !== resolvedSessionId) {
      dispatch({ type: 'load_session', sessionId: resolvedSessionId });
    }
  }, [resolvedSessionId, state.draft.session.id]);

  useEffect(() => {
    replaceRuntimeSessionBundle({
      session: state.draft.session,
      participants: state.draft.participants,
      matches: state.draft.matches,
      outcome: state.draft.outcome,
      awards: state.draft.awards,
      quotes: state.draft.quotes,
      recap: state.draft.recap,
      media: state.draft.media,
      publishState: state.draft.publishState,
    });
  }, [state.draft]);

  useEffect(() => {
    const repositoryDriver = getActiveProductRepositoryDriver();
    const requiresAuth = repositoryDriver === 'supabase';
    const canWriteOps = !requiresAuth || (auth.status === 'ready' && auth.isMember);

    if (!canWriteOps) {
      return;
    }

    if (repositoryDriver !== 'supabase') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      persistSessionEngineDraft(state.draft);
    }, SESSION_ENGINE_REMOTE_AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [auth.isMember, auth.status, state.draft]);

  const statuses = useMemo(
    () => getEngineStatuses(state.draft, state.corrections),
    [state.corrections, state.draft],
  );

  const participantsByPresence = state.draft.participants.filter(
    (participant) => participant.attendanceStatus === 'present' || participant.attendanceStatus === 'host',
  );

  const playersWithDraftTitles = opsPlayers.map((player) => {
    const latestAssignedTitle = state.draft.awards.find(
      (award) => award.playerId === player.id && award.awardType === 'title',
    );

    return {
      ...player,
      title:
        latestAssignedTitle
          ? awardTemplates.find((template) => template.id === latestAssignedTitle.definitionId)?.title ??
            player.title
          : player.title,
    };
  });

  const derived = useMemo(
    () => ({
      players: playersWithDraftTitles,
      seasons: opsSeasons,
      awardTemplates,
      checkedInPlayers: playersWithDraftTitles.filter((player) =>
        participantsByPresence.some((participant) => participant.playerId === player.id),
      ),
      statuses,
      corrections: state.corrections,
      unresolvedCorrections: state.corrections.filter((item) => item.status !== 'Fixed'),
      publishReady:
        statuses.transmit === 'ready' || statuses.transmit === 'complete',
    }),
    [participantsByPresence, playersWithDraftTitles, state.corrections, statuses],
  );

  return {
    stages: sessionEngineStages,
    activeStageId: state.activeStageId,
    eventLabel: state.eventLabel,
    draft: state.draft,
    derived,
    actions: {
      activateStage: (stageId: SessionEngineStageId) => dispatch({ type: 'activate_stage', stageId }),
      updateSession: (field: keyof SessionRecord, value: string | number | null) =>
        dispatch({ type: 'update_session', field, value }),
      toggleParticipant: (playerId: string) => dispatch({ type: 'toggle_participant', playerId }),
      saveBoot: () => dispatch({ type: 'save_boot' }),
      lockSession: () => dispatch({ type: 'lock_session' }),
      addMatch: (payload: { title: string; locationLabel: string; resultLabel: string; summary: string }) =>
        dispatch({ type: 'add_match', payload }),
      resolveOutcome: (payload: { winnerPlayerId: string | null; verdict: string; flaggedSummary: string }) =>
        dispatch({ type: 'resolve_outcome', payload }),
      assignAward: (payload: { playerId: string; definitionId: string; reason: string }) =>
        dispatch({ type: 'assign_award', payload }),
      updateRecap: (field: keyof RecapRecord, value: string) => dispatch({ type: 'update_recap', field, value }),
      saveReportDraft: () => dispatch({ type: 'save_report_draft' }),
      verifyReport: () => dispatch({ type: 'verify_report' }),
      verifyMedia: () => dispatch({ type: 'verify_media' }),
      verifyFixes: () => dispatch({ type: 'verify_fixes' }),
      transmitHQ: () => dispatch({ type: 'transmit_hq' }),
    },
  };
}

export const sessionEngineStageEntityMap = sessionEngineStages.map((stage) => ({
  stage: stage.label,
  sourceOfTruth: stage.sourceOfTruth,
  publicOutputs: stage.publicOutputs,
}));
