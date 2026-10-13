# TODO List

## P0 — Blocking

None.

## P1 — Next

None for the requested redesign.

## P2 — Later

### [ ] Add stronger public artefacts and measured outcomes
Status: deferred
Depends on: Approved screenshots, demos, videos, reports, or measured product/model results
Blocked by: Detailed public artefacts are not available for several private/team projects
Scope: Project cards and detail evidence galleries
Acceptance criteria:
- Each project has one useful public artefact or an explicit publication boundary.
- Outcome claims distinguish tests/build status from product or model effectiveness.
- Team achievements and individual ownership remain separately attributed.
Validation:
- Open every linked artefact
- Audit claims against supplied sources
- Review at desktop and 390×844

### [ ] Perform a cold-cache throttled release check
Status: ready
Depends on: Browser cache disable and network throttling controls
Blocked by: None
Scope: `index.html`, `src/App.tsx`, `src/index.css`
Acceptance criteria:
- Homepage and a project detail retain a visible, stable skeleton until final fonts or fallback fonts are ready.
- No blank first viewport, late font reflow, or replayed entrance animation occurs.
Validation:
- DevTools Slow 3G + Disable cache reload on `/` and `/?project=pharmagent`

### [ ] Verify Safari and iOS WebKit behavior
Status: ready
Depends on: Safari/iOS test environment
Blocked by: Not available in the current Windows session
Scope: Floating navigation, backdrop filters, hash landing, PDF link, and View Transition fallback
Acceptance criteria:
- Core content, navigation, theme switch, project routes, and résumé remain usable.
- Unsupported visual effects degrade without hiding content or controls.
Validation:
- Current Safari desktop
- Current iOS Safari at a narrow viewport

### [ ] Resolve or rebaseline Fubao younger_plans Golden mismatch
Status: ready
Depends on: Decision whether the current Flutter/Skia render is intended
Blocked by: None
Scope: Private Fubao Flutter visual test and baseline image
Acceptance criteria:
- Determine whether the prior 0.17% / 574-pixel mismatch is environmental or a regression.
- Fix or deliberately rebaseline it; Flutter tests then have no failure.
Validation:
- `flutter test` from the Fubao app

## Completed

### [x] Unify the structure of all five honour cards
Status: completed
Acceptance criteria:
- Every desktop/tablet card uses the same result, competition title, related-work, and source regions.
- Independent awards occupy the same related-work slot as linked awards.
- Mobile cards stack consistently without horizontal overflow.
Validation:
- Chromium at 1440×900, 768×1024, and 390×844; all desktop/tablet cards measured 254px high
- `npm run build` passed on 2026-10-13
- `git diff --check` passed on 2026-10-13

### [x] Add verified identity, biography, research interests, skills, and résumé
Status: completed
Acceptance criteria:
- Hero and About identify 王泽贤, education, target area, contact path, and supplied technical background.
- Public résumé link opens a current one-page PDF.
Validation:
- Desktop/mobile Chromium review
- `GET /wang-zexian-resume.pdf` → HTTP 200, `application/pdf`, 182,709 bytes
- Rendered PDF visual inspection passed

### [x] Surface role, status, evidence, and stack on all seven project cards
Status: completed
Acceptance criteria:
- Every card distinguishes personal ownership, participation, implementation focus, or project scope.
- Team achievements are not presented as sole-author results.
Validation:
- Source audit against `docs` and repository facts
- Desktop/mobile project-list review

### [x] Put representative work before honours
Status: completed
Acceptance criteria:
- Main CTA reaches projects before the full honour ledger.
- Existing hashes and project transitions remain usable.
Validation:
- Desktop 1440×900 and mobile 390×844 browser review

### [x] Add favicon, social card, Chinese SEO metadata, and route-aware project metadata
Status: completed
Acceptance criteria:
- Homepage has canonical, OG/Twitter, author, favicon, and Person JSON-LD fields.
- Project routes update title, description, OG/Twitter fields, and canonical URL.
Validation:
- Runtime head inspection on homepage and PharmAgent detail

### [x] Stabilize cold and in-page section navigation after async expansion
Status: completed
Acceptance criteria:
- Fresh and immediate-click `/#about` land below the floating navigation after all resources settle.
- No horizontal overflow is introduced.
Validation:
- Fresh 390×844 `/#about`: target top 87.7px
- Immediate About nav click at 390×844: target top 87.7px
- `npm run build`

### [x] Remove deployable mock résumé assets
Status: completed
Acceptance criteria:
- `public/resume-mock.html` and `public/resume-mock.pdf` are absent.
- The UI links only to the final résumé.
Validation:
- `git status --short`
- Browser PDF request check

### [x] Review the portfolio's structure, content completeness, and responsive presentation
Status: completed
Validation:
- Chromium desktop and 390×844 review on 2026-10-13
- `npm run build`

### [x] Unify project-origin transitions and remove the transition-only halo
Status: completed
Validation:
- Commit `0264661`
- Prior Chromium desktop/mobile origin and pseudo-style probes passed
