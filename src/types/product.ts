import type { Tone } from './hq';

export type PlayerStatus = 'active' | 'resting' | 'guest';
export type GameStatus = 'active' | 'planned' | 'archived';
export type SeasonStatus = 'planning' | 'active' | 'closed';
export type SessionStatus = 'planned' | 'draft' | 'logged' | 'published';
export type AttendanceStatus = 'present' | 'late' | 'guest' | 'host';
export type FinishStatus = 'winner' | 'survived' | 'ejected' | 'spectated';
export type AwardType = 'badge' | 'title';
export type AwardState = 'queued' | 'assigned' | 'published';
export type QuoteContext =
  | 'profile'
  | 'whisper'
  | 'legend'
  | 'transmission'
  | 'recap'
  | 'incident';
export type MediaUploadType = 'screenshot' | 'photo_set' | 'clip';
export type MediaUploadStatus = 'placeholder' | 'ready' | 'published';
export type IncidentVisibility = 'internal' | 'public';
export type RecapStatus = 'draft' | 'ready' | 'published';
export type OutcomeStatus = 'pending' | 'resolved' | 'published';
export type PublishStateStatus = 'draft' | 'verified' | 'transmitted';

export interface PlayerRecord {
  id: string;
  callsign: string;
  fullName: string;
  colorName: string;
  colorHex: string;
  roleLabel: string;
  status: PlayerStatus;
  statusNote: string;
  profileTone: Tone;
  bio: string;
  signatureMove: string;
  alibiStyle: string;
  currentTitleId: string | null;
  primaryBadgeId: string | null;
  joinedSeasonId: string;
  allyIds: string[];
  habitNotes: string[];
  tellNotes: string[];
}

export interface GameRecord {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  status: GameStatus;
  summary: string;
  theme: string;
}

export interface SeasonRecord {
  id: string;
  name: string;
  code: string;
  status: SeasonStatus;
  startDate: string;
  endDate: string | null;
  currentWeekLabel: string;
  theme: string;
}

export interface SessionRecord {
  id: string;
  gameId: string;
  seasonId: string;
  label: string;
  sessionNumber: number;
  scheduledAt: string;
  venue: string;
  format: string;
  hostPlayerId: string;
  status: SessionStatus;
  attendanceCount: number;
  winningPlayerId: string | null;
  hostNotes: string;
}

export interface MatchRecord {
  id: string;
  sessionId: string;
  sequence: number;
  title: string;
  locationLabel: string;
  tagLabel: string;
  resultLabel: string;
  summary: string;
  detail: string;
  artifactLabel: string;
  tone: Tone;
  legendCandidate: boolean;
}

export interface SessionParticipantRecord {
  id: string;
  sessionId: string;
  playerId: string;
  attendanceStatus: AttendanceStatus;
  finishStatus: FinishStatus;
  playedMatches: number;
  winCount: number;
  note: string;
}

export interface BadgeRecord {
  id: string;
  name: string;
  category: 'profile' | 'nightly';
  description: string;
  tone: Tone;
}

export interface TitleRecord {
  id: string;
  name: string;
  description: string;
  tone: Tone;
}

export interface AwardRecord {
  id: string;
  sessionId: string;
  playerId: string;
  awardType: AwardType;
  definitionId: string;
  reason: string;
  state: AwardState;
}

export interface QuoteRecord {
  id: string;
  speakerLabel: string;
  playerId: string | null;
  sessionId: string | null;
  matchId: string | null;
  context: QuoteContext;
  channel: string | null;
  locationLabel: string | null;
  stamp: string | null;
  text: string;
  tone: Tone;
}

export interface IncidentRecord {
  id: string;
  sessionId: string;
  matchId: string | null;
  title: string;
  severityLabel: string;
  statusLabel: string;
  summary: string;
  threadLabel: string;
  reporterPlayerId: string | null;
  visibility: IncidentVisibility;
  tone: Tone;
}

export interface OutcomeRecord {
  id: string;
  sessionId: string;
  winnerPlayerId: string | null;
  verdict: string;
  flaggedSummary: string;
  status: OutcomeStatus;
}

export interface RecapRecord {
  id: string;
  sessionId: string;
  headline: string;
  summary: string;
  highlight: string;
  publishNote: string;
  verdict: string;
  recommendation: string;
  status: RecapStatus;
}

export interface PublishStateRecord {
  id: string;
  sessionId: string;
  reportStatus: PublishStateStatus;
  awardsStatus: PublishStateStatus;
  mediaStatus: PublishStateStatus;
  publicStatus: PublishStateStatus;
  transmittedAt: string | null;
}

export interface MediaUploadRecord {
  id: string;
  sessionId: string;
  recapId: string | null;
  label: string;
  type: MediaUploadType;
  status: MediaUploadStatus;
  note: string;
  sortOrder: number;
}

export interface RivalrySummaryRecord {
  id: string;
  playerAId: string;
  playerBId: string;
  seasonId: string | null;
  summary: string;
  heatLabel: string;
  stateLabel: string;
  tone: Tone;
}
