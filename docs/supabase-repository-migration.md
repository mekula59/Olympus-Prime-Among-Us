# Supabase Repository Migration

This project now has a formal repository boundary so Supabase can replace local storage without forcing page or selector rewrites.

## Current Repository Layers

- facade: [src/data/productRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productRepository.ts)
- local adapter: [src/data/repositories/localProductRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/repositories/localProductRepository.ts)
- Supabase scaffold: [src/data/repositories/supabaseProductRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/repositories/supabaseProductRepository.ts)
- contract: [src/types/productRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/types/productRepository.ts)
- client scaffold: [src/lib/supabase.ts](/Users/mekula/olympus-prime-amongus-hq/src/lib/supabase.ts)

## Repository Contract

The stable contract is:

- `createSessionDraftRecord`
- `saveGenericSessionEditor`
- `persistSessionEngineDraft`
- `getDefaultHubOpsSessionId`
- `getCanonicalProductData`

Pages and engine flows should keep calling the facade layer, not a concrete adapter.

## Environment Variables

Supported scaffolding variables:

- `VITE_PRODUCT_REPOSITORY_DRIVER`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SCHEMA`

The facade currently defaults to `local`. It only switches to `supabase` when:

- `VITE_PRODUCT_REPOSITORY_DRIVER=supabase`
- Supabase URL and anon key are both configured

## Schema Scaffold

Initial SQL scaffold:

- [supabase/migrations/0001_canonical_product_schema.sql](/Users/mekula/olympus-prime-amongus-hq/supabase/migrations/0001_canonical_product_schema.sql)
- [supabase/migrations/0002_auth_rls_read_phase.sql](/Users/mekula/olympus-prime-amongus-hq/supabase/migrations/0002_auth_rls_read_phase.sql)
- [supabase/migrations/0003_owner_admin_write_policies.sql](/Users/mekula/olympus-prime-amongus-hq/supabase/migrations/0003_owner_admin_write_policies.sql)

It mirrors the canonical product model:

- `games`
- `players`
- `player_allies`
- `player_habits`
- `player_tells`
- `seasons`
- `sessions`
- `session_participants`
- `matches`
- `outcomes`
- `awards`
- `badges`
- `titles`
- `quotes`
- `incidents`
- `recaps`
- `publish_states`
- `media_uploads`
- `rivalry_summaries`

## Safe Next Step

Implement Supabase reads first behind `getCanonicalProductData`, using the same output shape as the local runtime store.

After that:

1. move `createSessionDraftRecord` to Supabase
2. move `saveGenericSessionEditor` to Supabase
3. move `persistSessionEngineDraft` to a bundled upsert strategy
4. keep local runtime state as optimistic UI / cache, not source of truth

## Auth / RLS Read Phase

The second migration adds the first safe auth/security layer without changing the repository facade:

- `profiles`
- `workspace_memberships`
- session ownership / audit columns
- helper auth functions
- read-first RLS policies for:
  - public reference data
  - published public session-derived data
  - authenticated workspace-member reads

Write policies are intentionally deferred to the next phase.

## Auth / RLS Write Phase

The third migration adds owner/admin write policies without changing repository signatures:

- editors can write only to sessions they own
- admins can write to all sessions
- child-table writes derive from parent session ownership/admin role

Public published reads and authenticated workspace-member reads remain unchanged.
