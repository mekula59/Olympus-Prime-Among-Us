---
name: supabase-auth-ops
description: Use when working on Supabase auth, workspace memberships, RLS policies, repository persistence, Ops route guards, or session publish/transmit data flow.
---

# Supabase Auth Ops

Use this skill for backend-friendly persistence, auth, and Ops access-control work.

## Current V1 Model

- Roles: `editor` and `admin`.
- Session ownership: `sessions.owner_user_id`.
- Editing audit: `sessions.last_edited_by_user_id`.
- Public reads: published public data.
- Workspace reads: authenticated active members.
- Writes: owner/admin.
- Child-table write permissions derive from parent session ownership/admin role.
- V1 multi-user editing is last-write-wins.
- No collaborator system in V1.

## Repository Rules

- Keep `productRepository` as the stable facade.
- Do not break selector outputs.
- Keep local runtime state as optimistic/cache/fallback, not primary source of truth when Supabase is configured.
- Preserve local fallback behavior if Supabase is unavailable.

## Auth/Ops Rules

- Public Hub and game pages stay public.
- `/ops*` requires authenticated active membership.
- Unauthenticated users should see a sign-in path.
- Authenticated non-members should see a clear membership-required state.
- Missing profile/membership rows should fail clearly, not blank the app.

## Workflow

1. Inspect the repository method or route guard involved.
2. Confirm whether the issue is auth, membership, RLS, data mapping, or runtime sync.
3. Make the smallest safe change.
4. Verify with `npm run typecheck` and `npm run build`.
5. Use browser DevTools for runtime auth/route bugs.
