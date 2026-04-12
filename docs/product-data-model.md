# Olympus Prime Product Data Model

This project now separates core source records from page-specific display models.

- Core mock source data lives in [src/data/productSource.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productSource.ts)
- Lookup/query helpers live in [src/data/productSelectors.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/productSelectors.ts)
- Public page view models live in [src/data/hqData.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/hqData.ts)
- Ops/admin view models live in [src/data/opsData.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/opsData.ts)

## Modeling rules

- Use one record per domain entity with stable `id` fields.
- Prefer foreign keys over nested objects for anything that may become a real relation in Supabase.
- Keep atmospheric UI copy and leaderboard/report snapshots in the view-model layer, not in core tables.
- Keep admin forms close to source records so future Supabase writes stay simple.
- Add standard Supabase audit columns later on every table: `created_at`, `updated_at`, and where useful `published_at` / `archived_at`.

## Entities

### `players`
- Purpose: canonical player identity and profile data.
- Key fields: `id`, `callsign`, `fullName`, `roleLabel`, `status`, `statusNote`, `profileTone`, `bio`, `signatureMove`, `alibiStyle`, `currentTitleId`, `primaryBadgeId`, `joinedSeasonId`, `allyIds`, `habitNotes`, `tellNotes`.
- Relationships: belongs to one joined season, may point to one current title and one primary badge, appears in many session participants, awards, quotes, incidents, and rivalry summaries.
- Source of truth: `players` table.
- Depends on it: Crew Rankings, Crew File, Ops player management, session entry winner picker, awards assignment, rivalry displays.

### `seasons`
- Purpose: top-level arc for a run of gamesnights.
- Key fields: `id`, `name`, `code`, `status`, `startDate`, `endDate`, `currentWeekLabel`, `theme`.
- Relationships: has many sessions, indirectly groups awards, recaps, incidents, and rivalries.
- Source of truth: `seasons` table.
- Depends on it: Ops season management, session entry season picker, future season filters for reports and archives.

### `sessions`
- Purpose: one gamesnight event entry.
- Key fields: `id`, `seasonId`, `label`, `sessionNumber`, `scheduledAt`, `venue`, `format`, `hostPlayerId`, `status`, `attendanceCount`, `winningPlayerId`, `hostNotes`.
- Relationships: belongs to one season, has many matches, session participants, awards, incidents, recap, media uploads, and quotes.
- Source of truth: `sessions` table.
- Depends on it: Command Center readouts, Mission Report, Mission Logs, Prime Legends Archive, Ops dashboard shell, new mission/session entry flow.

### `matches`
- Purpose: one logged round or memorable unit inside a session.
- Key fields: `id`, `sessionId`, `sequence`, `title`, `locationLabel`, `tagLabel`, `resultLabel`, `summary`, `detail`, `artifactLabel`, `tone`, `legendCandidate`.
- Relationships: belongs to one session, may have related quotes and incidents.
- Source of truth: `matches` table.
- Depends on it: Mission Logs, Prime Legends Archive, Mission Report atmosphere, future per-round drill-downs.

### `session_participants`
- Purpose: attendance and night-specific player participation.
- Key fields: `id`, `sessionId`, `playerId`, `attendanceStatus`, `finishStatus`, `playedMatches`, `winCount`, `note`.
- Relationships: joins players to sessions.
- Source of truth: `session_participants` table.
- Depends on it: session entry checked-in crew, winner context, future rankings derivation, recap helpers, attendance/admin flows.

### `awards`
- Purpose: assignment record for a badge or title on a specific session.
- Key fields: `id`, `sessionId`, `playerId`, `awardType`, `definitionId`, `reason`, `state`.
- Relationships: belongs to one session and one player, references either a badge or a title definition.
- Source of truth: `awards` table.
- Depends on it: Crew Rankings ribbons, title assignment history, Ops awards flow, recap publishing checks.

### `badges`
- Purpose: reusable award definitions for profile prestige or nightly ribbons.
- Key fields: `id`, `name`, `category`, `description`, `tone`.
- Relationships: referenced by `players.primaryBadgeId` and badge-type awards.
- Source of truth: `badges` table.
- Depends on it: Crew Rankings badge labels, nightly ribbon cards, future achievement filters.

### `titles`
- Purpose: reusable player title definitions.
- Key fields: `id`, `name`, `description`, `tone`.
- Relationships: referenced by `players.currentTitleId` and title-type awards.
- Source of truth: `titles` table.
- Depends on it: Crew File rank display, Ops player editor, Ops title assignment flow, future player history.

### `quotes`
- Purpose: memorable lines, whispers, witness reactions, and transmission bodies.
- Key fields: `id`, `speakerLabel`, `playerId`, `sessionId`, `matchId`, `context`, `channel`, `locationLabel`, `stamp`, `text`, `tone`.
- Relationships: can belong to a player, session, and match.
- Source of truth: `quotes` table.
- Depends on it: Command Center whispers, Crew File quotes, Prime Legends witness lines, Transmission Reports, future recap enrichment.

### `incidents`
- Purpose: structured suspicion/case records tied to a session or round.
- Key fields: `id`, `sessionId`, `matchId`, `title`, `severityLabel`, `statusLabel`, `summary`, `threadLabel`, `reporterPlayerId`, `visibility`, `tone`.
- Relationships: belongs to one session, may belong to one match, may be reported by one player.
- Source of truth: `incidents` table.
- Depends on it: Incident Board, Mission Report cues, Command Center suspicion signals, future moderation/review tooling.

### `outcomes`
- Purpose: canonical resolved result for a session.
- Key fields: `id`, `sessionId`, `winnerPlayerId`, `verdict`, `flaggedSummary`, `status`.
- Relationships: one-to-one with a session and linked indirectly to participants, awards, recap, and publish state.
- Source of truth: `outcomes` table.
- Depends on it: Ops outcome resolution, session winner state, report summary, final publish gating.

### `recaps`
- Purpose: drafted or published night summary.
- Key fields: `id`, `sessionId`, `headline`, `summary`, `highlight`, `publishNote`, `verdict`, `recommendation`, `status`.
- Relationships: one-to-one with a session, may connect to media uploads.
- Source of truth: `recaps` table.
- Depends on it: Mission Report, Command Center summary cues, Ops recap drafting/publishing flow.

### `media_uploads`
- Purpose: screenshots, photo sets, and clips linked to a session or recap.
- Key fields: `id`, `sessionId`, `recapId`, `label`, `type`, `status`, `note`, `sortOrder`.
- Relationships: belongs to one session, may belong to one recap.
- Source of truth: `media_uploads` table plus Supabase Storage for actual files.
- Depends on it: Ops media placeholder/upload flow, recap completeness checks, future gallery surfaces.

### `publish_state`
- Purpose: final operational record describing what is verified, transmitted, and public.
- Key fields: `id`, `sessionId`, `reportStatus`, `awardsStatus`, `mediaStatus`, `publicStatus`, `transmittedAt`.
- Relationships: one-to-one with a session and used as the final gate after outcomes, awards, recap, and media are ready.
- Source of truth: `publish_state` table.
- Depends on it: Ops transmit stage, future moderation/release workflows, public-side visibility rules.

### `rivalry_summaries`
- Purpose: lightweight social graph summaries that explain recurring tension or chemistry.
- Key fields: `id`, `playerAId`, `playerBId`, `seasonId`, `summary`, `heatLabel`, `stateLabel`, `tone`.
- Relationships: links two players and optionally one season.
- Source of truth: `rivalry_summaries` table.
- Depends on it: Crew File social gravity, Command Center rumor texture, future matchup/rivalry surfaces.

## Session Engine Mapping

The staged Ops Console is now backed by a canonical engine layer in:

- [src/data/sessionEngine.ts](/Users/mekula/olympus-prime-amongus-hq/src/data/sessionEngine.ts)
- [src/types/sessionEngine.ts](/Users/mekula/olympus-prime-amongus-hq/src/types/sessionEngine.ts)
- [src/hooks/useSessionEngine.ts](/Users/mekula/olympus-prime-amongus-hq/src/hooks/useSessionEngine.ts)

Stage-to-record mapping:

- `Boot Session`
  Source of truth: `sessions`
  Derived public state: room header, session identity, command-room status
- `Load Crew`
  Source of truth: `session_participants`
  Derived public state: which players are live in the session and visible in summaries
- `Log Matches`
  Source of truth: `matches`
  Derived public state: mission logs, legend candidates, report timeline
- `Resolve Outcomes`
  Source of truth: `outcomes`
  Derived public state: winner, verdict, flagged review state
- `Assign Awards`
  Source of truth: `awards`
  Derived public state: player titles, award ribbons, ranking flavor
- `Draft Report`
  Source of truth: `recaps`
  Derived public state: mission report content and publish-ready summary
- `Transmit to HQ`
  Source of truth: `media_uploads`, `publish_state`
  Derived public state: final public visibility/readiness

This keeps stage logic centralized: the page renders the engine, but the record mapping and stage transitions live outside the page component.

## Practical Supabase shape

- `players`, `seasons`, `sessions`, `matches`, `session_participants`, `awards`, `badges`, `titles`, `quotes`, `incidents`, `outcomes`, `recaps`, `media_uploads`, `publish_state`, and `rivalry_summaries` should each map to one table.
- `media_uploads` should store metadata only; the file itself belongs in Supabase Storage.
- Arrays such as `habitNotes`, `tellNotes`, and `allyIds` are acceptable for now because they are profile content, not query-heavy relational data. If they become editable at scale, they can move to child tables later.
- Public ranking numbers and report metrics are currently treated as derived/view data, not base tables.

## Current alignment

- The app now derives public HQ page data from normalized product records instead of page-specific blobs.
- The Ops Console now runs from a staged session engine that maps directly to canonical session, participant, match, outcome, award, recap, media, and publish-state records.
- Display-only content still exists where it should: route metadata, atmospheric labels, and curated report/ranking snapshots.
