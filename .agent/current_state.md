# Current State
Last updated: 2026-10-12
Current branch: main (matches origin/main)
Current phase: Local visual/copy refinement complete and awaiting review or commit

## Current Objective
Maintain a truthful, evidence-led portfolio whose homepage and seven case studies remain visually coherent across desktop and mobile without exposing unfinished personal-profile placeholders.

## Completed
- The committed portfolio provides seven case studies, an evidence-led awards section, tailored detail mastheads, user-authorized source-figure galleries, route-aware boot skeletons, and shared-element card-to-detail transitions.
- The current local refinement replaces the homepage's name/avatar/biography placeholders with a fact-backed CASEBOOK / 2026 index showing the seven existing cases and their evidence scope.
- Removed user-facing links to the placeholder résumé and replaced them with the real contact path; the footer and About section now describe the site as a portfolio rather than an unfinished personal profile.
- Tightened homepage copy in the overview, awards, skills, project section, Fubao card, and contact section without adding unverifiable claims.
- On mobile, the floating Tubelight navigation and theme control now use an opaque-enough surface so scrolling text and controls do not visually overlap.
- Direct homepage anchors now preload the small local data resources and restore the requested section after data and text-font layout have settled. /#about lands on the mobile contact section rather than remaining at the top.

## In Progress
- No active implementation. The source, content, and state-record changes from this audit are uncommitted.

## Architecture and Key Decisions
- Homepage content remains JSON-backed in public/data; project facts stay bounded to audited source, test, and project material.
- The homepage's distinctive supporting object is a casebook index, not a fabricated personal profile. Actual name, avatar, and résumé remain intentionally absent until the user supplies approved material.
- The floating navigation remains the existing Tubelight interaction. Only its small-screen surface opacity changes; desktop glass behavior and information architecture are retained.
- For a first-load #section URL, Home preloads its local JSON, waits for resource/font readiness, then performs one non-animated scrollIntoView. Ordinary in-page navigation remains smooth and reduced-motion aware.

## Validation Status
- npm run build — passed on 2026-10-12 (tsc --noEmit && vite build; 1,587 modules transformed).
- JSON parsing — passed for home-about.json, home-awards.json, home-skills.json, and home-work.json.
- git diff --check — passed before this state-record update; only LF→CRLF warnings were emitted.
- Local browser review — passed at 1440×900 desktop light, 768×1024 tablet dark, and 390×844 mobile light/dark. The homepage has no horizontal overflow at the checked widths.
- Mobile visual checks — passed: rewritten Hero holds a stable two-line title; opaque navigation no longer mixes with award text; /#about lands with aboutTop: 90, is visible, and has no horizontal overflow.
- Reduced-motion check — passed at 390×844: prefers-reduced-motion was true, Awards opacity was 1, and the signal animation name was none.
- Detail-route regression — passed for PharmAgent, Xuanji, SSO, V2T, Eliminate, ScholarWeaver, and Fubao at 1440×900: expected h1, no top navigation, and no horizontal overflow.

## Known Problems
- A real name, portrait, and final résumé have not been supplied. The site no longer exposes the placeholder versions, but those assets must come from the user before being published.
- The unrelated Fubao Flutter visual suite still has the recorded younger_plans Golden mismatch (0.17% / 574 pixels); it was not changed or re-run in this website task.

## Blockers
- None for the implemented design/copy work.

## Important Files
- src/App.tsx — homepage structure, route handling, deep-link restoration, and visible actions.
- src/index.css — casebook card and mobile navigation surface treatment.
- public/data/home-about.json, home-awards.json, home-skills.json, home-work.json — reviewed homepage copy.
- qa-screenshots/design-audit-2026-10-12/ — local visual-QA captures, if retained by the workspace.
