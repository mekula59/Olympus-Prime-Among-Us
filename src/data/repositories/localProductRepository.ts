import type {
  SessionRecord,
} from '../../types/product';
import type {
  ProductRepository,
  SaveGenericSessionEditorPayload,
} from '../../types/productRepository';
import type { SessionEngineDraft } from '../../types/sessionEngine';
import {
  getLatestOperationalSession,
  getOutcomeBySessionId,
  getPublishStateBySessionId,
  getRecapBySessionId,
  getSessionById,
} from '../productSelectors';
import {
  getRuntimeProductData,
  replaceRuntimeSessionBundle,
  upsertRuntimeProductRecords,
} from '../runtimeProductStore';
import {
  buildDraftSessionBundle,
  createEmptyPublishState,
  createEmptyRecap,
} from './productRepositoryUtils';

function createSessionDraftRecord(gameId = 'among-us') {
  const bundle = buildDraftSessionBundle(gameId, getRuntimeProductData());
  replaceRuntimeSessionBundle(bundle);
  return bundle.session;
}

function saveGenericSessionEditor(
  sessionId: string,
  payload: SaveGenericSessionEditorPayload,
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

function persistSessionEngineDraft(draft: SessionEngineDraft) {
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

function getDefaultHubOpsSessionId() {
  return getLatestOperationalSession()?.id ?? 'session-09';
}

function getCanonicalProductData() {
  return getRuntimeProductData();
}

export const localProductRepository: ProductRepository = {
  driver: 'local',
  createSessionDraftRecord,
  saveGenericSessionEditor,
  persistSessionEngineDraft,
  getDefaultHubOpsSessionId,
  getCanonicalProductData,
};
