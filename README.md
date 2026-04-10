# Olympus Prime Gamesnight HQ

Olympus Prime Gamesnight HQ is a modern React + TypeScript frontend experience built around the memory of playing *Among Us*: warm ship lights, emergency-meeting tension, suspicious confidence, and the exact kind of laughter that turns one round into hallway folklore.

This is no longer a starter landing page. It is a navigable HQ experience with multiple in-world destinations, each designed to feel like a distinct room inside the same ship.

## Stack

- React 19
- TypeScript
- Vite
- Plain CSS with a custom visual system

## Experience Overview

The HQ currently includes:

- `Command Center`: the public-facing homepage and emotional core of the ship
- `Crew Rankings`: a lore-first podium gallery instead of a plain leaderboard
- `Crew File`: interactive dossier-style player profiles
- `Mission Logs`: a corridor of remembered round-by-round moments
- `Mission Report`: a calmer debrief space with atmospheric gauges and recap panels
- `Prime Legends Archive`: a vault for the rounds that became house lore
- `Incident Board`: an evidence-wall style internal record room
- `Transmission Reports`: announcements and lobby chatter drifting through the relay lounge
- `Ops Console`: a quieter, more practical host/admin shell

Navigation is handled in-app with hash routes, so each section behaves like a page while still shipping as a simple frontend app.

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

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Run a TypeScript check:

   ```bash
   npm run typecheck
   ```

## Design Overview

- The site uses a nostalgic sci-fi palette with warm warning lights, cool visor blues, and soft nebula haze.
- Layouts lean on rounded windows, cockpit-style panels, porthole-like modules, pinned notes, relay bubbles, and layered gradients.
- Each page is treated like a real zone in Olympus Prime, not a reused dashboard template.
- Copy is written like a remembered gamesnight instead of a feature list.
- The design references the feeling of *Among Us* without trying to recreate the game UI directly.
- The admin-facing `Ops Console` is intentionally calmer and more practical than the public zones while staying inside the same visual world.

See [docs/design-direction.md](./docs/design-direction.md) for the visual and content direction behind the build.
See [docs/product-data-model.md](./docs/product-data-model.md) for the normalized product schema and view-model split.

## Suggested Next Steps

- Add a real RSVP workflow or connect the CTA to your community platform.
- Swap placeholder event copy with Olympus Prime’s real schedule and hosts.
- Add motion polish or a CMS if the site will evolve beyond a landing page.
