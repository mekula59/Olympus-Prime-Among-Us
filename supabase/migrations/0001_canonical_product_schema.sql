-- Olympus Prime Gamesnight Hub
-- Canonical product schema scaffold
-- Safe phase: schema shape only, no seed inserts yet.

create table if not exists games (
  id text primary key,
  slug text not null unique,
  name text not null,
  short_name text not null,
  status text not null,
  is_flagship boolean not null default false,
  module_path text,
  summary text not null,
  theme text not null
);

create table if not exists seasons (
  id text primary key,
  name text not null,
  code text not null unique,
  status text not null,
  start_date date not null,
  end_date date,
  current_week_label text not null,
  theme text not null
);

create table if not exists badges (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  tone text not null
);

create table if not exists titles (
  id text primary key,
  name text not null,
  description text not null,
  tone text not null
);

create table if not exists players (
  id text primary key,
  callsign text not null,
  full_name text not null,
  color_name text not null,
  color_hex text not null,
  role_label text not null,
  status text not null,
  status_note text not null,
  profile_tone text not null,
  bio text not null,
  signature_move text not null,
  alibi_style text not null,
  current_title_id text references titles(id),
  primary_badge_id text references badges(id),
  joined_season_id text references seasons(id)
);

create table if not exists player_allies (
  player_id text not null references players(id) on delete cascade,
  ally_player_id text not null references players(id) on delete cascade,
  primary key (player_id, ally_player_id)
);

create table if not exists player_habits (
  id bigserial primary key,
  player_id text not null references players(id) on delete cascade,
  note text not null,
  sort_order integer not null default 0
);

create table if not exists player_tells (
  id bigserial primary key,
  player_id text not null references players(id) on delete cascade,
  note text not null,
  sort_order integer not null default 0
);

create table if not exists sessions (
  id text primary key,
  game_id text not null references games(id),
  season_id text not null references seasons(id),
  label text not null,
  session_number integer not null,
  scheduled_at timestamptz not null,
  venue text not null,
  format text not null,
  host_player_id text not null references players(id),
  status text not null,
  attendance_count integer not null default 0,
  winning_player_id text references players(id),
  host_notes text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists session_participants (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  player_id text not null references players(id),
  attendance_status text not null,
  finish_status text not null,
  played_matches integer not null default 0,
  win_count integer not null default 0,
  note text not null
);

create table if not exists matches (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  sequence integer not null,
  title text not null,
  location_label text not null,
  tag_label text not null,
  result_label text not null,
  summary text not null,
  detail text not null,
  artifact_label text not null,
  tone text not null,
  legend_candidate boolean not null default false
);

create table if not exists outcomes (
  id text primary key,
  session_id text not null unique references sessions(id) on delete cascade,
  winner_player_id text references players(id),
  verdict text not null,
  flagged_summary text not null,
  status text not null
);

create table if not exists awards (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  player_id text not null references players(id),
  award_type text not null,
  definition_id text not null,
  reason text not null,
  state text not null
);

create table if not exists quotes (
  id text primary key,
  speaker_label text not null,
  player_id text references players(id),
  session_id text references sessions(id) on delete cascade,
  match_id text references matches(id) on delete cascade,
  context text not null,
  channel text,
  location_label text,
  stamp text,
  text text not null,
  tone text not null
);

create table if not exists incidents (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  match_id text references matches(id) on delete set null,
  title text not null,
  severity_label text not null,
  status_label text not null,
  summary text not null,
  thread_label text not null,
  reporter_player_id text references players(id),
  visibility text not null,
  tone text not null
);

create table if not exists recaps (
  id text primary key,
  session_id text not null unique references sessions(id) on delete cascade,
  headline text not null,
  summary text not null,
  highlight text not null,
  publish_note text not null,
  verdict text not null,
  recommendation text not null,
  status text not null
);

create table if not exists publish_states (
  id text primary key,
  session_id text not null unique references sessions(id) on delete cascade,
  report_status text not null,
  awards_status text not null,
  media_status text not null,
  public_status text not null,
  transmitted_at timestamptz
);

create table if not exists media_uploads (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  recap_id text references recaps(id) on delete set null,
  label text not null,
  type text not null,
  status text not null,
  note text not null,
  sort_order integer not null default 0
);

create table if not exists rivalry_summaries (
  id text primary key,
  player_a_id text not null references players(id),
  player_b_id text not null references players(id),
  season_id text references seasons(id),
  summary text not null,
  heat_label text not null,
  state_label text not null,
  tone text not null
);

create index if not exists sessions_game_id_idx on sessions(game_id);
create index if not exists sessions_season_id_idx on sessions(season_id);
create index if not exists session_participants_session_id_idx on session_participants(session_id);
create index if not exists matches_session_id_idx on matches(session_id);
create index if not exists awards_session_id_idx on awards(session_id);
create index if not exists quotes_session_id_idx on quotes(session_id);
create index if not exists media_uploads_session_id_idx on media_uploads(session_id);
