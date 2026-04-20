-- Olympus Prime Gamesnight Hub
-- Auth / ownership / RLS write phase
-- Safe phase only:
-- - owner/admin write policies for sessions
-- - owner/admin write policies for session-scoped child tables
-- Public published reads and workspace member reads remain unchanged.

drop policy if exists "sessions_owner_admin_insert" on sessions;
create policy "sessions_owner_admin_insert"
on sessions
for insert
to authenticated
with check (
  owner_user_id is not null
  and (
    is_admin(auth.uid())
    or (
      is_active_member(auth.uid())
      and owner_user_id = auth.uid()
    )
  )
);

drop policy if exists "sessions_owner_admin_update" on sessions;
create policy "sessions_owner_admin_update"
on sessions
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), id)
  )
)
with check (
  owner_user_id is not null
  and (
    is_admin(auth.uid())
    or owner_user_id = auth.uid()
  )
);

drop policy if exists "sessions_owner_admin_delete" on sessions;
create policy "sessions_owner_admin_delete"
on sessions
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), id)
  )
);

drop policy if exists "session_participants_owner_admin_insert" on session_participants;
create policy "session_participants_owner_admin_insert"
on session_participants
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "session_participants_owner_admin_update" on session_participants;
create policy "session_participants_owner_admin_update"
on session_participants
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "session_participants_owner_admin_delete" on session_participants;
create policy "session_participants_owner_admin_delete"
on session_participants
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "matches_owner_admin_insert" on matches;
create policy "matches_owner_admin_insert"
on matches
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "matches_owner_admin_update" on matches;
create policy "matches_owner_admin_update"
on matches
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "matches_owner_admin_delete" on matches;
create policy "matches_owner_admin_delete"
on matches
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "outcomes_owner_admin_insert" on outcomes;
create policy "outcomes_owner_admin_insert"
on outcomes
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "outcomes_owner_admin_update" on outcomes;
create policy "outcomes_owner_admin_update"
on outcomes
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "outcomes_owner_admin_delete" on outcomes;
create policy "outcomes_owner_admin_delete"
on outcomes
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "awards_owner_admin_insert" on awards;
create policy "awards_owner_admin_insert"
on awards
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "awards_owner_admin_update" on awards;
create policy "awards_owner_admin_update"
on awards
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "awards_owner_admin_delete" on awards;
create policy "awards_owner_admin_delete"
on awards
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "quotes_owner_admin_insert" on quotes;
create policy "quotes_owner_admin_insert"
on quotes
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    session_id is not null
    and is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "quotes_owner_admin_update" on quotes;
create policy "quotes_owner_admin_update"
on quotes
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    session_id is not null
    and is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    session_id is not null
    and is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "quotes_owner_admin_delete" on quotes;
create policy "quotes_owner_admin_delete"
on quotes
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    session_id is not null
    and is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "recaps_owner_admin_insert" on recaps;
create policy "recaps_owner_admin_insert"
on recaps
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "recaps_owner_admin_update" on recaps;
create policy "recaps_owner_admin_update"
on recaps
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "recaps_owner_admin_delete" on recaps;
create policy "recaps_owner_admin_delete"
on recaps
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "publish_states_owner_admin_insert" on publish_states;
create policy "publish_states_owner_admin_insert"
on publish_states
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "publish_states_owner_admin_update" on publish_states;
create policy "publish_states_owner_admin_update"
on publish_states
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "publish_states_owner_admin_delete" on publish_states;
create policy "publish_states_owner_admin_delete"
on publish_states
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "media_uploads_owner_admin_insert" on media_uploads;
create policy "media_uploads_owner_admin_insert"
on media_uploads
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "media_uploads_owner_admin_update" on media_uploads;
create policy "media_uploads_owner_admin_update"
on media_uploads
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "media_uploads_owner_admin_delete" on media_uploads;
create policy "media_uploads_owner_admin_delete"
on media_uploads
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "incidents_owner_admin_insert" on incidents;
create policy "incidents_owner_admin_insert"
on incidents
for insert
to authenticated
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "incidents_owner_admin_update" on incidents;
create policy "incidents_owner_admin_update"
on incidents
for update
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
)
with check (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);

drop policy if exists "incidents_owner_admin_delete" on incidents;
create policy "incidents_owner_admin_delete"
on incidents
for delete
to authenticated
using (
  is_admin(auth.uid())
  or (
    is_active_member(auth.uid())
    and owns_session(auth.uid(), session_id)
  )
);
