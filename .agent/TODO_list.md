# TODO List

## P0 — Blocking
### [x] Verify the startup blank-state hotfix in a local browser
Status: completed
Depends on: Local Vite preview
Blocked by: None
Scope: `src/index.css`
Acceptance criteria:
- With `font-loading` and `app-ready` both present, `#root` remains visually available so the boot skeleton and application cannot be hidden simultaneously.
- A cold/open load of `http://127.0.0.1:5176/` and `?project=pharmagent` shows visible content without console errors.
Validation:
- Local agent-browser — passed: forced `font-loading app-ready` retained a visible root with 1,183 characters; fresh homepage and PharmAgent detail loads showed visible content and no browser errors.
- `npm run build` — passed (`tsc --noEmit && vite build`, 1,587 modules transformed).
- `git diff --check` — passed after the state-record update (only existing LF→CRLF working-tree warnings were emitted).

### [x] Synchronize homepage portfolio count and scope copy
Status: completed
Depends on: Current visible project list
Blocked by: None
Scope: `public/data/home-summary.json`
Acceptance criteria:
- The proof strip count matches the six visible project cards.
- Its text does not incorrectly classify every portfolio project as an LLM application.
Validation:
- `npm run build` and `git diff --check` — passed; summary JSON stores `06` and the revised cross-domain wording.

### [x] Tailor every project-detail page to its project domain
Status: completed
Depends on: Audited project scope and existing detail-route contract
Blocked by: None
Scope: `src/App.tsx`, `src/index.css`
Acceptance criteria:
- Each of the six routes has a distinct, content-grounded hero artefact rather than the former shared icon panel.
- Existing evidence, private-repository, outbound-link, theme, responsive, and `/#work` return constraints remain intact.
- The design remains legible in the dark and light themes.
Validation:
- `npm run build` and `git diff --check` — passed.
- Agent-browser — one matching signature found on all six routes; return link verified; representative dark-theme and light-theme screenshots reviewed.

### [x] Fix stale project-card data, detail mismatch, and return target
Status: completed
Depends on: Reproducible local browser check
Blocked by: None
Scope: `src/App.tsx`
Acceptance criteria:
- Homepage revalidates the project JSON instead of relying on an indefinitely cached initial response.
- An obsolete or unknown project ID does not render another project's detail page.
- Every project detail-page return link reaches `/#work`.
Validation:
- Fresh-browser check: 6 homepage cards, matching titles on all 6 routes, `/#work` after back navigation, and the obsolete `dingjia` ID renders the explicit missing-project page.

### [x] Replace unverified project claims with repository-backed portfolio content
Status: completed
Depends on: Completed audit of public/private repositories and the supplied ScholarWeaver repository
Blocked by: None
Scope: `public/data/home-work.json`, `src/App.tsx`, `src/index.css`, and the four `.agent/` status files
Acceptance criteria:
- Homepage Projects module contains only entries whose content and attribution are supported by the audited repositories.
- The existing homepage Projects layout, card styling, interactions, and all non-Projects homepage content remain unchanged.
- Each homepage entry resolves to a working detail route with repository-backed implementation evidence; private project pages must not show a GitHub link.
- Detail copy does not claim unverified metrics, deployments, results, or personal contributions.
Validation:
- `npm run build`
- `git diff --check`
- Browser checks against `/?project=scholarweaver` and `/?project=fubao` — passed.

## P1 — Next
### [x] Tighten the project-detail first-viewport vertical rhythm
Status: completed
Depends on: Existing route-specific navigation hiding and shared `Shell`
Blocked by: None
Scope: `src/App.tsx`, `src/index.css`
Acceptance criteria:
- The route shell no longer keeps the homepage navigation allowance after the detail navigation is omitted.
- The return row and Hero move upward through normal padding/margin rules, with no transform or negative-margin offset.
- Hero content, card dimensions, right-side visualization, responsive safety, and normal downstream spacing remain unchanged.
Validation:
- Local agent-browser screenshots and geometry probes — passed at 1440×900, 768×1024, and 390×844: Hero top moved from 182px/182px/164px to 119px; no horizontal overflow and clear theme-control spacing remained.
- `npm run build` — passed (`tsc --noEmit && vite build`, 1,587 modules transformed).

### [x] Add a shared-element transition from Projects cards to detail mastheads
Status: completed
Depends on: Existing in-document `?project=` route rendering and native View Transition support
Blocked by: None
Scope: `src/App.tsx`, `src/index.css`
Acceptance criteria:
- Clicking a Projects card in a supporting browser morphs that card into the matching detail masthead rather than performing a disconnected page swap.
- The route background and card container use a coordinated scale curve, then all temporary transition state is removed.
- Reduced-motion and unsupported-browser paths retain normal anchor navigation.
Validation:
- `npm run build` — passed (`tsc --noEmit && vite build`, 1,587 modules transformed).
- `git diff --check` — passed.
- Local agent-browser probe — passed: at 80ms after PharmAgent activation, the detail masthead exposed `viewTransitionName: project-card`; root old/new durations were 0.68s/0.72s, card-group duration was 0.72s; at 1s temporary classes and names were cleared.

### [x] Implement reviewed document-evidence modules on project detail pages
Status: completed
Depends on: User approval of the 2026-10-12 design direction
Blocked by: None
Scope: `src/App.tsx`, `src/index.css`, and the user-authorized original figures in `public/project-evidence/`
Acceptance criteria:
- PharmAgent receives a compact target-to-delivery evidence trace, not an unqualified performance chart. — completed
- ScholarWeaver receives a simplified parse/term/RAG/translate workflow plus one clearly labelled web-native output-structure illustration. — completed
- Each of PharmAgent, ScholarWeaver, and Fubao includes two user-authorized original figures with accessible captions, full-resolution links, lazy loading, responsive stacking, and a retained explanatory evidence chain. — completed
- Fubao retains its dual-role scenario strip and redrawn trust/data boundary alongside the original business-loop and system-context figures. — completed
- Existing claim, attribution, private-repository, accessibility, reduced-motion, dark-theme, and responsive constraints remain true. — completed
Validation:
- `npm run build` — passed (`tsc --noEmit && vite build`, 1,587 modules transformed).
- `git diff --check` — passed.
- Local browser review — passed for PharmAgent and ScholarWeaver desktop galleries, plus Fubao at 390px in dark and light themes; all six links render and browser errors were empty.

### [x] Re-audit public repositories across all visible remote branches
Status: completed
Depends on: Public repository access
Blocked by: None
Scope: Every public `zx6831` repository considered for portfolio inclusion, including `sso-platform/master`
Acceptance criteria:
- Enumerate every visible remote branch rather than inspecting only each repository's default branch. — completed for all six public repositories.
- Record source-bearing non-default branches and revise any incomplete exclusion conclusion. — completed: SSO and Eliminate were added; Dingjia remains a ScholarWeaver component; sqldemo remains excluded as a learning example.
- Decide with evidence whether an additional project belongs on the homepage. — completed: added SSO, Eliminate, V2T, and PharmAgent; private/local cases expose no source link.
Validation:
- `git ls-remote --heads https://github.com/zx6831/<repository>.git` for each audited repository
- Inspect each unique branch head's tree and relevant documentation.

## P2 — Later
### [ ] Verify the font-gated no-swap text-loading implementation for release
Status: in_progress
Depends on: Existing Google Fonts import, boot skeleton, and resource skeleton boundaries
Blocked by: Final `npm run build` and `git diff --check` could not be rerun after the last scroll-timer cleanup because the local command sandbox is locked.
Scope: `index.html`, `src/App.tsx`, `src/index.css`
Acceptance criteria:
- No real application text is visible while the required webfont faces are still loading; the existing page/resource skeletons remain visible instead.
- Font-ready content first appears using its final stack, weight, and layout. Delayed resource content remains skeleton-only until its text-specific font request settles.
- A font timeout or failure exits the skeleton, locks a stable system fallback, and prevents late webfont replacement.
- Scroll-triggered items enter only once after their real content becomes font-ready; later resource/font state changes do not replay or leave their entrance classes behind.
Validation:
- Local browser checks passed for final-font ready, webfont-blocked timeout fallback, direct project-route boot skeleton, and one-time work/skills scroll entrance.
- `npm run build` passed before the final timer-cleanup edit (`tsc --noEmit && vite build`, 1,587 modules transformed).
- Final `npm run build` and `git diff --check` remain required once the command sandbox is available.

### [ ] Decide whether to adopt a deeper press and release-spring treatment for Liquid Glass buttons
Status: ready
Depends on: User approval of a more expressive interaction style
Blocked by: None
Scope: `src/index.css` and, if a release-only state is needed, `components/ui/liquid-glass-button.tsx`
Acceptance criteria:
- Press state uses the approved compression value and a visibly deeper inset/less prominent outer shadow without reducing text contrast.
- Release has only the approved, short overshoot; hover entry does not accidentally receive the same bounce.
- Touch, keyboard activation, dark theme, responsive layouts, and `prefers-reduced-motion` preserve usable, non-distracting feedback.
Validation:
- `npm run build`
- `git diff --check`
- Browser pointer and keyboard checks in light/dark and reduced-motion modes

### [ ] Resolve or rebaseline Fubao `younger_plans` Golden mismatch
Status: ready
Depends on: Decision whether the current Flutter/Skia rendering is an expected baseline change
Blocked by: None
Scope: Private `FubaoApp/apps/fubao_app/test/visual/page_golden_test.dart` and `goldens/younger_plans.png`
Acceptance criteria:
- Determine whether the 0.17% / 574-pixel mismatch is environmental or a UI regression.
- Fix the regression or review and regenerate the baseline.
- `flutter test` completes with no failures in a documented environment.
Validation:
- `flutter test` from `apps/fubao_app`

### [ ] Optional manual visual review of shimmer intensity
Status: ready
Depends on: A normal Chrome DevTools session with visual access
Blocked by: No implementation blocker; the current computer screenshot viewer is unavailable because of a sandbox lock.
Scope: Homepage and project-detail URLs at `http://127.0.0.1:5173/`
Acceptance criteria:
- Under DevTools Slow 3G + Disable cache + hard reload, homepage and detail placeholder bars visibly receive separate local light sweeps rather than one screen-wide sweep.
- Project detail shows its return/Hero/grid/evidence placeholder structure rather than the homepage Hero skeleton.
- Resource completion still crossfades in place, without a second slide or lingering shimmer.
Validation:
- Chrome DevTools → Network: Slow 3G + Disable cache + hard reload; visually inspect light and dark themes.

## Completed
### [x] Apply staggered direct scroll entrance to homepage child items
Status: completed
Depends on: Existing one-time `IntersectionObserver` reveal hook
Blocked by: None
Scope: `src/App.tsx`, `src/index.css`
Acceptance criteria:
- Homepage proof, project, skill, and about children enter in sequence after their section reaches the viewport.
- Each item travels left-to-right and stops directly at its final position without overshoot.
- Reduced-motion users receive the content without entrance animation.
Validation:
- `npm run build` — passed.
- Local automated-browser sample — passed: the project items expose `scroll-reveal-right`; 90ms delays are present and the first item never exceeded its final position (maximum sampled `translateX(-0.0839553px)`).

### [x] Publish loading and detail-route implementation
Status: completed
Depends on: Verified implementation changes
Scope: Staged homepage/detail source, JSON resources, and state files
Acceptance criteria:
- Commit only the requested implementation and state files.
- Preserve the six pre-existing deleted files outside the commit.
- Push the resulting commit to `origin/main`.
Validation:
- `git push origin main` — pushed `27c8978` successfully.

### [x] Remove project-detail top navigation and add a route-specific boot skeleton
Status: completed
Depends on: Existing project-detail route and HTML boot skeleton
Scope: `src/App.tsx`, `index.html`
Acceptance criteria:
- No top navigation bar renders at `?project=<id>` after React mount.
- Theme toggle remains available.
- A direct slow-load project URL shows only the detail-specific return/Hero/grid/evidence skeleton before React mounts.
- Existing homepage boot skeleton remains unchanged on the homepage route.
Validation:
- `npm run build` — passed.
- CDP Slow 3G-equivalent test — passed at 3s/6s for detail boot skeleton.
- Browser post-load test — navigation count 0; detail Hero/grid/theme toggle present.

### [x] Replace container-wide skeleton shimmer with per-element local shimmer
Status: completed
Depends on: Existing boot and resource skeletons
Scope: `index.html`, `src/index.css`
Validation:
- `npm run build` — passed.
- CDP and browser computed-style checks — passed.
