# Current State
Last updated: 2026-10-12
Current branch: main
Current phase: Project-detail evidence, original-document figure galleries, shared-transition, first-viewport vertical-layout, and startup blank-state fixes verified locally; publication pending

## Current Objective
Maintain truthful Projects content and project detail pages whose project scope, authorship, links, validation status, and first-viewport hierarchy match audited evidence and the existing design system.

## Completed
- Fixed the startup blank state by keeping `#root` visible during `font-loading`. A forced `font-loading app-ready` browser probe now retains visible application text, preventing the root and boot skeleton from being hidden together.
- Added a native browser shared-element transition from every Projects card to its matching detail-case masthead. The selected card and the masthead share the `project-card` View Transition name; the root/background uses a coordinated 680ms-out / 720ms-in scale.
- Homepage scroll entry now reveals child items once with a 90ms stagger and a direct left-to-right slide (32px entry offset, 620ms) that stops at its final position without overshoot; reduced-motion users receive no animation.
- Preserved one-time outer scroll-reveal and internal staggered entry animations for proof, work, skills, and about sections.
- Added independent 400px-preloaded JSON resources with skeleton, error, retry, and in-place content fade states.
- Added an inline HTML/CSS boot skeleton before React/background video readiness, including per-element shimmer with light/dark tokens and reduced-motion support.
- Project-detail routes no longer render the top navigation bar; the theme toggle remains available.
- Detail routes now use a route-aware `candidate-shell--detail` modifier: their return row begins below the remaining theme control rather than retaining the homepage shell's navigation allowance. The Hero masthead begins at 119px on the checked desktop, tablet, and mobile viewports without changing its internal layout.
- Added a query-aware detail boot skeleton matching the actual return row, split Hero, project goal/facts grid, and evidence section. The homepage boot skeleton is hidden on `?project=` routes.
- Committed and pushed the implemented loading and detail-route work to `origin/main` as `27c8978`.
- Completed a public-repository audit across every visible branch head. Added SSO (`master`) and subject-protecting passerby removal (`feature/person-removal-baseline`) as public portfolio cases; retained Dingjia only as ScholarWeaver’s component and excluded the learning-focused `sqldemo`.
- Audited local V2T ASR and PharmAgent materials and added both as private/local project cases without GitHub links. PharmAgent is presented as a Challenge Cup AI+ national-finalist project per the user's supplied status and local project plan.
- Expanded `public/data/home-work.json` to six projects and added a shared evidence-oriented detail renderer for the four new cases.
- Fixed project-card reliability: `home-work.json` now revalidates rather than serving an indefinitely cached initial response; obsolete project IDs render an explicit 404-style page instead of falling back to the first project; every detail-page return action targets `/#work`.
- Published the portfolio case-study update to `origin/main` as `5ff9f5e`.
- Published the audited six-project expansion and cache-safe route repair to `origin/main` as `263a3fa`.
- Replaced the generic detail-page hero on all six cases with tailored, content-grounded visual signatures: molecule route (PharmAgent), CAS trust topology, transcript timeline (V2T), protective-mask composition, annotated manuscript (ScholarWeaver), and dual-role care board (Fubao).
- Corrected the independent homepage summary to show the six visible portfolio cases and broadened its scope beyond LLM applications: “06 个覆盖 AI、全栈、视觉与产品工程的代表项目”.
- Replaced the generic system-chain sections for PharmAgent, ScholarWeaver, and Fubao with three evidence modules grounded in the reviewed local documents. PharmAgent now exposes its research-to-delivery handoff; ScholarWeaver exposes its parse/term/RAG/two-stage-translation chain and a clearly labelled native output-structure illustration; Fubao exposes its dual-role daily loop plus OCR/Family/AI data boundaries.
- After explicit user authorization, added six selected original project figures in `public/project-evidence/` and a linked, lazy-loaded gallery beneath each of the three evidence modules: PharmAgent architecture/workflow, ScholarWeaver parsing pipeline/workbench, and Fubao business-loop/system-context diagrams.

## In Progress
- The tailored detail-page redesign, homepage scroll-motion refinement, shared-element transition, and first-viewport spacing refinement are locally verified but not yet committed or pushed.
- The documentation-grounded evidence modules and their user-authorized original-figure galleries are implemented and locally verified, but remain uncommitted and unpublished with the other portfolio refinements.
- Optional manual visual review of shimmer intensity remains available.
- Button-motion comparison is complete. No source change was requested: the current Liquid Glass control retains its restrained press effect; a more physical press/release treatment remains an optional, user-approved refinement.

## Architecture and Key Decisions
- `index.html` initializes `<html>` in `font-loading`, so the mounted React tree can participate in font selection but remains invisible behind the existing boot skeleton until the font gate settles.
- `waitForFinalFonts` in `src/App.tsx` requests all declared family/weight combinations and retries briefly while Vite's injected `@import` registers its font faces. It uses a 4.5-second ceiling. Successful requests release final typography; timeout or failure applies a session-stable system fallback token set so late webfonts cannot create a second visual change.
- Each JSON-backed homepage resource now has its own text corpus gate. It continues to render the existing shimmer skeleton until its actual text's font request is ready, then crossfades into the existing content layout. A resource-only fallback scopes the stable system stack to that resource.
- Scroll reveal waits for the global font gate and records a per-item completion marker. The marker prevents subsequent resource/font state changes from replaying an already completed entrance; its short cleanup timer is allowed to finish across observer effect refreshes.
- `App` owns URL-derived route state and intercepts only an unmodified primary card activation when `document.startViewTransition` is available and reduced motion is not requested. It sets the clicked source with `flushSync` before starting the transition, then swaps the history route in the transition callback. Normal-link navigation remains the fallback.
- `.case-row--transition-source` and `.case-masthead--transition-target` share `view-transition-name: project-card`; route-root pseudo-elements animate the persistent Aurora background with matching scale curves. The transition class and element names are cleared after `transition.finished`.
- `src/App.tsx` keeps `Shell` shared; `showNavigation={!projectId}` omits only `TubelightNavBar` on project-detail routes.
- `Shell` applies `candidate-shell--detail` whenever navigation is omitted. The modifier reduces top padding from the homepage navigation allowance to 64px and removes only the detail return link's own top margin; the 520px breakpoint repeats the modifier so its later homepage rule cannot override it.
- A short inline `index.html` script applies `boot-detail-route` before the React module starts, selecting the correct boot skeleton without waiting for JavaScript bundles.
- The HTML route marker intentionally differs from the `.boot-detail` container class to avoid selector collisions.
- Background video remains decorative and does not gate the loading UI.
- `src/App.tsx` keeps the reveal duration and stagger as shared constants so its timer clears delay variables only after the CSS keyframe sequence finishes.
- The homepage Projects module will continue using `public/data/home-work.json`; only its project data and the icon mapping may change.
- Homepage content remains in `public/data/home-work.json`; only that data and its icon mapping changed, so the existing Projects layout and behavior are protected.
- `ProjectDetail` now dispatches to project-specific content. ScholarWeaver links to the supplied public collaboration repository; Fubao is a private project and intentionally has no repository action.
- ScholarWeaver is presented as a collaboration. Its public history contains 20 visible commits by `MikeHuang2000` and two by `zx`, including a merged relay branch; Dingjia is described only as its reference-example retrieval component.
- `CaseMasthead` is a shared semantic shell; `CaseSignature` deliberately dispatches to six distinct artefact layouts. Case-local CSS variables control accent, ink, and fill colors without changing the shared evidence sections or repository-link rules.
- The user explicitly authorized the selected original project figures for this portfolio. `public/project-evidence/` contains only the six reviewed images used by the three cases; all other document media remains out of the public site.
- `EvidenceLabel`, `SourceFigureGallery`, `PharmAgentEvidence`, `ScholarWeaverEvidence`, and `FubaoEvidence` isolate source-grounded visual proof from shared case layout. The gallery links each lazy-loaded figure at full resolution; the ScholarWeaver proof remains explicitly labelled as a web-native structure illustration rather than a benchmark screenshot.
- `LiquidGlassButton` uses one CSS transform transition for hover, press, and release. Its current `:active` state is `translateY(1.5px) scale(0.985)`; the skin has constant inset shadows. The current cubic-bezier has no overshoot, so the suggested `scale(0.96)` plus pressed-depth and release-spring behavior is not presently implemented.

## Validation Status
- Startup blank-state hotfix (2026-10-12) — passed. A local agent-browser probe forced `font-loading app-ready` and measured `rootVisibility: visible` with 1,183 visible characters. Fresh homepage and `?project=pharmagent` loads passed with visible roots; the detail probe measured 1,708 visible characters and a 1180×482 masthead at 119px. Browser errors were empty.
- Font-gated loading browser checks (2026-10-12) — normal path: `fontState: ready`, root became visible only after the boot skeleton hid, and all declared remote font families were loaded. Blocked-webfont path: while loading, the root contained text but had `visibility:hidden` and the boot skeleton stayed visible; after timeout, `fontState: fallback`, root became visible, and computed fallback tokens were `Arial`/`Microsoft YaHei` plus `Georgia` for display text. Work cards completed their stagger exactly once; after skills loaded, the completed work cards had zero active entrance classes. The skills entry was also observed to clean up after the final timer fix.
- Final production validation is pending: `npm run build` passed before the last one-line scroll-timer cleanup (`tsc --noEmit && vite build`, 1,587 modules transformed), but the post-edit build and `git diff --check` could not run because the command sandbox is locked.
- Detail first-viewport layout (2026-10-12) — local agent-browser probes and screenshot review passed. On `?project=pharmagent`, the Hero masthead moved from 182px to 119px at 1440×900 and 768×1024; at 390×844 it moved from 164px to 119px. The theme control ended at 60px/56px/52px respectively, the return link began at 65px, Hero dimensions remained unchanged for each viewport, and no horizontal overflow occurred. Reviewed captures show the existing Hero content and right-side visualization intact.
- Final detail-layout build (2026-10-12) — `npm run build` passed (`tsc --noEmit && vite build`, 1,587 modules transformed).
- Post-diagnosis state-record verification (2026-10-12) — `git diff --check` passed. The worktree still contains the pre-existing uncommitted source/state work, six unrelated deletions, untracked `docs/`, and the user-authorized untracked `public/project-evidence/` assets; the font diagnosis introduced no application-source edit.
- Homepage font-load diagnosis (2026-10-12) — local browser assertion confirmed that the boot skeleton uses `Arial, Microsoft YaHei, sans-serif` while the mounted site uses `Manrope, Noto Sans SC, Microsoft YaHei, sans-serif`; `IBM Plex Mono`, `Manrope`, and `Noto Sans SC` were loaded as remote fonts. The Google Fonts import explicitly uses `display=swap`. No font implementation change was requested or made.
- Final verification (2026-10-12) — `npm run build` passed (`tsc --noEmit && vite build`, 1,587 modules transformed); `git diff --check` passed after the state-record updates.
- Shared-element route transition (2026-10-12) — local `agent-browser` probe passed: a card activation reached `/?project=pharmagent`; at 80ms the detail masthead was the transition target with `viewTransitionName: project-card`; root-old/root-new durations were `0.68s`/`0.72s`, card-group duration was `0.72s`; at 1s the target class and route-transition class were cleared. The temporary Vite server used for the probe was stopped afterward.
- `npm run build` — passed after the shared-element implementation (`tsc --noEmit && vite build`, 1,587 modules transformed).
- `git diff --check` — passed after the shared-element implementation.
- Final `npm run build` — passed after the homepage scroll-motion refinement (`tsc --noEmit && vite build`; 1,586 modules transformed).
- Local automated-browser motion check — passed: the Projects section received `scroll-reveal-right`; its first item started at `-32px` while following items remained pending their 90ms delays. The latest 720ms timeline sample measured a maximum `translateX(-0.0839553px)`, confirming that it reaches the final position without positive/rightward overshoot.
- Final `git diff --check` — passed after the homepage scroll-motion refinement and state-record update.
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
- Tailored-page redesign: `npm run build` — passed; `git diff --check` — passed. Agent-browser verified one matching signature on each of the six routes and `/#work` on the return link. Screenshots were reviewed for PharmAgent, SSO, V2T, and Eliminate; Eliminate was also checked in light theme.
- Homepage summary correction: `npm run build` and `git diff --check` — passed; `public/data/home-summary.json` now stores count `06` and the verified revised description.
- Documentation review (2026-10-12) — local-only inspection of four DOCX files, one PDF, and the Fubao architecture HTML completed. It identified ScholarWeaver's parse/term/RAG/translate chain, PharmAgent's target-to-delivery workflow and plugin boundary, and Fubao's dual-role task flow, trust boundaries, and 37 embedded prototype visuals. No application source was changed and no external document service was used.
- Button interaction source audit (2026-10-12) — confirmed `components/ui/liquid-glass-button.tsx` supplies the skin/filter/shine layers; `src/index.css` supplies hover `scale(1.02)`, active `scale(0.985)`, and static inset shadows. The `cubic-bezier(0.1, 0.4, 0.2, 1)` transform transition cannot overshoot.
- `npm run build` — passed after the button-motion review (`tsc --noEmit && vite build`, 1,586 modules transformed).
- `git diff --check` — passed after the button-motion review.
- Evidence modules: `npm run build` — passed (`tsc --noEmit && vite build`, 1,586 modules transformed); `git diff --check` — passed.
- Local browser checks — passed: PharmAgent desktop evidence chain has all five handoff stages; ScholarWeaver desktop route exposes the labelled Demo workflow and output-structure illustration; Fubao route exposes all four role-loop stages and the three OCR/Family/AI boundary nodes at 390px width in light theme. Browser error output was empty after the Fubao theme switch.
- Original project-figure galleries (2026-10-12) — `npm run build` passed (`tsc --noEmit && vite build`, 1,587 modules transformed); `git diff --check` passed. Local agent-browser verified the PharmAgent and ScholarWeaver desktop galleries plus Fubao at 390px in dark and light themes; all six figure links render, the mobile gallery stacks vertically, and browser errors were empty.

## Known Problems
- Font-gated no-swap loading has passed the current normal-path browser and production-build checks. A separate blocked-webfont path should be rechecked if its font-loading implementation changes.
- Homepage typography can visibly change during startup: the inline boot skeleton declares an `Arial`/`Microsoft YaHei` stack, while the mounted page declares `Manrope`/`Noto Sans SC`; in addition, remote Google Fonts use `display=swap`, which intentionally replaces a fallback face after download. This was diagnosed but intentionally left unchanged because no fix was requested.
- No active layout blocker: the focused project-detail Hero was visually reviewed through local agent-browser desktop, tablet, and mobile captures.
- Pre-existing deleted files remain in the worktree and were not changed by this task.
- The Fubao Golden mismatch needs review before the project can be described as fully visual-test clean.
- The private translation-project mirror contained sensitive runtime configuration; it is not linked or used as website content.
- V2T's supplied public Tunnel URL returned Cloudflare Error 1033 during review, so the site intentionally omits a live-demo link.
- The `docs/` directory contains project materials that may be private or assessment-oriented. They must not be uploaded to external document services or copied into public pages without a content/sensitivity review.

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
- `public/project-evidence/`
- `src/App.tsx`
- `C:\Users\zx\AppData\Local\Temp\zx6831-github-audit\LLMs_Database_Translater_public` (temporary public-audit clone)
- `C:\Users\zx\AppData\Local\Temp\zx6831-github-audit\FubaoApp` (temporary private-audit clone)
- `C:\Users\zx\Desktop\tmp\v2t` (local V2T ASR project)
- `C:\Users\zx\Desktop\挑战杯答辩\final\项目书+PharmAgent ： 智能药物发现与递送助手.docx`
- `docs\项目书+PharmAgent ： 智能药物发现与递送助手.docx`
- `docs\项目书+ScholarWeaver PDF Essay Translater.docx`
- `docs\福豹慢病共管家庭智能体产品需求说明书_V1.4.docx`
- `docs\福豹慢病共管家庭智能体系统设计说明书_V1.4.docx`
- `docs\福豹慢病共管家庭智能体_项目架构与领域模型_V1.4.html`
