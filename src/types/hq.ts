export type Tone = 'warm' | 'cool' | 'hot' | 'quiet';

export interface CommandStat {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}

export interface ZoneFeature {
  name: string;
  mood: string;
  description: string;
  destination: string;
  tone: Tone;
}

export interface Readout {
  title: string;
  detail: string;
}

export interface CrewRanking {
  id: string;
  name: string;
  callsign: string;
  colorName: string;
  colorHex: string;
  role: string;
  wins: number;
  readScore: number;
  badge: string;
  streak: string;
  signature: string;
  tone: Tone;
}

export interface CrewRibbon {
  title: string;
  winner: string;
  detail: string;
  tone: Tone;
}

export interface CrewProfile {
  id: string;
  name: string;
  callsign: string;
  colorName: string;
  colorHex: string;
  role: string;
  rank: string;
  status: string;
  quote: string;
  bio: string;
  signatureMove: string;
  alibiStyle: string;
  trustCircle: string[];
  habits: string[];
  tells: string[];
  tone: Tone;
}

export interface MissionLog {
  stamp: string;
  title: string;
  location: string;
  tag: string;
  summary: string;
  detail: string;
  tone: Tone;
}

export interface ReportMetric {
  label: string;
  value: number;
  note: string;
  tone: Tone;
}

export interface ZoneDebrief {
  zone: string;
  outcome: string;
  detail: string;
  tone: Tone;
}

export interface LegendEntry {
  title: string;
  season: string;
  result: string;
  myth: string;
  witness: string;
  relic: string;
  tone: Tone;
}

export interface IncidentNote {
  title: string;
  severity: string;
  state: string;
  detail: string;
  thread: string;
  owner: string;
  tone: Tone;
}

export interface Transmission {
  title: string;
  stamp: string;
  author: string;
  channel: string;
  body: string;
  tone: Tone;
}

export interface OpsWidget {
  title: string;
  subtitle: string;
  lines: string[];
  state: 'stable' | 'monitoring' | 'action';
}
