# TODO List

## P1 — Next

### [ ] Publish the system-theme, navigation, and seven-project changes
Status: ready
Depends on: Review of the local patch and a push to main
Blocked by: No technical blocker; pushing main automatically deploys the public site
Scope: index.html, src/App.tsx, public/data/home-summary.json, scripts/check-home-interactions.py, .agent state files
Acceptance criteria:
- The GitHub Pages workflow builds and deploys the new commit.
- The live site follows system light/dark by default, highlights About after 联系我, and shows seven application projects.
Validation:
- npm run build
- python scripts/check-home-interactions.py
- Inspect GitHub Pages workflow and live site

## P2 — Later

### [ ] Confirm the new theme behavior on the user's iPhone 16 Pro
Status: blocked
Depends on: Published changes
Blocked by: The new build is not live and the physical iPhone is not available in this Windows session
Scope: iOS Safari and iOS WeChat at https://206831.xyz/
Acceptance criteria:
- First load matches system light/dark without a mismatched skeleton flash.
- 联系我 selects 关于 and keeps the page visible.
- The proof strip shows 07 and the requested copy.
Validation:
- Physical iPhone check after deployment

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

### [x] Follow system theme by default and preserve manual choice
Status: completed
Scope: index.html and src/App.tsx
Acceptance criteria:
- New visits use the operating-system theme.
- System changes update the page while no manual override exists.
- An explicit manual choice survives reload and controls the boot skeleton.
Validation:
- python scripts/check-home-interactions.py in Chromium/WebKit light/dark
- Pre-React Chromium probe for four system/override combinations
- npm run build

### [x] Synchronize Hero contact navigation with the About highlight
Status: completed
Scope: src/App.tsx
Acceptance criteria:
- 联系我 navigates to #about, activates 关于, and aligns the lamp with the active link.
Validation:
- python scripts/check-home-interactions.py: target top 88px Chromium / 90px WebKit, lamp aligned, no page errors

### [x] Show seven application projects in the proof strip
Status: completed
Scope: src/App.tsx and public/data/home-summary.json
Acceptance criteria:
- Copy reads 当前作品集 / 07 / 个面向真实场景的应用项目.
- The displayed number corresponds to the seven rendered project cards.
Validation:
- python scripts/check-home-interactions.py: seven cards and requested copy in Chromium/WebKit

### [x] Prevent stale About data from unmounting the portfolio
Status: completed
Scope: commit a2bf461
Acceptance criteria:
- The previous mobile Safari/WeChat blank-screen path is resolved.
Validation:
- Local WebKit stale-data regression passed in the prior session; the user reports the production issue fixed on 2026-10-13.