# Current State
Last updated: 2026-10-13
Current branch: main (HEAD a2bf461, aligned with origin/main before this session's edits)
Current phase: System-theme, hero navigation, and portfolio-count changes validated locally; not yet published

## Current Objective
Make the default website theme follow the visitor's operating system, keep the About navigation highlight in sync with the Hero contact button, and show seven application projects in the proof strip.

## Completed
- The deployed portfolio presents 王泽贤's seven projects, skills, five honours, biography, résumé, favicon, social image, and route-aware metadata.
- The user reports that the prior iPhone Safari/WeChat blank-screen issue is fixed; commit a2bf461 contains the stale-JSON repair.
- Locally, a new theme preference defaults to the system appearance, reacts to system changes, and preserves an explicit manual choice. The head script, boot skeleton, browser theme color, and React UI use the same effective theme.
- Locally, Hero section links use the same navigation path as the floating navigation, so the About highlight and lamp follow the contact action.
- Locally, the proof strip reads the project count from the actual project list (with the seven-route registry as its loading fallback). Its copy now reads 当前作品集 / 07 / 个面向真实场景的应用项目, and the summary URL is versioned to bypass old cached copy.

## In Progress
- The current changes are uncommitted and have not been published to https://206831.xyz/.

## Architecture and Key Decisions
- src/App.tsx owns theme state, section navigation, JSON resource loading, and rendering.
- index.html applies the effective theme before React so the first skeleton paint matches the eventual page.
- Explicit theme choices use localStorage key theme-preference-v2; the old theme key is ignored so previous automatic dark writes do not prevent the new system default.
- public/data/home-summary.json owns proof-strip wording; the displayed number is derived from the project list.

## Validation Status
- npm run build passed on 2026-10-13: TypeScript and Vite completed, 1,588 modules transformed.
- python scripts/check-home-interactions.py passed in Chromium and WebKit, each with light and dark system themes: seven project cards, #about highlighted with lamp aligned, About target at 88px or 90px, and no page errors.
- The same browser regression confirmed that an explicit manual light choice persists across reload and overrides a dark system setting.
- A pre-React Chromium probe passed for system light, system dark, manual light over dark, and manual dark over light: the boot skeleton and meta theme-color matched the effective theme.
- git diff --check passed after the state-file updates; Git printed line-ending notices only.

## Known Problems
- The new changes have not been checked on a physical iPhone or published.
- Several private/team projects still lack public screenshots, demos, measured outcomes, or individually attributed module records.

## Blockers
- Publishing the changes requires a commit and push to main, which triggers GitHub Pages.

## Important Files
- src/App.tsx — theme preference, Hero/floating navigation, dynamic project count.
- index.html — pre-React theme setup and boot-skeleton colors.
- public/data/home-summary.json — updated proof-strip wording.
- scripts/check-home-interactions.py — Chromium/WebKit interaction regression.
- .github/workflows/deploy-pages.yml — production release path.