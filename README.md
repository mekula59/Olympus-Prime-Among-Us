# Olympus Prime Gamesnight Hub

Olympus Prime Gamesnight Hub is a mobile-first React + TypeScript frontend for a Discord-first community.

Discord remains the live home for planning, reminders, banter, and real-time session energy. The site is the companion layer: memory, player identity, season archive, rankings, recaps, and yearbook.

Among Us is the flagship game module inside the Hub, not the whole product.

## Product Framing

- `Discord first`: scheduling, chatter, reactions, live coordination
- `Site second`: archive, recap, rankings, profiles, yearbook
- `Hub first`: broad Olympus Prime layer across recurring gamesnights
- `Among Us flagship`: the richest game-specific memory module inside `Games`

## Current Route Map

Hub routes

- `#/`
- `#/players`
- `#/players/profile`
- `#/seasons`
- `#/seasons/current`
- `#/yearbook`
- `#/games`

Among Us routes

- `#/games/among-us`
- `#/games/among-us/rankings`
- `#/games/among-us/players`
- `#/games/among-us/sessions`
- `#/games/among-us/reports`
- `#/games/among-us/archive`

Ops routes

- `#/ops`
- `#/ops/sessions/new`
- `#/ops/sessions/:sessionId`
- `#/ops/among-us`
- `#/ops/among-us/sessions/:sessionId`

## Architecture Overview

App shell

- The global shell is calm, broad, and Hub-first.
- Among Us-specific styling is scoped to the module routes.
- Navigation uses hash routes for simple static deployment.

Data model

- Canonical source records live in [src/data/productSource.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productSource.ts)
- Shared selectors live in [src/data/productSelectors.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productSelectors.ts)
- Hub-level derived selectors live in [src/data/hub/hubSelectors.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/hub/hubSelectors.ts)
- Among Us module data lives in [src/data/games/among-us/amongUsData.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/games/among-us/amongUsData.ts)

Ops split

- Generic Hub Ops stays lightweight and broad:
  - [src/pages/ops/OpsHomePage.tsx](/Users/mekula/olympus-prime-amongus-hq/src/pages/ops/OpsHomePage.tsx)
  - [src/pages/ops/SessionEditorPage.tsx](/Users/mekula/olympus-prime-amongus-hq/src/pages/ops/SessionEditorPage.tsx)
- Among Us Ops keeps the staged session engine:
  - [src/pages/ops/among-us/AmongUsOpsSessionPage.tsx](/Users/mekula/olympus-prime-amongus-hq/src/pages/ops/among-us/AmongUsOpsSessionPage.tsx)
  - [src/pages/ops/among-us/AmongUsOpsEnginePage.tsx](/Users/mekula/olympus-prime-amongus-hq/src/pages/ops/among-us/AmongUsOpsEnginePage.tsx)

## Mobile-First Guidance

- Design for phone screens first.
- Prefer one strong focal area per screen.
- Keep actions thumb-friendly and obvious.
- Avoid spread-out desktop panel layouts.
- Treat Discord-linked visits as the main usage pattern: the page should make sense fast, often in one scroll.

## Stack

- React 19
- TypeScript
- Vite
- Plain CSS with a custom visual system

## Project Structure

```text
.
├── docs/
│   ├── design-direction.md
│   └── product-data-model.md
├── public/
│   └── assets/
├── src/
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Run type checks

```bash
npm run typecheck
```

## Docs

- Design direction: [docs/design-direction.md](/Users/mekula/olympus-prime-amongus-hq/docs/design-direction.md)
- Product data model: [docs/product-data-model.md](/Users/mekula/olympus-prime-amongus-hq/docs/product-data-model.md)
