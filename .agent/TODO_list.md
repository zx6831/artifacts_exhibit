# TODO List

## P0 — Blocking
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
