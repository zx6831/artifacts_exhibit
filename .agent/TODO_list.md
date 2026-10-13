# TODO List

## P0 — Blocking

### [ ] Publish the mobile WebKit blank-screen fix
Status: ready
Depends on: Review of the local patch and a push to main
Blocked by: No technical blocker; pushing main automatically deploys the public site
Scope: src/App.tsx, scripts/check-webkit-navigation.py, scripts/fixtures/home-about-old.json, .agent state files
Acceptance criteria:
- The GitHub Pages workflow builds and deploys the new commit.
- The live JavaScript requests /data/home-about.json?v=2.
- The site remains visible after section navigation.
Validation:
- npm run build
- git diff --check
- Inspect the GitHub Pages workflow result and the live site

### [ ] Confirm the deployed fix on the user's iPhone 16 Pro
Status: blocked
Depends on: Published fix
Blocked by: The fix is not deployed and the physical iPhone is not available in this Windows session
Scope: iOS Safari and iOS WeChat browser at https://206831.xyz/
Acceptance criteria:
- Tapping every top navigation item leaves navigation, background, and content visible.
- Scrolling into Honours and About leaves the page visible.
- Direct /#work and /#about links show the intended section.
Validation:
- Test on the physical iPhone after deployment; capture Safari Web Inspector errors if any path still blanks

## P2 — Later

### [ ] Add stronger public artefacts and measured outcomes
Status: deferred
Depends on: Verified screenshots, demos, reports, or measured results from the user
Blocked by: Several private/team project artefacts are unavailable
Scope: Project cards and detail pages
Acceptance criteria:
- Each project has a useful public artefact or an explicit publication boundary.
- Outcome claims distinguish build/test evidence from effectiveness claims.
Validation:
- Audit each claim against supplied sources and review desktop/mobile rendering

### [ ] Perform a cold-cache throttled release check
Status: ready
Depends on: Browser throttling controls
Blocked by: None
Scope: Homepage and one project detail
Acceptance criteria:
- A visible skeleton remains until fonts or fallback are ready.
- No blank first viewport or replayed entrance animation occurs.
Validation:
- DevTools Slow 3G + Disable cache on / and /?project=pharmagent

### [ ] Resolve or rebaseline Fubao younger_plans Golden mismatch
Status: ready
Depends on: Decision whether the current Flutter/Skia rendering is intended
Blocked by: None
Scope: Private Fubao Flutter visual baseline
Acceptance criteria:
- Determine whether the prior 0.17% / 574-pixel mismatch is environmental or a regression.
- Fix or deliberately rebaseline the test.
Validation:
- flutter test from the Fubao app

## Completed

### [x] Prevent a stale About payload from unmounting the portfolio
Status: completed
Scope: src/App.tsx and WebKit regression fixture
Acceptance criteria:
- The old payload from commit 0264661 no longer causes an uncaught page error.
- Section navigation and scrolling retain the navigation and site content.
- Invalid data enters a retryable section error state.
Validation:
- npm run build passed on 2026-10-13.
- WebKit touch navigation passed with fresh and stale About data.
- WebKit scroll to awards with stale About data passed.
- git diff --check passed after state-file updates; line-ending notices only.

### [x] Unify all five honour-card structures and build the seven-project portfolio
Status: completed in HEAD db4ca64
Acceptance criteria:
- Cards share the same result, title, related-work, and source regions.
- Hero, projects, skills, honours, About, résumé, favicon, and metadata are present.
Validation:
- Prior Chromium desktop/mobile review and npm run build recorded in the 2026-10-13 handoff.