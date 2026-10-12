# Session Handoff
Created: 2026-10-12
Branch: main
Working tree: Dirty. Existing uncommitted tailored detail-page work, homepage scroll-motion refinement, corrected homepage summary, shared transition, and layout refinement remain. This session adds six user-authorized document-original figures in `public/project-evidence/`, their galleries in the three document-grounded detail modules, and the state-record updates. Six root-file deletions and the untracked `docs/` directory pre-date this task and were not changed.

## Session Goal
Implement and verify no-swap text loading: hide real text behind existing skeletons until final fonts are ready, with a timeout that locks a stable fallback.

Complete the approved original-figure evidence galleries and correct the project-detail first-viewport vertical rhythm without changing the Hero's internal design.

## Work Completed
- Added initial `font-loading` document state in `index.html`; the React root is invisible behind the existing boot skeleton until the font gate resolves.
- Added global and per-resource font gates in `src/App.tsx`. They request the declared Manrope, Noto Sans SC, IBM Plex Mono, and Cormorant Garamond weights, retry during Vite's delayed `@import` registration, and use a 4.5-second ceiling.
- Added global/resource-scoped system fallback tokens in `src/index.css`, so a late remote font cannot replace text already revealed after a timeout.
- Updated scroll reveal to wait for font readiness, mark first completion, and let its short cleanup finish across later resource-state updates. Browser checks confirmed completed work cards did not replay after skills loaded.
- Browser checks passed for normal final-font loading, blocked-font skeleton-only startup then stable fallback, and direct project-route skeleton selection.

- Copied six user-authorized original images into `public/project-evidence/`: two each for PharmAgent, ScholarWeaver, and Fubao.
- Added shared `SourceFigureGallery` rendering in `src/App.tsx`: descriptive alt text, captioned figure purpose, native lazy loading, and a new-tab full-resolution link for each image.
- Expanded PharmAgent with its system architecture and FastGPT orchestration canvas; ScholarWeaver with document parsing pipeline and double-pane workbench; Fubao with Family business loop and security-zone system-context diagram.
- Added `src/index.css` gallery styling: the explanatory text and original figures form a desktop two-column pair, mobile uses a vertical stack, hover/focus states expose the original-image action, and reduced motion disables the figure zoom transition.
- Verified the new areas in the local browser: PharmAgent and ScholarWeaver desktop galleries, plus Fubao at 390px in both dark and light themes. Browser error output was empty.
- Updated `current_state.md`, `TODO_list.md`, and `lessons.md` to replace the old “no document image published” decision with the user's explicit authorization and verified implementation.
- Located the layout gap: detail routes hid navigation but retained the homepage `.candidate-shell` top padding (`112px` desktop/tablet; `94px` at 520px), while `.back-link` also added a `16px` top margin.
- Added `candidate-shell--detail` when `Shell` omits navigation, set its normal `padding-top` to `64px`, and scoped the return link's top margin to `0`. The modifier is repeated in the later 520px query so the mobile homepage rule cannot override it.
- Left `CaseMasthead`, its title, supporting copy, tags, signature visual, card dimensions, and later sections unchanged; no transform or negative margin is used.
- Browser geometry and screenshot review at 1440×900, 768×1024, and 390×844 moved the Hero start from 182px/182px/164px to 119px with no horizontal overflow.
- Reproduced a separate startup blank state on port 5176: `#root` and Hero existed but were hidden, with zero visible page text. An isolated browser class probe confirmed that the `font-loading app-ready` combination hides both root and boot skeleton; making only the root visible restores page text.
- Applied the narrow source fix in `src/index.css`: `html.font-loading #root` no longer sets `visibility:hidden`. Final post-edit browser verification passed: the forced double-class state retains a visible root, and fresh homepage/detail loads show visible content without browser errors.

## Current Stopping Point
Font-gated loading, original-figure galleries, the first-viewport layout adjustment, and the startup blank-state hotfix are locally verified. The user has requested publication to `main`; run the final diff check, stage the deliberate source/assets/state paths, commit, and push.

## Uncommitted Changes
- Font-loading session files: `index.html`, `src/App.tsx`, `src/index.css`, and all four `.agent/` records. Preserve the pre-existing unrelated changes/deletions listed below.

- Modified: `.agent/TODO_list.md`, `.agent/current_state.md`, `.agent/handoff.md`, `.agent/lessons.md`, `public/data/home-summary.json`, `src/App.tsx`, `src/index.css`.
- Added: `public/project-evidence/pharmagent-system-architecture.png`, `public/project-evidence/pharmagent-fastgpt-workflow.png`, `public/project-evidence/scholarweaver-processing-pipeline.png`, `public/project-evidence/scholarweaver-translation-workbench.png`, `public/project-evidence/fubao-family-loop.png`, `public/project-evidence/fubao-system-context.png`.
- Deleted before this task and untouched: `2842293fa2bb01d8eec6e1c9026d2402.png`, `chrome-check-process-no-panel.png`, `chrome-check-studio-light.png`, `chrome-check-studio-no-panel.png`, `chrome-check-work-no-panel.png`, `v2tproject.md`.
- Untracked and untouched: `docs/`.

## Validation Results
- Font gates: normal path reached `fontState: ready` with all requested remote families loaded; blocked-font path kept root text at `visibility:hidden` behind the boot skeleton, then reached stable `fontState: fallback` after timeout with Arial/Georgia local stacks.
- Scroll: work cards completed once with zero remaining active entrance classes after skills loaded; skills cleanup completed after the timer fix.
- Final `npm run build` — passed: `tsc --noEmit && vite build`; 1,587 modules transformed.
- Final `git diff --check` — passed after the state-record update (only existing LF→CRLF working-tree warnings were emitted).
- Local agent-browser review — passed: PharmAgent and ScholarWeaver show their two original figures and full-resolution links at desktop; Fubao at 390px stacks its gallery vertically with no visible overflow in dark and light themes. Browser errors were empty.
- Detail-layout agent-browser review — passed: at 1440×900, 768×1024, and 390×844, the theme control ended at 60px/56px/52px, the return link began at 65px, Hero height remained 506px/442px/689px, and no horizontal overflow occurred.
- Startup blank-state hotfix — passed: forcing `font-loading app-ready` retained `#root` visibility with 1,183 visible characters; fresh homepage and PharmAgent detail loads had visible roots, and the detail masthead remained at 119px. Browser errors were empty.

## Failing Tests or Known Errors
- The unrelated Fubao Flutter suite still has the recorded `younger_plans` Golden mismatch: 0.17% / 574 pixels after 86 tests. It was not run or changed by this website task.
- The existing uncommitted source/state work and root-file deletions require explicit review before any commit.

## Recommended Next Steps
1. Run `git diff --check` after updating this record, then stage only the deliberately approved paths and commit/push to `main`.
2. If publication is requested, inspect `git diff` and stage only the deliberate source/assets/state files; preserve the six unrelated deletions and `docs/` unless the user directs otherwise.
3. If new document media is added, use `SourceFigureGallery` and give it a concrete purpose/caption rather than creating a separate visual treatment.
4. Preserve the breakpoint-local `.candidate-shell--detail` rule if the homepage shell spacing changes; otherwise the later 520px homepage rule will reintroduce the excess mobile whitespace.

## Important Decisions
- The Google Fonts source and visual typography remain unchanged. The implementation changes only visibility timing: final fonts first, skeleton while pending, and a session-stable local fallback on failure.

- The user explicitly authorized use of original figures; the public asset selection remains intentionally narrow at two figures per case rather than importing each document's full media collection.
- The gallery follows the evidence chain, not the Hero, so original detail deepens the case study without displacing the page thesis.
- Original architecture and screenshot material documents system structure or interface shape only. It must not be used to claim performance, clinical validity, or individual authorship beyond the existing bounded copy.
- Detail spacing is route-aware structural layout: a shell modifier replaces the hidden-navigation allowance with normal padding and a scoped margin adjustment. It must not be replaced with whole-page transforms or negative margins.
- The font-loading rule must not use `visibility:hidden` on `#root`; it creates a blank viewport when the boot skeleton is concurrently dismissed.

## Risks and Open Questions
- The 4.5-second timeout is a deliberate UX compromise and needs a cold-cache/throttled visual check once the sandbox is available. The direct-route blocked-font session likely reused shared font cache, so it confirmed detail skeleton selection but not a separate direct-route fallback.

- Six original PNGs add roughly 6.5 MB of source imagery. `loading="lazy"` postpones their network fetch until the gallery approaches the viewport; convert/compress only if field performance later warrants it.
- The six pre-existing deleted files have no known owner or requested disposition and must remain untouched.
- A future increase to the fixed top-control height should revisit the 64px detail-shell spacing.

## Start Here
```powershell
git status --short
git diff --check
npm run build
```
