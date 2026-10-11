# Session Handoff
Created: 2026-10-11
Branch: main
Working tree: Portfolio expansion and its routing/cache fix are verified locally and remain uncommitted. Modified files are `src/App.tsx`, `public/data/home-work.json`, and the four `.agent/` records; six pre-existing deleted files remain unstaged and untouched.

## Session Goal
Re-audit every visible public-repository branch, assess supplied local projects, add only evidence-backed portfolio cases, and repair reported project navigation regressions.

## Work Completed
- Enumerated all visible branch heads for six public repositories and inspected the source-bearing non-default branches.
- Added SSO from `sso-platform/master` and the passerby-removal pipeline from `eliminate/feature/person-removal-baseline`; their actions point at those exact GitHub branches.
- Added V2T from `C:\Users\zx\Desktop\tmp\v2t` and PharmAgent from the supplied local Challenge Cup project plan as private/local cases with no GitHub link.
- Retained Dingjia as a ScholarWeaver component and excluded `sqldemo` as a learning-focused database example.
- Added shared evidence-oriented detail-page content for the four new cases while preserving the homepage card layout and existing ScholarWeaver/Fubao detail pages.
- Fixed the stale-data routing failure: project JSON now revalidates, unknown IDs show an explicit missing-project page, and all project returns target `/#work`.

## Current Stopping Point
Implementation and browser verification are complete. The next session should commit/push only if the user requests publication.

## Uncommitted Changes
- Modified: `src/App.tsx`, `public/data/home-work.json`, `.agent/current_state.md`, `.agent/lessons.md`, `.agent/TODO_list.md`, `.agent/handoff.md` (portfolio expansion; not published).
- Pre-existing deletions left untouched: `2842293fa2bb01d8eec6e1c9026d2402.png`, `chrome-check-process-no-panel.png`, `chrome-check-studio-light.png`, `chrome-check-studio-no-panel.png`, `chrome-check-work-no-panel.png`, `v2tproject.md`.

## Validation Results
- Portfolio `npm run build` and `git diff --check` passed after the expansion.
- Local browser checks passed for the homepage and all six project routes. GitHub action count is 1 for ScholarWeaver, SSO, and Eliminate; 0 for PharmAgent, V2T, and Fubao.
- Visual browser check confirmed the project list appears correctly once its existing viewport reveal triggers.
- Fresh-browser regression check passed: 6 homepage cards; six matching detail titles; click-back URL `/#work`; obsolete `dingjia` produces “这个项目链接已失效”.
- Fubao `flutter test` executed 86 tests and failed one Golden baseline (`younger_plans`, 0.17%, 574 px).
- V2T `npm run build` passed; `python -m pytest tests -q` reported 23 passed.
- Eliminate `PYTHONPATH=src python -m unittest discover -s tests -v` reported 12 passed.
- `git ls-remote --heads` completed for all six public repositories; non-default branch source was inspected for SSO, sqldemo, Eliminate, and Dingjia.

## Failing Tests or Known Errors
- Fubao Golden failure remains unresolved; review `test/visual/page_golden_test.dart` and the generated failure image before declaring its suite green.
- ScholarWeaver was not run end-to-end because MinerU, terminology, model-service, and API configuration were not available.
- V2T's README deployment URL returned Cloudflare Tunnel Error 1033 during browser review; no live-demo link is shown.

## Recommended Next Steps
1. If publication is requested, stage only the six portfolio/state files and preserve the six pre-existing deletions.
2. After publishing, use a fresh browser session or hard reload to verify the deployed project JSON revalidates and the six-card list renders.
3. Restore the V2T Tunnel before adding any live-demo action; verify it in a browser first.
4. Review the Fubao Golden diff and either fix the UI or approve a baseline update.

## Important Decisions
- Private projects may be described and have detail pages, but must not expose a repository URL.
- ScholarWeaver is a public collaboration; its contribution claims are restricted to its visible Git history.
- No sensitive material from private source was included in source, content, logs, or links.
- Non-default remote branches are in scope for repository audits; default-branch-only exclusions are insufficient.
- ASR and PharmAgent are described from user-provided local materials; the former has locally passing build/tests but an unavailable public Tunnel, and the latter is presented with its user-supplied national-finalist status and project-plan scope.
- Project routes never substitute a fallback project for an unknown ID; explicit failure is safer than a mismatched case study.

## Risks and Open Questions
- ScholarWeaver’s complete runtime flow is not independently executed, so no performance, accuracy, or deployment claims are made.
- Fubao’s Golden mismatch needs an explicit disposition before claiming full test health.
- No user request has yet authorized pushing this local expansion to `origin/main`.

## Start Here
```powershell
git status --short
npm run build
git diff --check
```
