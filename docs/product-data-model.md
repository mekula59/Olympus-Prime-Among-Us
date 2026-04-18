# Product Data Model

The app is now organized around a Hub-first product model with game modules layered on top.

## Source Layers

Canonical records

- [src/data/productSource.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productSource.ts)
- [src/types/product.ts](/Users/mekula/olympus-prime-amongus-hq/src/types/product.ts)

Shared selectors

- [src/data/productSelectors.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productSelectors.ts)

Repository boundary

- facade: [src/data/productRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productRepository.ts)
- contract: [src/types/productRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/types/productRepository.ts)
- local adapter: [src/data/repositories/localProductRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/repositories/localProductRepository.ts)
- Supabase scaffold: [src/data/repositories/supabaseProductRepository.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/repositories/supabaseProductRepository.ts)

Hub selectors

- [src/data/hub/hubSelectors.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/hub/hubSelectors.ts)

Among Us module data

- [src/data/games/among-us/amongUsData.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/games/among-us/amongUsData.ts)
- [src/hooks/games/among-us/useAmongUsPublicSyncState.ts](/Users/mekula/olympus-prime-amongus-hq/src/hooks/games/among-us/useAmongUsPublicSyncState.ts)

Ops data split

- generic ops: [src/data/ops/hubOpsData.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/ops/hubOpsData.ts)
- Among Us ops: [src/data/games/among-us/amongUsOpsData.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/games/among-us/amongUsOpsData.ts)

## Core Entities

- `games`
- `players`
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
- `media_uploads`
- `publish_state`
- `rivalry_summaries`

## Practical Modeling Rules

- Keep one source-of-truth record per domain entity.
- Use stable `id` fields and foreign keys so Supabase wiring stays simple later.
- Keep display-specific atmosphere out of base records.
- Put game-specific presentation in module selectors/data, not in Hub selectors.
- Keep generic Ops broad and reusable.
- Keep staged engine behavior local to the Among Us module.

## Current Responsibility Split

Hub-level pages depend on:

- players
- seasons
- sessions
- recaps
- awards
- quotes
- games

Among Us pages depend on:

- shared canonical records
- Among Us-specific selectors and derived presentation
- Among Us public sync state from the staged engine

Generic Ops depends on:

- broad session/review/publish data
- no game-specific staged engine assumptions

Among Us Ops depends on:

- the staged session engine
- [src/data/sessionEngine.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/sessionEngine.ts)
- [src/hooks/useSessionEngine.ts](/Users/mekula/olympus-prime-amongus-hq/src/hooks/useSessionEngine.ts)
- [src/pages/ops/among-us/AmongUsOpsEnginePage.tsx](/Users/mekula/olympus-prime-amongus-hq/src/pages/ops/among-us/AmongUsOpsEnginePage.tsx)

## Ops Stage Mapping

Among Us staged engine

- `Boot Session` -> `sessions`
- `Load Crew` -> `session_participants`
- `Log Matches` -> `matches`
- `Resolve Outcomes` -> `outcomes`
- `Assign Awards` -> `awards`
- `Draft Report` -> `recaps` and related `quotes`
- `Transmit to HQ` -> `media_uploads` and `publish_state`

This keeps the UI staged while keeping the source data practical and Supabase-friendly.
