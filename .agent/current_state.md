# Current State
Last updated: 2026-10-12
Current branch: main (matches origin/main; HEAD 74b5424)
Current phase: Three-area design implementation and local QA complete; changes uncommitted

## Current Objective
Make award outcomes prominent, connect capabilities to evidence, and distinguish all seven case-study bodies by their actual engineering tasks.

## Completed
- Existing React/Vite portfolio has seven evidence-bounded case studies, JSON-backed homepage sections, source-figure galleries, route-specific loading, shared transitions, and light/dark themes.
- Awards now use two zones: a large result with level/edition, and competition/project/source information. The five original award records remain unchanged; 本科生组 is a qualifier rather than oversized prize text.
- Capabilities now expose four delivery stages, concrete methods, output labels, tools, and eight valid case links in a responsive two-column map.
- Case bodies now explain research provenance, discovery tasks, CAS trust topology, V2T jobs/recovery, three-state person decisions, translation contribution boundaries, and family responsibilities through dedicated layouts.
- Removed repeated generic detail headings and three-card implementation grids; preserved original figures, private/public resource boundaries, and audited facts.
- Historical source-project tests are labelled as earlier engineering verification. New capability JSON uses no-cache revalidation to prevent a stale-schema runtime crash.
- Design plan and execution results saved in docs/plans/2026-10-12-portfolio-design.md.

## In Progress
- No implementation remains for the requested three areas. Source, content, plan, and state records are uncommitted.

## Architecture and Key Decisions
- src/case-stories.tsx owns task-specific case explanations and implementation ledgers. App.tsx retains routing, shared mastheads, facts, evidence galleries, limitations, resources, and font/resource gates.
- Existing aurora/glass visual language and font families remain. Award result text carries the strongest emphasis; diagrams explain actual roles and tasks rather than pretend to show runtime output.
- Skills data uses no-cache, matching the schema-sensitive work/awards data; initialCache is included in the loader callback dependencies.
- No invented awards, proficiency percentages, model results, profile claims, or individual ownership of collaborative work.

## Validation Status
- npm run build — passed on 2026-10-12: tsc --noEmit and Vite production build; 1,588 modules transformed.
- git diff --check — passed before final state updates; only LF→CRLF warnings.
- Python integrity check — all public/data JSON parsed; four capabilities/eight case IDs, five awards/project references, six original figure files, and removal of the three generic detail headings passed.
- agent-browser — all seven detail routes at 1440×1000 light, 768×1024 dark, and 390×844 dark displayed expected titles and no horizontal overflow; homepage awards/skills checked across those widths and both themes.
- Browser images — all six original figures decoded with nonzero dimensions.
- Keyboard — capability link focused visibly with a solid outline; Tab/Enter opened CAS SSO; back link returned to #work with seven real project cards.
- Reduced motion — matchMedia true; capability entrance animation none; no horizontal overflow.
- Fresh browser session — no runtime errors reported after the cache correction; mobile #awards settled at top 90.15625px below fixed controls.

## Known Problems
- No outstanding issue found in the requested website changes.
- Prior Fubao Flutter review recorded one younger_plans Golden mismatch (0.17% / 574 pixels); not re-run or changed in this website task.
- Approved personal name, portrait, and final résumé remain unavailable and omitted.

## Blockers
- None.

## Important Files
- docs/plans/2026-10-12-portfolio-design.md — design rationale, scope, acceptance, actual results.
- src/App.tsx — homepage cards, routing, shared facts/evidence and resource loading.
- src/case-stories.tsx — task-specific case-study bodies.
- src/index.css — responsive cards, diagrams, and dark-theme contrast.
- public/data/home-skills.json — methods, outputs, tools, and related cases.
- qa-screenshots/after-*.png — ignored local visual-QA captures.