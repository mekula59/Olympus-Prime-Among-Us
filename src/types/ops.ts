import type { Tone } from './hq';

export interface OpsSummaryCard {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}

export interface OpsWorkflowStep {
  id: string;
  title: string;
  detail: string;
}

export interface OpsSessionDraft {
  sessionName: string;
  date: string;
  seasonId: string;
  host: string;
  room: string;
  mode: string;
  attendance: string;
  winnerId: string;
  notes: string;
  presentPlayerIds: string[];
}

export interface OpsRecapDraft {
  headline: string;
  summary: string;
  highlight: string;
  publishNote: string;
}

export interface OpsPlayer {
  id: string;
  name: string;
  callsign: string;
  colorName: string;
  colorHex: string;
  role: string;
  status: string;
  title: string;
  lastSeen: string;
}

export interface OpsSeason {
  id: string;
  name: string;
  state: 'active' | 'planning' | 'closed';
  startDate: string;
  currentWeek: string;
  sessionCount: number;
  theme: string;
}

export interface AwardTemplate {
  id: string;
  title: string;
  detail: string;
}

export interface AwardAssignment {
  id: string;
  playerId: string;
  title: string;
  reason: string;
  state: 'assigned' | 'queued';
}

export interface MediaPlaceholderItem {
  id: string;
  name: string;
  type: string;
  state: 'waiting' | 'ready';
  note: string;
}

export interface CorrectionItem {
  id: string;
  subject: string;
  area: string;
  issue: string;
  currentValue: string;
  status: 'Needs correction' | 'Reviewing' | 'Fixed';
}
