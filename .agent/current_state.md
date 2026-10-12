# Current State
Last updated: 2026-10-12
Current branch: main (HEAD 9ca2f47, aligned with origin/main)
Current phase: Unified project-origin transitions and shadow cleanup implemented locally; changes uncommitted

## Current Objective
Every project entry in work, awards, and skills should expand into its detail and return to the exact clicked entry with stable viewport position.

## Completed
- The seven-case React/Vite portfolio and its existing visual design remain in place.
- Work-card, award-project, and skill-case links use one origin record: project ID, exact clicked element/title, original scroll position, radius, and URL/hash.
- Forward View Transition captures the origin before routing and resets detail scroll instantly inside the update callback. The surface and title have separate 450ms shared transitions; the page background uses a short opacity fade.
- Browser Back and detail top/bottom return links restore the original URL/hash and scroll. A visible detail masthead or bottom resources panel contracts into the saved origin. If no visible detail source or valid origin exists, return fades.
- Transition snapshots no longer add a heavy external shadow around the expanding/contracting card; the underlying card styling remains unchanged.
- Unsupported View Transition and reduced-motion paths navigate instantly.

## In Progress
- No further implementation work identified. Source and state changes remain uncommitted.

## Architecture and Key Decisions
- `src/App.tsx` owns routing, origin capture, dynamic View Transition names, manual history scroll restoration, and preserved homepage DOM.
- `src/index.css` defines surface/title transitions, root fade, and active-transition scroll override.
- Exact award/skill project links are origins because one card may contain several project links.
- Pre-existing unrelated scroll-reveal threshold and section-padding edits remain in the worktree.

## Validation Status
- `npm run build` passed on 2026-10-12 (TypeScript and Vite, 1,588 modules).
- `git diff --check` passed; Git only reported LF→CRLF working-copy notices.
- Chromium 1440×900: first/middle/last work projects entered at detail scrollY=0 and returned to identical list scrollY and card top.
- Chromium 390×844: work-card bottom return restored identical coordinates; award link from `/#awards` and skill link from the list returned to the same origin coordinates. Desktop skill from `/#skills` returned via detail top link with the original hash and coordinates. Award browser Back also restored `/#awards`.
- Desktop and 390×844 Chromium shadow probes: forward and reverse `::view-transition-image-pair(project-card)` computed `box-shadow: none`; detail started at scrollY=0 and return restored identical card coordinates.
- Simulated reduced motion navigated instantly and preserved the saved position.
- Real Safari/iOS WebKit was unavailable on this Windows host.

## Known Problems
- No observed Chromium geometry/scroll regression in tested routes.
- Prior Fubao Flutter younger_plans Golden mismatch (0.17% / 574 pixels) was not re-run in this website task.
- Approved personal name, portrait, and final résumé remain unavailable and omitted.

## Blockers
- Real Safari/iOS verification requires a WebKit/iOS device or browser service.

## Important Files
- `src/App.tsx` — route and scroll lifecycle, work/award/skill entries, detail links.
- `src/index.css` — View Transition animations.
- `.agent/handoff.md` — session-specific verification and next steps.