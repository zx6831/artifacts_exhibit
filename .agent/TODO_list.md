# TODO List

## P2 — Later
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