---
name: staging-smoke-test
description: Use when running a launch-readiness or staging smoke test for public routes, Ops auth, Supabase persistence, publish/transmit, and visible sync state.
---

# Staging Smoke Test

Use this skill to verify the current Supabase-backed build without redesigning or adding features.

## Smoke Areas

- Anonymous public access to Hub routes.
- Games, Players, Seasons, Yearbook, and Player Profile.
- Among Us Overview and Rankings.
- Ops sign-in entrypoint.
- Authenticated member-only `/ops*` access.
- Generic session create/edit/save.
- Among Us session engine persistence.
- Publish/transmit flow.
- Public surface updates after publish.
- Visible sync state for pending/saved/failed writes.
- X Public Signal fallback behavior.

## Workflow

1. Start or confirm the local preview/dev server.
2. Check Console errors and obvious failed Network requests.
3. Test anonymous public routes first.
4. Test `/ops*` unauthenticated gate.
5. Test authenticated non-member and member paths when credentials are available.
6. Test one create/edit/save flow only unless deeper QA is requested.
7. Report blockers, high-risk rough edges, and safe deferrals.

## Rules

- Do not redesign.
- Do not change routes.
- Do not broaden into feature work.
- Fix only true launch blockers when asked to fix.
