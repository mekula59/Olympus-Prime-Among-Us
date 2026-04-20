-- Olympus Prime Gamesnight Hub
-- Auth / ownership / RLS read-first phase
-- Safe phase only:
-- - add auth-facing tables
-- - add ownership / audit columns
-- - add helper auth functions
-- - enable RLS on the first safe set of tables
-- - add public/reference and workspace read policies
-- No owner/admin write policies yet.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  discord_handle text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workspace_memberships (
  user_id uuid primary key references profiles(id) on delete cascade,
  role text not null check (role in ('editor', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table sessions
  add column if not exists owner_user_id uuid references profiles(id),
  add column if not exists last_edited_by_user_id uuid references profiles(id);

alter table session_participants
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table matches
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table outcomes
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table awards
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table quotes
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table recaps
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table publish_states
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table media_uploads
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table incidents
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create or replace function is_active_member(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from workspace_memberships membership
    where membership.user_id = uid
      and membership.is_active = true
      and membership.role in ('editor', 'admin')
  );
$$;

create or replace function is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from workspace_memberships membership
    where membership.user_id = uid
      and membership.is_active = true
      and membership.role = 'admin'
  );
$$;

create or replace function owns_session(uid uuid, target_session_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from sessions session_row
    where session_row.id = target_session_id
      and session_row.owner_user_id = uid
  );
$$;

alter table profiles enable row level security;
alter table workspace_memberships enable row level security;
alter table games enable row level security;
alter table seasons enable row level security;
alter table badges enable row level security;
alter table titles enable row level security;
alter table players enable row level security;
alter table player_allies enable row level security;
alter table player_habits enable row level security;
alter table player_tells enable row level security;
alter table rivalry_summaries enable row level security;
alter table sessions enable row level security;
alter table session_participants enable row level security;
alter table matches enable row level security;
alter table outcomes enable row level security;
alter table awards enable row level security;
alter table quotes enable row level security;
alter table incidents enable row level security;
alter table recaps enable row level security;
alter table publish_states enable row level security;
alter table media_uploads enable row level security;

drop policy if exists "profiles_self_or_admin_read" on profiles;
create policy "profiles_self_or_admin_read"
on profiles
for select
to authenticated
using (id = auth.uid() or is_admin(auth.uid()));

drop policy if exists "workspace_memberships_self_or_admin_read" on workspace_memberships;
create policy "workspace_memberships_self_or_admin_read"
on workspace_memberships
for select
to authenticated
using (user_id = auth.uid() or is_admin(auth.uid()));

drop policy if exists "games_public_read" on games;
create policy "games_public_read"
on games
for select
to anon, authenticated
using (true);

drop policy if exists "seasons_public_read" on seasons;
create policy "seasons_public_read"
on seasons
for select
to anon, authenticated
using (true);

drop policy if exists "badges_public_read" on badges;
create policy "badges_public_read"
on badges
for select
to anon, authenticated
using (true);

drop policy if exists "titles_public_read" on titles;
create policy "titles_public_read"
on titles
for select
to anon, authenticated
using (true);

drop policy if exists "players_public_read" on players;
create policy "players_public_read"
on players
for select
to anon, authenticated
using (true);

drop policy if exists "player_allies_public_read" on player_allies;
create policy "player_allies_public_read"
on player_allies
for select
to anon, authenticated
using (true);

drop policy if exists "player_habits_public_read" on player_habits;
create policy "player_habits_public_read"
on player_habits
for select
to anon, authenticated
using (true);

drop policy if exists "player_tells_public_read" on player_tells;
create policy "player_tells_public_read"
on player_tells
for select
to anon, authenticated
using (true);

drop policy if exists "rivalry_summaries_public_read" on rivalry_summaries;
create policy "rivalry_summaries_public_read"
on rivalry_summaries
for select
to anon, authenticated
using (true);

drop policy if exists "sessions_published_public_read" on sessions;
create policy "sessions_published_public_read"
on sessions
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "sessions_workspace_member_read" on sessions;
create policy "sessions_workspace_member_read"
on sessions
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "session_participants_published_public_read" on session_participants;
create policy "session_participants_published_public_read"
on session_participants
for select
to anon, authenticated
using (
  exists (
    select 1
    from sessions session_row
    where session_row.id = session_participants.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "session_participants_workspace_member_read" on session_participants;
create policy "session_participants_workspace_member_read"
on session_participants
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "matches_published_public_read" on matches;
create policy "matches_published_public_read"
on matches
for select
to anon, authenticated
using (
  exists (
    select 1
    from sessions session_row
    where session_row.id = matches.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "matches_workspace_member_read" on matches;
create policy "matches_workspace_member_read"
on matches
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "outcomes_published_public_read" on outcomes;
create policy "outcomes_published_public_read"
on outcomes
for select
to anon, authenticated
using (
  exists (
    select 1
    from sessions session_row
    where session_row.id = outcomes.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "outcomes_workspace_member_read" on outcomes;
create policy "outcomes_workspace_member_read"
on outcomes
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "awards_published_public_read" on awards;
create policy "awards_published_public_read"
on awards
for select
to anon, authenticated
using (
  exists (
    select 1
    from sessions session_row
    where session_row.id = awards.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "awards_workspace_member_read" on awards;
create policy "awards_workspace_member_read"
on awards
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "quotes_published_public_read" on quotes;
create policy "quotes_published_public_read"
on quotes
for select
to anon, authenticated
using (
  session_id is null
  or exists (
    select 1
    from sessions session_row
    where session_row.id = quotes.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "quotes_workspace_member_read" on quotes;
create policy "quotes_workspace_member_read"
on quotes
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "incidents_published_public_read" on incidents;
create policy "incidents_published_public_read"
on incidents
for select
to anon, authenticated
using (
  visibility = 'public'
  and exists (
    select 1
    from sessions session_row
    where session_row.id = incidents.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "incidents_workspace_member_read" on incidents;
create policy "incidents_workspace_member_read"
on incidents
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "recaps_published_public_read" on recaps;
create policy "recaps_published_public_read"
on recaps
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from sessions session_row
    where session_row.id = recaps.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "recaps_workspace_member_read" on recaps;
create policy "recaps_workspace_member_read"
on recaps
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "publish_states_published_public_read" on publish_states;
create policy "publish_states_published_public_read"
on publish_states
for select
to anon, authenticated
using (
  public_status = 'transmitted'
  and exists (
    select 1
    from sessions session_row
    where session_row.id = publish_states.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "publish_states_workspace_member_read" on publish_states;
create policy "publish_states_workspace_member_read"
on publish_states
for select
to authenticated
using (is_active_member(auth.uid()));

drop policy if exists "media_uploads_published_public_read" on media_uploads;
create policy "media_uploads_published_public_read"
on media_uploads
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from sessions session_row
    where session_row.id = media_uploads.session_id
      and session_row.status = 'published'
  )
);

drop policy if exists "media_uploads_workspace_member_read" on media_uploads;
create policy "media_uploads_workspace_member_read"
on media_uploads
for select
to authenticated
using (is_active_member(auth.uid()));
