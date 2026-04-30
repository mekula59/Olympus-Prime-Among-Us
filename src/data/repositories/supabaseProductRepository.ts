import type { ProductRepository } from '../../types/productRepository';
import { requireAuthenticatedWorkspaceMember } from '../../auth/authStore';
import { createSupabaseClientScaffold, isSupabaseConfigured } from '../../lib/supabase';
import { localProductRepository } from './localProductRepository';
import {
  createEmptyRecap,
  createEmptyPublishState,
  buildDraftSessionBundle,
} from './productRepositoryUtils';
import { getRuntimeProductData } from '../runtimeProductStore';
import { fetchSupabaseCanonicalProductData } from './supabaseCanonicalData';
import {
  markRuntimeSessionSyncFailed,
  markRuntimeSessionSyncPending,
  markRuntimeSessionSyncSucceeded,
  refreshRuntimeCanonicalProductData,
  replaceRuntimeSessionBundle,
  upsertRuntimeProductRecords,
} from '../runtimeProductStore';
import {
  getLatestOperationalSession,
  getPublishStateBySessionId,
  getRecapBySessionId,
  getSessionById,
} from '../productSelectors';
import { deleteSupabaseRowsByColumn, fetchSupabaseTable, upsertSupabaseRows } from './supabaseRest';
import type { SessionEngineDraft } from '../../types/sessionEngine';
import type {
  AwardRecord,
  MatchRecord,
  MediaUploadRecord,
  OutcomeRecord,
  PublishStateRecord,
  QuoteRecord,
  RecapRecord,
  SessionParticipantRecord,
  SessionRecord,
} from '../../types/product';

const sessionWriteQueues = new Map<string, Promise<void>>();

export const supabaseProductRepository: ProductRepository = {
  driver: 'supabase',
  async createSessionDraftRecord(gameId) {
    if (!isSupabaseConfigured()) {
      return localProductRepository.createSessionDraftRecord(gameId);
    }

    const actor = requireAuthenticatedWorkspaceMember();
    const sessionOwnerId = actor.userId;
    const targetGameId = gameId ?? 'among-us';
    const sourceData = getRuntimeProductData();
    const remotePlayerIds = await withTimeout(fetchSupabasePlayerIds(), 4000, new Set<string>());
    const referenceHostPlayerId = sourceData.sessions.find(
      (session) =>
        session.gameId === targetGameId &&
        session.status !== 'draft' &&
        remotePlayerIds.has(session.hostPlayerId),
    )?.hostPlayerId;
    const [fallbackHostPlayerId] = Array.from(remotePlayerIds);
    const hostPlayerId = referenceHostPlayerId ?? fallbackHostPlayerId ?? 'nova';
    if (!hostPlayerId) {
      throw new Error('Supabase players seed is missing; cannot create a session draft without a valid host player.');
    }

    const bundle = buildDraftSessionBundle(targetGameId, sourceData);
    const ownedSession: SessionRecord = {
      ...bundle.session,
      hostPlayerId,
      ownerUserId: sessionOwnerId,
      lastEditedByUserId: sessionOwnerId,
    };
    markRuntimeSessionSyncPending(bundle.session.id);
    replaceRuntimeSessionBundle({
      ...bundle,
      session: ownedSession,
    });

    void enqueueSessionWrite(bundle.session.id, async () => {
      await upsertSupabaseRows('sessions', [mapSessionRow(ownedSession)]);
      await Promise.all([
        upsertSupabaseRows('outcomes', [mapOutcomeRow(bundle.outcome)]),
        upsertSupabaseRows('recaps', [mapRecapRow(bundle.recap)]),
        upsertSupabaseRows('publish_states', [mapPublishStateRow(bundle.publishState)]),
      ]);
      await ensureRuntimeCanonicalRefresh();
    })
      .then(async () => {
        markRuntimeSessionSyncSucceeded(bundle.session.id);
      })
      .catch((error) => {
        markRuntimeSessionSyncFailed(bundle.session.id, error);
      });

    return ownedSession;
  },
  saveGenericSessionEditor(sessionId, payload) {
    if (!isSupabaseConfigured()) {
      return localProductRepository.saveGenericSessionEditor(sessionId, payload);
    }

    const existingSession = getSessionById(sessionId);
    if (!existingSession) {
      return localProductRepository.saveGenericSessionEditor(sessionId, payload);
    }
    const actor = requireAuthenticatedWorkspaceMember();

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
      lastEditedByUserId: actor.userId,
    };

    const recap: RecapRecord = getRecapBySessionId(sessionId) ?? createEmptyRecap(sessionId);
    const nextRecap: RecapRecord = {
      ...recap,
      headline: payload.headline,
      summary: payload.summary,
      highlight: payload.highlight,
      publishNote: payload.publishNote,
      status: recap.status === 'published' ? 'published' : 'draft',
    };

    const publishState: PublishStateRecord =
      getPublishStateBySessionId(sessionId) ?? createEmptyPublishState(sessionId);
    markRuntimeSessionSyncPending(sessionId);

    upsertRuntimeProductRecords({
      sessions: [nextSession],
      recaps: [nextRecap],
      publishStates: [publishState],
    });
    void enqueueSessionWrite(sessionId, async () => {
      await upsertSupabaseRows('sessions', [mapSessionRow(nextSession)]);
      await Promise.all([
        upsertSupabaseRows('recaps', [mapRecapRow(nextRecap)]),
        upsertSupabaseRows('publish_states', [mapPublishStateRow(publishState)]),
      ]);
      await ensureRuntimeCanonicalRefresh();
    })
      .then(async () => {
        markRuntimeSessionSyncSucceeded(sessionId);
      })
      .catch((error) => {
        markRuntimeSessionSyncFailed(sessionId, error);
      });
  },
  persistSessionEngineDraft(draft: SessionEngineDraft) {
    if (!isSupabaseConfigured()) {
      return localProductRepository.persistSessionEngineDraft(draft);
    }
    const actor = requireAuthenticatedWorkspaceMember();
    const nextDraft: SessionEngineDraft = {
      ...draft,
      session: {
        ...draft.session,
        lastEditedByUserId: actor.userId,
      },
    };

    markRuntimeSessionSyncPending(nextDraft.session.id);
    replaceRuntimeSessionBundle({
      session: nextDraft.session,
      participants: nextDraft.participants,
      matches: nextDraft.matches,
      outcome: nextDraft.outcome,
      awards: nextDraft.awards,
      quotes: nextDraft.quotes,
      recap: nextDraft.recap,
      media: nextDraft.media,
      publishState: nextDraft.publishState,
    });

    void enqueueSessionWrite(nextDraft.session.id, async () => {
      await syncSessionEngineBundleToSupabase(nextDraft);
      await ensureRuntimeCanonicalRefresh();
    })
      .then(async () => {
        markRuntimeSessionSyncSucceeded(nextDraft.session.id);
      })
      .catch((error) => {
        markRuntimeSessionSyncFailed(nextDraft.session.id, error);
      });
  },
  getDefaultHubOpsSessionId() {
    return getLatestOperationalSession()?.id ?? localProductRepository.getDefaultHubOpsSessionId();
  },
  getCanonicalProductData() {
    void fetchSupabaseCanonicalProductData().catch(() => null);
    return getRuntimeProductData();
  },
};

export function getSupabaseRepositoryReadiness() {
  const client = createSupabaseClientScaffold();

  return {
    driver: supabaseProductRepository.driver,
    configured: isSupabaseConfigured(),
    client,
  };
}

async function ensureRuntimeCanonicalRefresh() {
  const refreshed = await refreshRuntimeCanonicalProductData();
  if (!refreshed) {
    throw new Error('Supabase canonical refresh failed after remote write');
  }
}

export function getSupabaseFallbackRepository() {
  return localProductRepository;
}

function enqueueSessionWrite(sessionId: string, task: () => Promise<void>) {
  const previousWrite = sessionWriteQueues.get(sessionId) ?? Promise.resolve();
  const nextWrite = previousWrite.catch(() => undefined).then(task);
  const trackedWrite = nextWrite.catch(() => undefined);

  sessionWriteQueues.set(sessionId, trackedWrite);
  void trackedWrite.finally(() => {
    if (sessionWriteQueues.get(sessionId) === trackedWrite) {
      sessionWriteQueues.delete(sessionId);
    }
  });

  return nextWrite;
}

async function fetchSupabasePlayerIds() {
  const rows = await fetchSupabaseTable('players') as Array<Record<string, unknown>>;
  return new Set(
    rows
      .map((row) => row.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0),
  );
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T) {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      window.setTimeout(() => resolve(fallback), timeoutMs);
    }),
  ]);
}

function mapSessionRow(session: SessionRecord) {
  return {
    id: session.id,
    game_id: session.gameId,
    season_id: session.seasonId,
    label: session.label,
    session_number: session.sessionNumber,
    scheduled_at: session.scheduledAt,
    venue: session.venue,
    format: session.format,
    host_player_id: session.hostPlayerId,
    status: session.status,
    attendance_count: session.attendanceCount,
    winning_player_id: session.winningPlayerId,
    host_notes: session.hostNotes,
    owner_user_id: session.ownerUserId ?? null,
    last_edited_by_user_id: session.lastEditedByUserId ?? null,
  };
}

function mapOutcomeRow(outcome: OutcomeRecord) {
  return {
    id: outcome.id,
    session_id: outcome.sessionId,
    winner_player_id: outcome.winnerPlayerId,
    verdict: outcome.verdict,
    flagged_summary: outcome.flaggedSummary,
    status: outcome.status,
  };
}

function mapRecapRow(recap: RecapRecord) {
  return {
    id: recap.id,
    session_id: recap.sessionId,
    headline: recap.headline,
    summary: recap.summary,
    highlight: recap.highlight,
    publish_note: recap.publishNote,
    verdict: recap.verdict,
    recommendation: recap.recommendation,
    status: recap.status,
  };
}

function mapPublishStateRow(publishState: PublishStateRecord) {
  return {
    id: publishState.id,
    session_id: publishState.sessionId,
    report_status: publishState.reportStatus,
    awards_status: publishState.awardsStatus,
    media_status: publishState.mediaStatus,
    public_status: publishState.publicStatus,
    transmitted_at: publishState.transmittedAt,
  };
}

function mapParticipantRow(participant: SessionParticipantRecord) {
  return {
    id: participant.id,
    session_id: participant.sessionId,
    player_id: participant.playerId,
    attendance_status: participant.attendanceStatus,
    finish_status: participant.finishStatus,
    played_matches: participant.playedMatches,
    win_count: participant.winCount,
    note: participant.note,
  };
}

function mapMatchRow(match: MatchRecord) {
  return {
    id: match.id,
    session_id: match.sessionId,
    sequence: match.sequence,
    title: match.title,
    location_label: match.locationLabel,
    tag_label: match.tagLabel,
    result_label: match.resultLabel,
    summary: match.summary,
    detail: match.detail,
    artifact_label: match.artifactLabel,
    tone: match.tone,
    legend_candidate: match.legendCandidate,
  };
}

function mapAwardRow(award: AwardRecord) {
  return {
    id: award.id,
    session_id: award.sessionId,
    player_id: award.playerId,
    award_type: award.awardType,
    definition_id: award.definitionId,
    reason: award.reason,
    state: award.state,
  };
}

function mapQuoteRow(quote: QuoteRecord) {
  return {
    id: quote.id,
    speaker_label: quote.speakerLabel,
    player_id: quote.playerId,
    session_id: quote.sessionId,
    match_id: quote.matchId,
    context: quote.context,
    channel: quote.channel,
    location_label: quote.locationLabel,
    stamp: quote.stamp,
    text: quote.text,
    tone: quote.tone,
  };
}

function mapMediaUploadRow(item: MediaUploadRecord) {
  return {
    id: item.id,
    session_id: item.sessionId,
    recap_id: item.recapId,
    label: item.label,
    type: item.type,
    status: item.status,
    note: item.note,
    sort_order: item.sortOrder,
  };
}

async function replaceSessionScopedRows<T extends Record<string, unknown>>(
  table: string,
  sessionId: string,
  rows: T[],
) {
  await deleteSupabaseRowsByColumn(table, 'session_id', sessionId);

  if (rows.length > 0) {
    await upsertSupabaseRows(table, rows);
  }
}

async function syncSessionEngineBundleToSupabase(draft: SessionEngineDraft) {
  await upsertSupabaseRows('sessions', [mapSessionRow(draft.session)]);
  await replaceSessionScopedRows(
    'session_participants',
    draft.session.id,
    draft.participants.map(mapParticipantRow),
  );
  await replaceSessionScopedRows(
    'matches',
    draft.session.id,
    draft.matches.map(mapMatchRow),
  );
  await upsertSupabaseRows('outcomes', [mapOutcomeRow(draft.outcome)]);
  await replaceSessionScopedRows(
    'awards',
    draft.session.id,
    draft.awards.map(mapAwardRow),
  );
  await replaceSessionScopedRows(
    'quotes',
    draft.session.id,
    draft.quotes.map(mapQuoteRow),
  );
  await upsertSupabaseRows('recaps', [mapRecapRow(draft.recap)]);
  await replaceSessionScopedRows(
    'media_uploads',
    draft.session.id,
    draft.media.map(mapMediaUploadRow),
  );
  await upsertSupabaseRows('publish_states', [mapPublishStateRow(draft.publishState)]);
}
