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

const STORAGE_KEY = 'olympus-prime.runtime-product-records.v1';

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

let runtimeSnapshotCache: RuntimeMutableProductData | null = null;
let runtimeRevision = 0;
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

function mergeById<T extends { id: string }>(seeded: T[], runtime: T[]) {
  const merged = new Map(seeded.map((record) => [record.id, record]));
  runtime.forEach((record) => merged.set(record.id, record));
  return Array.from(merged.values());
}

function sortSessionsByNewest(left: SessionRecord, right: SessionRecord) {
  return new Date(right.scheduledAt).getTime() - new Date(left.scheduledAt).getTime();
}

export function subscribeRuntimeProductStore(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getRuntimeProductData(): RuntimeProductData {
  const runtime = readRuntimeSnapshot();

  return {
    games,
    players,
    seasons,
    badges,
    titles,
    incidents,
    rivalrySummaries,
    sessions: mergeById(seededSessions, runtime.sessions).sort(sortSessionsByNewest),
    matches: mergeById(seededMatches, runtime.matches),
    sessionParticipants: mergeById(seededSessionParticipants, runtime.sessionParticipants),
    awards: mergeById(seededAwards, runtime.awards),
    quotes: mergeById(seededQuotes, runtime.quotes),
    outcomes: mergeById(seededOutcomes, runtime.outcomes),
    recaps: mergeById(seededRecaps, runtime.recaps),
    publishStates: mergeById(seededPublishStates, runtime.publishStates),
    mediaUploads: mergeById(seededMediaUploads, runtime.mediaUploads),
  };
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
