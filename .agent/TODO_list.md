# TODO List

## P1 — Next

### [ ] Publish the circular theme reveal
Status: ready
Depends on: Review and release of the local patch
Blocked by: No technical blocker; push to main triggers the public GitHub Pages workflow
Scope: src/App.tsx, src/index.css, scripts/check-theme-reveal.py, .agent state files
Acceptance criteria:
- Commit and push the verified patch to main.
- GitHub Pages workflow builds and deploys that commit.
- The live theme button reveals the new colors outward from its center and retains the saved choice after reload.
Validation:
- npm run build
- python scripts/check-theme-reveal.py
- Inspect GitHub Pages workflow and live site

### [ ] Confirm theme and navigation on the user's iPhone 16 Pro
Status: blocked
Depends on: Published theme reveal
Blocked by: The animation is not live and the physical iPhone is unavailable in this Windows session
Scope: iOS Safari and iOS WeChat at https://206831.xyz/
Acceptance criteria:
- First load follows the system appearance with no mismatched skeleton flash.
- A manual theme click reveals the new theme without a blank screen; the button choice persists after reload.
- Homepage section navigation and scroll to 荣誉/关于 leave the page visible.
Validation:
- Physical iPhone Safari/WeChat check after deployment

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
- Audit claims against supplied sources and review desktop/mobile rendering

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

### [x] Implement the button-centered circular theme reveal locally
Status: completed
Scope: src/App.tsx, src/index.css, scripts/check-theme-reveal.py
Acceptance criteria:
- Reveal radius reaches the farthest viewport corner from the button center.
- Both theme directions finish cleanly; reduced motion and unsupported browsers switch directly.
Validation:
- python scripts/check-theme-reveal.py — Chromium/WebKit at 390×844 and 1440×900, both directions and fallbacks passed
- npm run build — passed

### [x] Follow system theme by default, synchronize Hero navigation, and show seven projects
Status: completed
Scope: commit cdc75b0
Acceptance criteria:
- System theme is the default; 联系我 selects 关于; proof strip displays 07.
Validation:
- python scripts/check-home-interactions.py — Chromium/WebKit light/dark passed on 2026-10-13

### [x] Prevent stale About data from unmounting the portfolio
Status: completed
Scope: commit a2bf461
Acceptance criteria:
- Previous Safari/WeChat blank-screen path is resolved.
Validation:
- Local WebKit stale-data regression in prior session; user reported production issue fixed on 2026-10-13