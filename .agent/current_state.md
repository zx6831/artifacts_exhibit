# Current State
Last updated: 2026-10-11
Current branch: main
Current phase: Portfolio expansion with cache-safe project routing verified locally

## Current Objective
Maintain truthful Projects content and project detail pages whose project scope, authorship, links, and validation status match audited evidence.

## Completed
- Preserved one-time outer scroll-reveal and internal staggered entry animations for proof, work, skills, and about sections.
- Added independent 400px-preloaded JSON resources with skeleton, error, retry, and in-place content fade states.
- Added an inline HTML/CSS boot skeleton before React/background video readiness, including per-element shimmer with light/dark tokens and reduced-motion support.
- Project-detail routes no longer render the top navigation bar; the theme toggle remains available.
- Added a query-aware detail boot skeleton matching the actual return row, split Hero, project goal/facts grid, and evidence section. The homepage boot skeleton is hidden on `?project=` routes.
- Committed and pushed the implemented loading and detail-route work to `origin/main` as `27c8978`.
- Completed a public-repository audit across every visible branch head. Added SSO (`master`) and subject-protecting passerby removal (`feature/person-removal-baseline`) as public portfolio cases; retained Dingjia only as ScholarWeaver’s component and excluded the learning-focused `sqldemo`.
- Audited local V2T ASR and PharmAgent materials and added both as private/local project cases without GitHub links. PharmAgent is presented as a Challenge Cup AI+ national-finalist project per the user's supplied status and local project plan.
- Expanded `public/data/home-work.json` to six projects and added a shared evidence-oriented detail renderer for the four new cases.
- Fixed project-card reliability: `home-work.json` now revalidates rather than serving an indefinitely cached initial response; obsolete project IDs render an explicit 404-style page instead of falling back to the first project; every detail-page return action targets `/#work`.
- Published the portfolio case-study update to `origin/main` as `5ff9f5e`.
- Published the audited six-project expansion and cache-safe route repair to `origin/main` as `263a3fa`.

## In Progress
- Optional manual visual review of shimmer intensity remains available.

## Architecture and Key Decisions
- `src/App.tsx` keeps `Shell` shared; `showNavigation={!projectId}` omits only `TubelightNavBar` on project-detail routes.
- A short inline `index.html` script applies `boot-detail-route` before the React module starts, selecting the correct boot skeleton without waiting for JavaScript bundles.
- The HTML route marker intentionally differs from the `.boot-detail` container class to avoid selector collisions.
- Background video remains decorative and does not gate the loading UI.
- The homepage Projects module will continue using `public/data/home-work.json`; only its project data and the icon mapping may change.
- Homepage content remains in `public/data/home-work.json`; only that data and its icon mapping changed, so the existing Projects layout and behavior are protected.
- `ProjectDetail` now dispatches to project-specific content. ScholarWeaver links to the supplied public collaboration repository; Fubao is a private project and intentionally has no repository action.
- ScholarWeaver is presented as a collaboration. Its public history contains 20 visible commits by `MikeHuang2000` and two by `zx`, including a merged relay branch; Dingjia is described only as its reference-example retrieval component.

## Validation Status
- `npm run build` — passed after detail-route changes.
- Slow 3G-equivalent CDP test (400ms latency, 6400 B/s down, cache-bypassing reload) — passed: at 3s React was not mounted, the detail boot skeleton was displayed and the homepage skeleton hidden; at 6s the detail grid, facts, and evidence placeholders were present.
- Post-load browser check — passed: project detail rendered Hero/grid/theme toggle, boot skeleton was hidden, and top-navigation count was 0.
- `git diff --check` — passed before the implementation commit.
- `git push origin main` — succeeded for `27c8978`.
- GitHub audit — completed for six public `zx6831` repositories, two accessible private repositories, and the supplied public ScholarWeaver repository. Homepage content retains only ScholarWeaver and Fubao.
- `npm run build` — passed after the final update.
- `git diff --check` — passed after the final update.
- `git push origin main` — succeeded for `5ff9f5e`.
- Local browser checks — passed for the homepage, `/?project=scholarweaver`, and `/?project=fubao`; only ScholarWeaver has a GitHub action.
- Fubao clone `flutter pub get && flutter test` — 86 tests executed; failed one `younger_plans` Golden baseline with a 0.17% / 574-pixel difference.
- All visible branch heads were enumerated for `artifacts_exhibit`, `sso-platform`, `sqldemo`, `eliminate`, `dingjia`, and `chat-want-to-say`; source-bearing non-default branches were inspected.
- V2T local frontend `npm run build` — passed; `python -m pytest tests -q` — 23 passed.
- Eliminate `PYTHONPATH=src python -m unittest discover -s tests -v` — 12 passed.
- Portfolio `npm run build` and `git diff --check` — passed after the expansion.
- Local browser route checks — passed for all six project routes. GitHub action count is 1 for ScholarWeaver, SSO, and Eliminate; 0 for PharmAgent, V2T, and Fubao.
- Fresh-browser regression check — passed: homepage has 6 cards; all 6 route titles match; return navigation reaches `/#work`; obsolete `dingjia` renders “这个项目链接已失效”.
- `git push origin main` — succeeded for `263a3fa`.

## Known Problems
- The desktop computer-control/viewer channel is blocked by a sandbox lock, so subjective screenshot inspection is unavailable here; computed-style and CDP checks completed successfully.
- Pre-existing deleted files remain in the worktree and were not changed by this task.
- The Fubao Golden mismatch needs review before the project can be described as fully visual-test clean.
- The private translation-project mirror contained sensitive runtime configuration; it is not linked or used as website content.
- V2T's supplied public Tunnel URL returned Cloudflare Error 1033 during review, so the site intentionally omits a live-demo link.

## Blockers
- None.

## Important Files
- `index.html`
- `src/App.tsx`
- `src/index.css`
- `public/data/home-summary.json`
- `public/data/home-work.json`
- `public/data/home-skills.json`
- `public/data/home-about.json`
- `src/App.tsx`
- `C:\Users\zx\AppData\Local\Temp\zx6831-github-audit\LLMs_Database_Translater_public` (temporary public-audit clone)
- `C:\Users\zx\AppData\Local\Temp\zx6831-github-audit\FubaoApp` (temporary private-audit clone)
- `C:\Users\zx\Desktop\tmp\v2t` (local V2T ASR project)
- `C:\Users\zx\Desktop\挑战杯答辩\final\项目书+PharmAgent ： 智能药物发现与递送助手.docx`
