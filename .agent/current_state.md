# Current State
Last updated: 2026-10-13
Current branch: main (HEAD db4ca64, aligned with origin/main before this session's edits)
Current phase: Mobile WebKit blank-screen fix validated locally; production deployment and real-device check pending

## Current Objective
Keep the portfolio visible when iOS Safari or WeChat loads an older cached homepage JSON payload, including after section navigation and scrolling to Honours/About.

## Completed
- The site presents 王泽贤's seven projects, skills, five honours, biography, résumé, favicon, social image, and route-aware metadata.
- All five honour cards use the same desktop/tablet certificate layout and mobile stack.
- Reproduced a whole-app React crash in WebKit with the old home-about.json payload from commit 0264661: aboutData.research.map reads a field absent from that payload.
- The local fix validates schema-sensitive JSON before rendering, requests About data through a versioned URL with no-store, and keeps invalid payloads in a retryable section error state.
- The JSON loader distinguishes StrictMode cleanup aborts from actual resource errors and does not automatically retry rejected payloads indefinitely.

## In Progress
- The fix is uncommitted and not deployed to https://206831.xyz/.
- Real iPhone 16 Pro Safari and iOS WeChat validation is pending after deployment.

## Architecture and Key Decisions
- src/App.tsx owns routing, JSON resource loading, section navigation, metadata, and View Transitions.
- Homepage content lives in public/data/home-*.json; case details live in src/App.tsx and src/case-stories.tsx.
- A stale resource remains an error within its section; it must not unmount the navigation or other sections.
- GitHub Pages deployment is triggered by a push to main through .github/workflows/deploy-pages.yml.

## Validation Status
- npm run build passed on 2026-10-13: TypeScript and Vite completed, 1,588 modules transformed.
- git diff --check passed on 2026-10-13 after the state-file edits; Git printed line-ending notices only.
- python scripts/check-webkit-navigation.py --browser webkit --target work --delay 0 passed with a touch tap: hash #work, target top 90px, no page errors.
- The same command with --stale-about passed: one retryable resource error, navigation visible, target top 90px, no page errors.
- --mode direct --target about passed with fresh data; --mode scroll --target awards --stale-about kept the page and navigation visible with no page errors.
- https://206831.xyz/data/home-about.json?v=2 returned HTTP 200, confirming the static host accepts the versioned URL.

## Known Problems
- The exact cause on the physical iPhone is inferred from a matching WebKit crash, not yet verified with Safari device logs.
- The production site still serves the previous JavaScript until the fix is published.
- Several private/team projects still lack public screenshots, demos, measured outcomes, or individually attributed module records.

## Blockers
- Public deployment requires a push to main, which triggers GitHub Pages.
- Real-device confirmation requires the updated site to be live on the user's iPhone.

## Important Files
- src/App.tsx — data guards, resource loading, section navigation, and page rendering.
- scripts/check-webkit-navigation.py — mobile WebKit navigation and stale-data regression check.
- scripts/fixtures/home-about-old.json — pre-redesign About payload used to reproduce the crash.
- public/data/home-about.json — current biography data.
- .github/workflows/deploy-pages.yml — production release path.