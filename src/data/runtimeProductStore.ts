import { useMemo, useSyncExternalStore } from 'react';
import type {
  AwardRecord,
  BadgeRecord,
  GameRecord,
  IncidentRecord,
  MatchRecord,
  MediaUploadRecord,
  OutcomeRecord,
  PlayerRecord,
  PublishStateRecord,
  QuoteRecord,
  RecapRecord,
  RivalrySummaryRecord,
  SeasonRecord,
  SessionParticipantRecord,
  SessionRecord,
  TitleRecord,
} from '../types/product';
import {
  awards as seededAwards,
  badges,
  games,
  incidents,
  matches as seededMatches,
  mediaUploads as seededMediaUploads,
  outcomes as seededOutcomes,
  players,
  publishStates as seededPublishStates,
  quotes as seededQuotes,
  recaps as seededRecaps,
  rivalrySummaries,
  seasons,
  sessionParticipants as seededSessionParticipants,
  sessions as seededSessions,
  titles,
} from './productSource';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchSupabaseCanonicalProductData } from './repositories/supabaseCanonicalData';

const STORAGE_KEY = 'olympus-prime.runtime-product-records.v1';
const SYNC_STATE_STORAGE_KEY = 'olympus-prime.runtime-product-sync-state.v1';

export interface RuntimeMutableProductData {
  sessions: SessionRecord[];
  matches: MatchRecord[];
  sessionParticipants: SessionParticipantRecord[];
  awards: AwardRecord[];
  quotes: QuoteRecord[];
  outcomes: OutcomeRecord[];
  recaps: RecapRecord[];
  publishStates: PublishStateRecord[];
  mediaUploads: MediaUploadRecord[];
}

export interface RuntimeProductData extends RuntimeMutableProductData {
  games: GameRecord[];
  players: PlayerRecord[];
  seasons: SeasonRecord[];
  badges: BadgeRecord[];
  titles: TitleRecord[];
  incidents: IncidentRecord[];
  rivalrySummaries: RivalrySummaryRecord[];
}

export type RuntimeSessionSyncStatus = 'idle' | 'pending' | 'failed';

export interface RuntimeSessionSyncState {
  sessionId: string;
  status: RuntimeSessionSyncStatus;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastError: string | null;
}

const emptyRuntimeData: RuntimeMutableProductData = {
  sessions: [],
  matches: [],
  sessionParticipants: [],
  awards: [],
  quotes: [],
  outcomes: [],
  recaps: [],
  publishStates: [],
  mediaUploads: [],
};

const seededCanonicalProductData: RuntimeProductData = {
  games,
  players,
  seasons,
  badges,
  titles,
  incidents,
  rivalrySummaries,
  sessions: [...seededSessions].sort(sortSessionsByNewest),
  matches: [...seededMatches],
  sessionParticipants: [...seededSessionParticipants],
  awards: [...seededAwards],
  quotes: [...seededQuotes],
  outcomes: [...seededOutcomes],
  recaps: [...seededRecaps],
  publishStates: [...seededPublishStates],
  mediaUploads: [...seededMediaUploads],
};

let runtimeSnapshotCache: RuntimeMutableProductData | null = null;
let runtimeRevision = 0;
let canonicalBaseOverride: RuntimeProductData | null = null;
let canonicalHydrationRequested = false;
let runtimeSessionSyncStateCache: Record<string, RuntimeSessionSyncState> | null = null;
const listeners = new Set<() => void>();

function cloneRuntimeData(snapshot: RuntimeMutableProductData): RuntimeMutableProductData {
  return {
    sessions: [...snapshot.sessions],
    matches: [...snapshot.matches],
    sessionParticipants: [...snapshot.sessionParticipants],
    awards: [...snapshot.awards],
    quotes: [...snapshot.quotes],
    outcomes: [...snapshot.outcomes],
    recaps: [...snapshot.recaps],
    publishStates: [...snapshot.publishStates],
    mediaUploads: [...snapshot.mediaUploads],
  };
}

function readRuntimeSnapshot(): RuntimeMutableProductData {
  if (runtimeSnapshotCache) {
    return cloneRuntimeData(runtimeSnapshotCache);
  }

  if (typeof window === 'undefined') {
    runtimeSnapshotCache = cloneRuntimeData(emptyRuntimeData);
    return cloneRuntimeData(runtimeSnapshotCache);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      runtimeSnapshotCache = cloneRuntimeData(emptyRuntimeData);
      return cloneRuntimeData(runtimeSnapshotCache);
    }

    const parsed = JSON.parse(raw) as Partial<RuntimeMutableProductData>;
    runtimeSnapshotCache = {
      sessions: parsed.sessions ?? [],
      matches: parsed.matches ?? [],
      sessionParticipants: parsed.sessionParticipants ?? [],
      awards: parsed.awards ?? [],
      quotes: parsed.quotes ?? [],
      outcomes: parsed.outcomes ?? [],
      recaps: parsed.recaps ?? [],
      publishStates: parsed.publishStates ?? [],
      mediaUploads: parsed.mediaUploads ?? [],
    };
  } catch {
    runtimeSnapshotCache = cloneRuntimeData(emptyRuntimeData);
  }

  return cloneRuntimeData(runtimeSnapshotCache);
}

function cloneRuntimeSessionSyncState(
  snapshot: Record<string, RuntimeSessionSyncState>,
) {
  return Object.fromEntries(
    Object.entries(snapshot).map(([key, value]) => [key, { ...value }]),
  );
}

function readRuntimeSessionSyncState() {
  if (runtimeSessionSyncStateCache) {
    return cloneRuntimeSessionSyncState(runtimeSessionSyncStateCache);
  }

  if (typeof window === 'undefined') {
    runtimeSessionSyncStateCache = {};
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SYNC_STATE_STORAGE_KEY);
    if (!raw) {
      runtimeSessionSyncStateCache = {};
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, RuntimeSessionSyncState>;
    runtimeSessionSyncStateCache = Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        {
          sessionId: value.sessionId,
          status: value.status,
          lastAttemptAt: value.lastAttemptAt ?? null,
          lastSuccessAt: value.lastSuccessAt ?? null,
          lastFailureAt: value.lastFailureAt ?? null,
          lastError: value.lastError ?? null,
        },
      ]),
    );
  } catch {
    runtimeSessionSyncStateCache = {};
  }

  return cloneRuntimeSessionSyncState(runtimeSessionSyncStateCache);
}

function writeRuntimeSnapshot(snapshot: RuntimeMutableProductData) {
  const nextSerialized = JSON.stringify(snapshot);
  const currentSerialized = runtimeSnapshotCache ? JSON.stringify(runtimeSnapshotCache) : null;

  if (currentSerialized === nextSerialized) {
    return;
  }

  runtimeSnapshotCache = cloneRuntimeData(snapshot);
  runtimeRevision += 1;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, nextSerialized);
  }

  listeners.forEach((listener) => listener());
}

function writeRuntimeSessionSyncState(
  snapshot: Record<string, RuntimeSessionSyncState>,
) {
  const nextSerialized = JSON.stringify(snapshot);
  const currentSerialized = runtimeSessionSyncStateCache
    ? JSON.stringify(runtimeSessionSyncStateCache)
    : null;

  if (currentSerialized === nextSerialized) {
    return;
  }

  runtimeSessionSyncStateCache = cloneRuntimeSessionSyncState(snapshot);
  runtimeRevision += 1;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SYNC_STATE_STORAGE_KEY, nextSerialized);
  }

  listeners.forEach((listener) => listener());
}

function mergeById<T extends { id: string }>(seeded: T[], runtime: T[]) {
  const merged = new Map(seeded.map((record) => [record.id, record]));
  runtime.forEach((record) => merged.set(record.id, record));
  return Array.from(merged.values());
}

function sortSessionsByNewest(left: SessionRecord, right: SessionRecord) {
  return new Date(right.scheduledAt).getTime() - new Date(left.scheduledAt).getTime();
}

function getCanonicalBaseData() {
  return canonicalBaseOverride ?? seededCanonicalProductData;
}

function mergeCanonicalProductData(
  base: RuntimeProductData,
  runtime: RuntimeMutableProductData,
): RuntimeProductData {
  return {
    games: base.games,
    players: base.players,
    seasons: base.seasons,
    badges: base.badges,
    titles: base.titles,
    incidents: base.incidents,
    rivalrySummaries: base.rivalrySummaries,
    sessions: mergeById(base.sessions, runtime.sessions).sort(sortSessionsByNewest),
    matches: mergeById(base.matches, runtime.matches),
    sessionParticipants: mergeById(base.sessionParticipants, runtime.sessionParticipants),
    awards: mergeById(base.awards, runtime.awards),
    quotes: mergeById(base.quotes, runtime.quotes),
    outcomes: mergeById(base.outcomes, runtime.outcomes),
    recaps: mergeById(base.recaps, runtime.recaps),
    publishStates: mergeById(base.publishStates, runtime.publishStates),
    mediaUploads: mergeById(base.mediaUploads, runtime.mediaUploads),
  };
}

function isRemotePrimaryMode() {
  return import.meta.env.VITE_PRODUCT_REPOSITORY_DRIVER === 'supabase' && isSupabaseConfigured();
}

function filterRuntimeOverlayData(
  runtime: RuntimeMutableProductData,
  syncState: Record<string, RuntimeSessionSyncState>,
) {
  if (!isRemotePrimaryMode()) {
    return runtime;
  }

  const activeSessionIds = new Set(
    Object.values(syncState)
      .filter((state) => state.status === 'pending' || state.status === 'failed')
      .map((state) => state.sessionId),
  );

  if (activeSessionIds.size === 0) {
    return cloneRuntimeData(emptyRuntimeData);
  }

  const matchesSession = (sessionId: string) => activeSessionIds.has(sessionId);

  return {
    sessions: runtime.sessions.filter((record) => matchesSession(record.id)),
    matches: runtime.matches.filter((record) => matchesSession(record.sessionId)),
    sessionParticipants: runtime.sessionParticipants.filter((record) =>
      matchesSession(record.sessionId),
    ),
    awards: runtime.awards.filter((record) => matchesSession(record.sessionId)),
    quotes: runtime.quotes.filter((record) => record.sessionId && matchesSession(record.sessionId)),
    outcomes: runtime.outcomes.filter((record) => matchesSession(record.sessionId)),
    recaps: runtime.recaps.filter((record) => matchesSession(record.sessionId)),
    publishStates: runtime.publishStates.filter((record) => matchesSession(record.sessionId)),
    mediaUploads: runtime.mediaUploads.filter((record) => matchesSession(record.sessionId)),
  };
}

function setCanonicalBaseOverride(nextBase: RuntimeProductData) {
  const currentSerialized = canonicalBaseOverride ? JSON.stringify(canonicalBaseOverride) : null;
  const nextSerialized = JSON.stringify(nextBase);

  if (currentSerialized === nextSerialized) {
    return;
  }

  canonicalBaseOverride = nextBase;
  runtimeRevision += 1;
  listeners.forEach((listener) => listener());
}

function ensureSupabaseCanonicalHydration() {
  if (
    import.meta.env.VITE_PRODUCT_REPOSITORY_DRIVER !== 'supabase' ||
    !isSupabaseConfigured() ||
    canonicalHydrationRequested ||
    typeof window === 'undefined'
  ) {
    return;
  }

  canonicalHydrationRequested = true;

  void fetchSupabaseCanonicalProductData()
    .then((remoteData) => {
      if (remoteData) {
        setCanonicalBaseOverride(remoteData);
      }
    })
    .catch(() => {
      canonicalHydrationRequested = false;
    });
}

export function subscribeRuntimeProductStore(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getRuntimeProductData(): RuntimeProductData {
  const runtime = readRuntimeSnapshot();
  const syncState = readRuntimeSessionSyncState();
  ensureSupabaseCanonicalHydration();

  return mergeCanonicalProductData(
    getCanonicalBaseData(),
    filterRuntimeOverlayData(runtime, syncState),
  );
}

export function useRuntimeProductData() {
  const revision = useSyncExternalStore(
    subscribeRuntimeProductStore,
    () => runtimeRevision,
    () => 0,
  );

  return useMemo(
    () => ({
      revision,
      data: getRuntimeProductData(),
    }),
    [revision],
  );
}

export function upsertRuntimeProductRecords(
  patch: Partial<RuntimeMutableProductData>,
) {
  const current = readRuntimeSnapshot();
  const next: RuntimeMutableProductData = {
    sessions: patch.sessions ? mergeById(current.sessions, patch.sessions) : current.sessions,
    matches: patch.matches ? mergeById(current.matches, patch.matches) : current.matches,
    sessionParticipants: patch.sessionParticipants
      ? mergeById(current.sessionParticipants, patch.sessionParticipants)
      : current.sessionParticipants,
    awards: patch.awards ? mergeById(current.awards, patch.awards) : current.awards,
    quotes: patch.quotes ? mergeById(current.quotes, patch.quotes) : current.quotes,
    outcomes: patch.outcomes ? mergeById(current.outcomes, patch.outcomes) : current.outcomes,
    recaps: patch.recaps ? mergeById(current.recaps, patch.recaps) : current.recaps,
    publishStates: patch.publishStates
      ? mergeById(current.publishStates, patch.publishStates)
      : current.publishStates,
    mediaUploads: patch.mediaUploads
      ? mergeById(current.mediaUploads, patch.mediaUploads)
      : current.mediaUploads,
  };

  writeRuntimeSnapshot(next);
}

function removeRuntimeSessionOverlay(
  snapshot: RuntimeMutableProductData,
  sessionId: string,
): RuntimeMutableProductData {
  return {
    sessions: snapshot.sessions.filter((record) => record.id !== sessionId),
    matches: snapshot.matches.filter((record) => record.sessionId !== sessionId),
    sessionParticipants: snapshot.sessionParticipants.filter(
      (record) => record.sessionId !== sessionId,
    ),
    awards: snapshot.awards.filter((record) => record.sessionId !== sessionId),
    quotes: snapshot.quotes.filter((record) => record.sessionId !== sessionId),
    outcomes: snapshot.outcomes.filter((record) => record.sessionId !== sessionId),
    recaps: snapshot.recaps.filter((record) => record.sessionId !== sessionId),
    publishStates: snapshot.publishStates.filter((record) => record.sessionId !== sessionId),
    mediaUploads: snapshot.mediaUploads.filter((record) => record.sessionId !== sessionId),
  };
}

function setRuntimeSessionSyncState(
  sessionId: string,
  patch: Partial<RuntimeSessionSyncState>,
) {
  const current = readRuntimeSessionSyncState();
  const previous = current[sessionId] ?? {
    sessionId,
    status: 'idle' as const,
    lastAttemptAt: null,
    lastSuccessAt: null,
    lastFailureAt: null,
    lastError: null,
  };

  writeRuntimeSessionSyncState({
    ...current,
    [sessionId]: {
      ...previous,
      ...patch,
      sessionId,
    },
  });
}

export function markRuntimeSessionSyncPending(sessionId: string) {
  setRuntimeSessionSyncState(sessionId, {
    status: 'pending',
    lastAttemptAt: new Date().toISOString(),
    lastError: null,
  });
}

export function markRuntimeSessionSyncFailed(sessionId: string, error?: unknown) {
  setRuntimeSessionSyncState(sessionId, {
    status: 'failed',
    lastFailureAt: new Date().toISOString(),
    lastError: error instanceof Error ? error.message : typeof error === 'string' ? error : null,
  });
}

export function clearRuntimeSessionOverlay(sessionId: string) {
  writeRuntimeSnapshot(removeRuntimeSessionOverlay(readRuntimeSnapshot(), sessionId));
}

export function markRuntimeSessionSyncSucceeded(sessionId: string) {
  clearRuntimeSessionOverlay(sessionId);
  setRuntimeSessionSyncState(sessionId, {
    status: 'idle',
    lastSuccessAt: new Date().toISOString(),
    lastError: null,
  });
}

export async function refreshRuntimeCanonicalProductData() {
  if (!isRemotePrimaryMode()) {
    return false;
  }

  const remoteData = await fetchSupabaseCanonicalProductData();
  if (!remoteData) {
    return false;
  }

  setCanonicalBaseOverride(remoteData);
  return true;
}

export function getRuntimeSessionSyncState(sessionId: string) {
  return readRuntimeSessionSyncState()[sessionId] ?? null;
}

export function useRuntimeSessionSyncState(sessionId: string | undefined) {
  const revision = useSyncExternalStore(
    subscribeRuntimeProductStore,
    () => runtimeRevision,
    () => 0,
  );

  return useMemo(
    () => ({
      revision,
      syncState: sessionId ? getRuntimeSessionSyncState(sessionId) : null,
    }),
    [revision, sessionId],
  );
}

export interface RuntimeSessionBundle {
  session: SessionRecord;
  participants: SessionParticipantRecord[];
  matches: MatchRecord[];
  outcome: OutcomeRecord;
  awards: AwardRecord[];
  quotes: QuoteRecord[];
  recap: RecapRecord;
  media: MediaUploadRecord[];
  publishState: PublishStateRecord;
}

export function replaceRuntimeSessionBundle(bundle: RuntimeSessionBundle) {
  const current = readRuntimeSnapshot();
  const sessionId = bundle.session.id;

  writeRuntimeSnapshot({
    sessions: mergeById(
      current.sessions.filter((record) => record.id !== sessionId),
      [bundle.session],
    ),
    matches: [
      ...current.matches.filter((record) => record.sessionId !== sessionId),
      ...bundle.matches,
    ],
    sessionParticipants: [
      ...current.sessionParticipants.filter((record) => record.sessionId !== sessionId),
      ...bundle.participants,
    ],
    awards: [
      ...current.awards.filter((record) => record.sessionId !== sessionId),
      ...bundle.awards,
    ],
    quotes: [
      ...current.quotes.filter((record) => record.sessionId !== sessionId),
      ...bundle.quotes,
    ],
    outcomes: mergeById(
      current.outcomes.filter((record) => record.sessionId !== sessionId),
      [bundle.outcome],
    ),
    recaps: mergeById(
      current.recaps.filter((record) => record.sessionId !== sessionId),
      [bundle.recap],
    ),
    publishStates: mergeById(
      current.publishStates.filter((record) => record.sessionId !== sessionId),
      [bundle.publishState],
    ),
    mediaUploads: [
      ...current.mediaUploads.filter((record) => record.sessionId !== sessionId),
      ...bundle.media,
    ],
  });
}

export function getSeedCanonicalProductData() {
  return seededCanonicalProductData;
}
