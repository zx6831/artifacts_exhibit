# Current State
Last updated: 2026-10-11 18:38 +08:00
Current branch: main
Current phase: Homepage loading system, per-element shimmer, and project-detail route presentation implemented

## Current Objective
Maintain the Vite/React portfolio homepage and project-detail routes with route-appropriate loading UI.

## Completed
- Preserved one-time outer scroll-reveal and internal staggered entry animations for proof, work, skills, and about sections.
- Added independent 400px-preloaded JSON resources with skeleton, error, retry, and in-place content fade states.
- Added an inline HTML/CSS boot skeleton before React/background video readiness, including per-element shimmer with light/dark tokens and reduced-motion support.
- Project-detail routes no longer render the top navigation bar; the theme toggle remains available.
- Added a query-aware detail boot skeleton matching the actual return row, split Hero, project goal/facts grid, and evidence section. The homepage boot skeleton is hidden on `?project=` routes.
- Committed and pushed the implemented loading and detail-route work to `origin/main` as `27c8978`.

## In Progress
- Optional manual visual review of shimmer intensity remains available.

## Architecture and Key Decisions
- `src/App.tsx` keeps `Shell` shared; `showNavigation={!projectId}` omits only `TubelightNavBar` on project-detail routes.
- A short inline `index.html` script applies `boot-detail-route` before the React module starts, selecting the correct boot skeleton without waiting for JavaScript bundles.
- The HTML route marker intentionally differs from the `.boot-detail` container class to avoid selector collisions.
- Background video remains decorative and does not gate the loading UI.

## Validation Status
- `npm run build` — passed after detail-route changes.
- Slow 3G-equivalent CDP test (400ms latency, 6400 B/s down, cache-bypassing reload) — passed: at 3s React was not mounted, the detail boot skeleton was displayed and the homepage skeleton hidden; at 6s the detail grid, facts, and evidence placeholders were present.
- Post-load browser check — passed: project detail rendered Hero/grid/theme toggle, boot skeleton was hidden, and top-navigation count was 0.
- `git diff --check` — passed before the implementation commit.
- `git push origin main` — succeeded for `27c8978`.

## Known Problems
- The desktop computer-control/viewer channel is blocked by a sandbox lock, so subjective screenshot inspection is unavailable here; computed-style and CDP checks completed successfully.
- Pre-existing deleted files remain in the worktree and were not changed by this task.

## Blockers
- None.

## Important Files
- `index.html`
- `src/App.tsx`
- `src/index.css`
- `public/data/home-summary.json`
- `public/data/home-work.json`
- `public/data/home-skills.json`
- `public/data/home-about.json`