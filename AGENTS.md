# Olympus Prime Gamesnight Hub

Use this repo as a Hub-first, Discord-first product for Olympus Prime gamesnight memory, identity, and Ops workflows.

## Local Skills

Repo-local Codex skills live in `.agents/skills/*/SKILL.md`.

- `worldbuilding-ui`: Use for targeted UI/product polish that preserves the current Olympus Prime launcher direction.
- `staging-smoke-test`: Use for practical smoke testing of the public Hub, game module, Ops gate, and persistence flows.
- `supabase-auth-ops`: Use for Supabase auth, membership, RLS, and Ops persistence work.

## Guardrails

- Do not redesign the product unless explicitly asked.
- Keep the route map, shell, and current UI direction stable.
- Prefer small, safe changes with typecheck/build verification.
- Public Hub and game pages stay public; `/ops*` requires authenticated workspace membership.
