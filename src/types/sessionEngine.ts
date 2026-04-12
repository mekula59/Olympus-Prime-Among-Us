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
} from './product';

export type SessionEngineStageId =
  | 'boot'
  | 'crew'
  | 'matches'
  | 'outcomes'
  | 'awards'
  | 'report'
  | 'transmit';

export interface SessionEngineStageDefinition {
  id: SessionEngineStageId;
  label: string;
  short: string;
  sourceOfTruth: string[];
  publicOutputs: string[];
}

export interface SessionEngineDraft {
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

export interface SessionEngineStatusMap {
  boot: 'standby' | 'active' | 'locked';
  crew: 'standby' | 'verified';
  matches: 'standby' | 'logged';
  outcomes: 'standby' | 'resolved';
  awards: 'standby' | 'committed';
  report: 'draft' | 'verified' | 'transmitted';
  transmit: 'standby' | 'ready' | 'complete';
}
