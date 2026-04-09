# Olympus Prime Gamesnight

Olympus Prime Gamesnight is a modern TypeScript frontend scaffold for a one-page event site that captures the memory of playing *Among Us*: dark starfield glow, emergency-meeting energy, suspicious side-eyes, and the kind of chaos that turns a simple game night into a story everyone retells later.

This project is intentionally not a generic gaming dashboard. It is a mood-forward landing experience designed around nostalgia, social deduction, and Olympus Prime’s own crew ritual.

## Stack

- React 19
- TypeScript
- Vite
- Plain CSS with a custom visual system

## Project Structure

```text
.
├── docs/
│   └── design-direction.md
├── public/
│   └── assets/
├── src/
│   ├── components/
│   ├── data/
│   ├── sections/
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
- Layouts lean on rounded windows, cockpit-style panels, floating status chips, and layered gradients.
- Copy is written like a remembered gamesnight instead of a feature list.
- The design references the feeling of *Among Us* without trying to recreate the game UI directly.

See [docs/design-direction.md](./docs/design-direction.md) for the visual and content direction behind the build.

## Suggested Next Steps

- Add a real RSVP workflow or connect the CTA to your community platform.
- Swap placeholder event copy with Olympus Prime’s real schedule and hosts.
- Add motion polish or a CMS if the site will evolve beyond a landing page.
