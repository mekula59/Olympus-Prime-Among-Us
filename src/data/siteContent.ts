import type {
  CrewMood,
  HeroMetric,
  MemoryBeat,
  RitualStop,
  TransmissionNote,
} from '../types/content';

export const heroMetrics: HeroMetric[] = [
  {
    label: 'Signal strength',
    value: 'High chaos',
    detail: 'Everyone arrives pretending they will play calm this time.',
  },
  {
    label: 'Primary mode',
    value: 'Social deduction',
    detail: 'Quick rounds, louder meetings, and a lot of suspicious confidence.',
  },
  {
    label: 'Crew promise',
    value: 'No generic vibes',
    detail: 'This night is built around memory, banter, and retellable moments.',
  },
];

export const memoryBeats: MemoryBeat[] = [
  {
    title: 'The fake-task walk',
    copy: 'Somebody always moved with perfect confidence and absolutely no believable route.',
    note: 'It becomes obvious about two meetings too late.',
  },
  {
    title: 'The emergency spiral',
    copy: 'One button press turns a calm room into six overlapping alibis and one dramatic silence.',
    note: 'Nobody agrees on what they just heard.',
  },
  {
    title: 'The impossible accusation',
    copy: 'A wild theory lands, sounds ridiculous, then turns out to be exactly right.',
    note: 'The table never fully recovers.',
  },
  {
    title: 'The victory shout',
    copy: 'The final reveal hits and the room erupts like everyone was saving energy for that exact second.',
    note: 'That round gets retold all week.',
  },
];

export const ritualTimeline: RitualStop[] = [
  {
    slot: '19:00',
    title: 'Docking and snack sweep',
    detail: 'The crew settles in, controllers and chargers appear, and somebody immediately starts talking strategy.',
  },
  {
    slot: '19:20',
    title: 'Warm-up rounds',
    detail: 'Fast games, fast accusations, and the first reminder that being loud is not the same as being innocent.',
  },
  {
    slot: '20:00',
    title: 'Peak suspicion window',
    detail: 'This is where the reads get sharper, the bluffs get bolder, and every skipped vote feels personal.',
  },
  {
    slot: '21:00',
    title: 'Wildcard remix',
    detail: 'House rules, chaos rounds, or a quick mode switch to keep the energy from settling into routine.',
  },
  {
    slot: 'Late',
    title: 'One last round',
    detail: 'Nobody believes it is the last round, which is exactly why it is always the loudest one.',
  },
];

export const crewMoods: CrewMood[] = [
  {
    title: 'The Analyst',
    badge: 'Tracks routes',
    copy: 'Keeps mental notes on every movement, then still gets voted out for sounding too prepared.',
  },
  {
    title: 'The Chaos Witness',
    badge: 'Remembers vibes',
    copy: 'Has almost no hard evidence, but delivers accusations with the conviction of a courtroom closer.',
  },
  {
    title: 'The Silent Engineer',
    badge: 'Fixes comms',
    copy: 'Speaks rarely, survives often, and makes the room nervous the second they finally say one name.',
  },
  {
    title: 'The Lobby DJ',
    badge: 'Controls tempo',
    copy: 'Keeps the room warm between rounds, resets the mood after a betrayal, and knows when to run it back.',
  },
];

export const transmissionNotes: TransmissionNote[] = [
  {
    title: 'Bring your charge',
    detail: 'A suspicious disconnect in the middle of a final meeting is a terrible look.',
  },
  {
    title: 'Expect loud laughter',
    detail: 'The tone is playful, dramatic, and a little bit theatrical by design.',
  },
  {
    title: 'Claim your seat early',
    detail: 'The best stories always start before the first round actually begins.',
  },
];
