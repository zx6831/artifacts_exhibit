# TODO List

## P0 — Blocking

None.

## P1 — Next

### [ ] Supply approved personal profile material only when ready
Status: deferred
Depends on: User-provided name, portrait (optional), education/experience wording, and final résumé file
Blocked by: Missing approved personal material
Scope: Homepage metadata, contact/identity areas, and any future résumé action
Acceptance criteria:
- Every identity statement and résumé link maps to supplied, current information.
- Do not reintroduce placeholder labels or a mock résumé download.
Validation:
- Browser review of desktop and 390px mobile layouts
- Verify the delivered résumé opens and matches the visible identity copy

## P2 — Later

### [ ] Perform a cold-cache throttled release check of font-gated loading
Status: ready
Depends on: A browser session with cache disabled and network throttling controls
Blocked by: None
Scope: index.html, src/App.tsx, src/index.css
Acceptance criteria:
- Boot and resource skeletons remain visible until final fonts or a stable fallback are ready.
- No blank first viewport, late font reflow, or replayed scroll entrance occurs.
Validation:
- DevTools Slow 3G + Disable cache reload on homepage and ?project=pharmagent

### [ ] Decide whether to adopt a deeper Liquid Glass press/release treatment
Status: deferred
Depends on: User preference for a more expressive interaction style
Blocked by: No implementation blocker
Scope: src/index.css, possibly components/ui/liquid-glass-button.tsx
Acceptance criteria:
- Any added press/release treatment preserves contrast, keyboard feedback, dark mode, touch behavior, and reduced motion.
Validation:
- npm run build
- Browser pointer/keyboard checks

### [ ] Resolve or rebaseline Fubao younger_plans Golden mismatch
Status: ready
Depends on: Decision whether the current Flutter/Skia render is an intended baseline change
Blocked by: None
Scope: Private Fubao Flutter visual tests and baseline image
Acceptance criteria:
- Determine whether the 0.17% / 574-pixel mismatch is environmental or a regression.
- Fix or deliberately rebaseline it; flutter test then has no failure.
Validation:
- flutter test from the Fubao app

## Completed

### [x] Implement awards, capability map, and seven tailored case studies
Status: completed
Depends on: docs/plans/2026-10-12-portfolio-design.md
Blocked by: None
Scope: src/App.tsx, new story components, src/index.css, public/data/home-skills.json
Acceptance criteria:
- Awards prioritize the actual result with balanced two-zone layouts.
- Four capabilities expose concrete methods, outputs, and valid case links.
- Seven detail pages have distinct task-based body structures and specific headings.
- Audited facts, privacy boundaries, responsive layouts, dark mode, and reduced motion remain valid.
Validation:
- npm run build
- git diff --check
- Browser at 1440px, 768px, 390px; seven routes, links, images, themes, reduced motion.
Validation results (2026-10-12): production build, JSON/link/figure integrity, seven routes at three widths, themes, keyboard, and reduced motion passed. No commit made.

### [x] Complete a visual, responsive, copy, and deep-link audit of the portfolio homepage
Status: completed
Scope: src/App.tsx, src/index.css, public/data/home-about.json, home-awards.json, home-skills.json, home-work.json
Acceptance criteria:
- Preserve the existing evidence-led glass/aurora design language while addressing actual visual and content defects.
- Remove visible identity/resume placeholders without inventing personal facts.
- Make mobile navigation readable over long-form cards, preserve responsive behavior, and restore direct section anchors.
Validation:
- npm run build — passed on 2026-10-12 (1,587 modules transformed).
- git diff --check — passed before state updates.
- Browser QA passed at desktop, tablet, and mobile; light/dark, reduced motion, all seven detail routes, and mobile /#about were checked.
