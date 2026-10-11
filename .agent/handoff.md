# Session Handoff
Created: 2026-10-11 19:45 +08:00
Branch: main
Working tree: Modified; includes source/styles, initial HTML skeleton, JSON resources, and `.agent/` state files, plus pre-existing deleted image/markdown files.

## Session Goal
Remove top navigation from project details and make the startup skeleton match the detail layout.

## Work Completed
- Added `showNavigation` to `Shell`; `App` disables it only when a `project` query parameter is present. Theme control remains rendered.
- Added an inline `boot-detail-route` URL switch and detail boot skeleton with back row, Hero, goal/facts grid, and evidence placeholders.
- Corrected a discovered class-name collision: document route marker is `boot-detail-route`, while the layout container remains `boot-detail`.

## Current Stopping Point
Implementation and browser checks are complete. Optional visual tuning of shimmer remains available.

## Uncommitted Changes
- `index.html`
- `src/App.tsx`
- `src/index.css`
- `public/data/home-summary.json`
- `public/data/home-work.json`
- `public/data/home-skills.json`
- `public/data/home-about.json`
- `.agent/current_state.md`
- `.agent/lessons.md`
- `.agent/TODO_list.md`
- `.agent/handoff.md`
- Pre-existing deletions left untouched: `2842293fa2bb01d8eec6e1c9026d2402.png`, `chrome-check-process-no-panel.png`, `chrome-check-studio-light.png`, `chrome-check-studio-no-panel.png`, `chrome-check-work-no-panel.png`, `v2tproject.md`.

## Validation Results
- `npm run build` passed after final route/skeleton changes.
- CDP Slow 3G-equivalent (400ms latency, 6400 B/s down) test passed: at 3s the detail boot skeleton was displayed and homepage boot skeleton hidden before React; at 6s detail grid/facts/evidence placeholders were present.
- Post-load browser check passed: `navCount` 0, detail Hero/grid/theme control present, and boot skeleton hidden.
- `git diff --check` passed before this state-file update.

## Failing Tests or Known Errors
- No failing automated checks.
- Screenshot visual inspection is unavailable in the current environment because the viewer and Windows UI automation hit `helper_sandbox_lock_failed`.

## Recommended Next Steps
1. Optionally hard-reload `/?project=v2t` under DevTools Slow 3G for subjective visual review of the detail placeholder proportions.
2. Review and commit implementation, data resources, and `.agent` state files; keep pre-existing deletions out of the commit unless intentional.

## Important Decisions
- The boot skeleton must choose its route before React starts; it is selected by a small inline URL query check.
- Detail routes remove only navigation, not the independent theme toggle.
- Do not reuse a document route marker as a component class name.

## Risks and Open Questions
- The static detail skeleton intentionally approximates the shared detail layout; if per-project detail pages later diverge significantly, add per-project skeleton variants only when their structural layouts genuinely differ.

## Start Here
```powershell
git status --short
npm run dev
```