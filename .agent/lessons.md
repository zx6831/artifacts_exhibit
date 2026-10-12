# Lessons Learned

## Font Loading
### Gate real text on the exact font faces it needs
Conclusion: `font-display: swap` alone cannot meet a no-intermediate-font requirement. Keep real text visually hidden behind an existing skeleton until `document.fonts.load()` has resolved for every required family/weight and the actual text corpus; on timeout, lock a local fallback stack so a late webfont cannot trigger a second change.
Scope: Boot-time React content, async JSON resource content, direct project routes, and delayed Google Fonts `@import` registration.
Evidence: In a local browser with webfont requests blocked, the mounted root contained text but computed `visibility:hidden` while the boot skeleton remained visible. After the 4.5-second ceiling it entered the explicit fallback state with stable Arial/Georgia stacks. In the normal path the root released only after all declared remote families appeared in `document.fonts`.
Correct approach: Initialize the document in a loading class before React runs. Retry empty `FontFaceSet.load()` matches briefly because dev-time CSS `@import` registration can lag the first React effect. Gate each late resource with its own extracted text corpus, and scope its fallback tokens locally if only that request fails.
Related files/tests: `index.html`, `src/App.tsx`, `src/index.css`, local agent-browser font ready/failure checks (2026-10-12).

### Persist reveal completion independently of resource and font state
Conclusion: A scroll-reveal effect that re-runs as async resource/font state changes must remember which elements have completed; otherwise completed entries can replay or retain an animation class when cleanup timers are cancelled by a later effect refresh.
Scope: Homepage proof/work/skills/about sections.
Evidence: The first implementation left skills items with `scroll-reveal-item` after a subsequent resource update cleared its timer. Letting the short cleanup timer finish and marking each completed item fixed this; the browser then reported zero active work entrance classes after skills loaded.
Correct approach: Mark an item as completed as its first reveal begins, do not prepare it again, and remove its animation class after the final stagger interval even if the observer effect is refreshed.
Related files/tests: `src/App.tsx`, local agent-browser work/skills scroll check (2026-10-12).

## Repository Workflow
### Scope commits when the worktree contains unrelated deletions
Conclusion: Existing unstaged deletions must be left outside a delivery commit unless the user explicitly asks to include them.
Scope: This repository's mixed worktree during the loading/detail-route delivery.
Evidence: `27c8978` pushed only the eleven staged implementation and state files; the six pre-existing deletions remained unstaged afterward.
Correct approach: Inspect `git status --short`, commit the explicit staged set, and verify the post-push worktree before reporting delivery.
Related files/tests: `git status --short`, commit `27c8978`.

## Route-Specific Loading UI
### Pre-React loading UI must select its layout from the URL synchronously
Conclusion: The startup skeleton is rendered before React runs, so project-detail loading cannot be corrected by React route state alone.
Scope: `index.html` startup path for `?project=` routes.
Evidence: A CDP Slow 3G-equivalent reload kept React unmounted while the inline route script selected the detail skeleton; its Hero appeared at 3s and grid/facts/evidence regions at 6s.
Correct approach: Use a small inline query check that applies a unique document route marker before the boot skeleton markup is painted, then use CSS to show one route-specific layout.
Related files/tests: `index.html`, CDP Slow 3G-equivalent test.

### Route markers must not reuse a component class name
Conclusion: Giving both `<html>` and the detail skeleton container the class `boot-detail` caused the container's `display:none` rule to apply to `<html>`.
Scope: Inline boot skeleton CSS.
Evidence: Browser inspection showed `.boot-detail` selected the document element and resolved to `display:none` until the route marker was renamed.
Correct approach: Use a distinct document-level marker (`boot-detail-route`) and retain `boot-detail` exclusively for the container.
Related files/tests: `index.html`, browser computed-style inspection.

## Frontend Motion
### Startup fallback must never hide both the application root and its boot skeleton
Conclusion: The `font-loading` root gate and `app-ready` boot-skeleton dismissal form a failure boundary: if both classes coexist, hiding both layers produces a completely blank viewport even though React has mounted.
Scope: `index.html` boot skeleton and `src/index.css` font-loading styles.
Evidence: On local Vite port 5176, the strict browser assertion found `#root` and `.candidate-hero` in the DOM but with zero visible text. An isolated class probe reproduced `font-loading app-ready` as `rootVisibility: hidden`, `bootVisibility: hidden`, and `visibleTextLength: 0`; making only the root visible restored 1,183 visible characters.
Correct approach: Keep the mounted root paintable during font loading. The boot skeleton can remain the first visual layer, but no CSS combination may make both layers invisible. Post-edit regression verification passed with the forced class combination, a fresh homepage load, and a fresh project-detail load.
Related files/tests: `src/index.css`, `index.html`, local agent-browser blank-state probe (2026-10-12).

### Startup UI and mounted UI must use a compatible font strategy
Conclusion: A visible startup skeleton will produce a typography handoff if it declares a different font stack from the mounted application; `font-display: swap` can add a second fallback-to-webfont change on cold loads.
Scope: `index.html` boot skeleton and global typography in `src/index.css`.
Evidence: A local browser assertion reported `fontStackMismatch: true`: the boot skeleton used `Arial, \"Microsoft YaHei\", sans-serif`, while the live site used `Manrope, \"Noto Sans SC\", \"Microsoft YaHei\", sans-serif`; `IBM Plex Mono`, `Manrope`, and `Noto Sans SC` were present in `document.fonts`. The stylesheet imports Google Fonts with `display=swap`.
Correct approach: If a product decision calls for a stable first paint, align the skeleton and live fallback stacks, then decide separately whether to self-host/preload the chosen WOFF2 files or accept the deliberate `swap` behavior. Do not attribute the effect to theme or route code unless its computed font family changes.
Related files/tests: `index.html`, `src/index.css`, local agent-browser font-stack assertion (2026-10-12).

### Name the source before starting a native View Transition
Conclusion: A card-to-detail shared transition needs one stable name on the clicked source before the browser captures the old state, and the matching name on the detail masthead during the route update.
Scope: Projects-card navigation in this React single-document portfolio.
Evidence: The local browser probe clicked PharmAgent and, at 80ms, observed `?project=pharmagent`, a `.case-masthead--transition-target` with `viewTransitionName: project-card`, and the configured root/card animation durations; at 1s the temporary classes and names were cleared.
Correct approach: Set the selected project ID with `flushSync`, call `document.startViewTransition`, then use another `flushSync` in its update callback to push the route and render the target. Preserve ordinary anchor navigation when the API is unsupported or `prefers-reduced-motion` is active.
Related files/tests: `src/App.tsx`, `src/index.css`, local agent-browser shared-transition probe (2026-10-12).

### A cubic-bezier without an out-of-range Y control point cannot create a release overshoot
Conclusion: The current button transform transition, `cubic-bezier(0.1, 0.4, 0.2, 1)`, is a monotonic settle; it cannot yield a spring-style overshoot.
Scope: `LiquidGlassButton` press/release feedback.
Evidence: The Y control points are `0`, `0.4`, `1`, and `1`; none exceeds the final value or falls below the initial value. The only active transform is `translateY(1.5px) scale(0.985)`.
Correct approach: If a future design requires a release overshoot, use an explicitly release-scoped spring/overshoot transition (often a short pointer-event state) and disable it under `prefers-reduced-motion`. Do not describe the current easing as a spring.
Related files/tests: `src/index.css` lines 539–642, `components/ui/liquid-glass-button.tsx`, `npm run build` (2026-10-12).

### One-time homepage reveal should unobserve after first intersection
Conclusion: A shared `IntersectionObserver` can independently reveal each homepage section without a scroll event listener when each observed target is unobserved after first visibility.
Scope: Homepage sections in `src/App.tsx`.
Evidence: Browser checks showed sections remain hidden until reached and do not reverse when scrolling up.
Correct approach: Add `is-visible` on `entry.isIntersecting`, then call `observer.unobserve(entry.target)`. Keep a reduced-motion fallback that reveals content immediately.
Related files/tests: `src/App.tsx`, `src/index.css`, `npm run build`.

### Keep delayed-stagger cleanup aligned with keyframe duration
Conclusion: The JavaScript timer that clears inline stagger delays must not finish before the CSS keyframe animation; otherwise the last child can prematurely settle.
Scope: Homepage scroll-reveal groups in `src/App.tsx` and `src/index.css`.
Evidence: The direct entrance uses a 620ms keyframe with a 90ms item stagger. Automated browser sampling confirmed delayed child items remained at their starting offset while the first item animated; its trajectory stayed at or left of the final position (maximum sampled `translateX(-0.0839553px)`).
Correct approach: Define the duration and stagger once for the reveal hook, set the CSS animation to the matching duration, and calculate cleanup as `duration + (item count - 1) * stagger`. Use only start and final keyframes when no overshoot is desired, and disable the animation in the reduced-motion override.
Related files/tests: `src/App.tsx`, `src/index.css`, `npm run build`, local automated-browser motion sample.

## Project Detail Design
### Detail routes need their own shell rhythm when navigation is removed
Conclusion: Hiding a fixed homepage navigation must also remove the matching homepage top-padding allowance; otherwise a detail Hero can appear visually too low even when the Hero itself is correctly laid out.
Scope: `Shell` and project-detail routes in this portfolio.
Evidence: Before the route-aware modifier, `.candidate-shell` retained `padding-top:112px` on desktop/tablet (94px at 390px), and `.back-link` added a 16px top margin. The PharmAgent masthead began at 182px on 1440×900 and 768×1024 and 164px on 390×844. After the `candidate-shell--detail` modifier applies 64px padding and zeroes only that link's top margin, the masthead begins at 119px in all three checked viewports; no horizontal overflow occurred and the theme control still ends above the return row.
Correct approach: Express the difference through the shared shell's route-specific class and normal spacing properties. Do not move the whole detail page with transforms or negative margins, and repeat a modifier inside a later breakpoint if a same-specificity homepage rule would otherwise override it.
Related files/tests: `src/App.tsx`, `src/index.css`, local agent-browser geometry probes and screenshot review (2026-10-12), `npm run build`.

### Shared evidence layout can support tailored case-study identities
Conclusion: Detail pages can remain structurally consistent and evidence-bounded while their hero is tailored to the system's actual working artefact instead of repeating a generic icon panel.
Scope: The six portfolio routes in `src/App.tsx`.
Evidence: Agent-browser found exactly one case-specific signature on each route; reviewed screenshots showed distinct molecule-route, CAS trust-topology, transcript-timeline, and protective-mask treatments. `npm run build` passed.
Correct approach: Keep the common facts, validation, and resources sections intact. Use `CaseMasthead` for shared semantic structure and dispatch through `CaseSignature` for project-specific diagrams; scope color variables on each page and provide dark-theme values.
Related files/tests: `src/App.tsx`, `src/index.css`, `npm run build`, agent-browser route checks.

### Per-element skeleton shimmer needs an equally specific reduced-motion override
Conclusion: A reduced-motion rule targeting only the generic skeleton selector can lose to the visible/loading animation selector and leave shimmer active.
Scope: Resource skeletons in `src/index.css`.
Evidence: Explicit CDP media emulation initially reported `prefers-reduced-motion: reduce` while the pseudo-element still had `element-skeleton-shimmer`; increasing the override selector to match the visible/loading state changed it to `none`.
Correct approach: Each placeholder owns `position:relative`, `overflow:hidden`, a rounded pseudo-element light band, and a transform-only animation. Put the reduced-motion override after the active rule with equal or greater specificity.
Related files/tests: `src/index.css`, CDP `Emulation.setEmulatedMedia` test, `npm run build`.

## Resource Loading
### Homepage summary copy is an independent source of truth
Conclusion: The homepage proof strip reads its count and description from `home-summary.json`, independently of the six-card `home-work.json` list.
Scope: Portfolio count and scope wording on the homepage.
Evidence: The visible project list had six entries while `home-summary.json` still stored `count: "03"` and LLM-only wording.
Correct approach: Whenever the Projects list changes, update the summary count and scope language in the same scoped change, then run `npm run build` and inspect the JSON value.
Related files/tests: `public/data/home-summary.json`, `public/data/home-work.json`, `npm run build`.

### Project-card data must revalidate when route IDs evolve
Conclusion: Independently cached homepage project JSON can become inconsistent with a newly deployed route registry, producing missing cards and incorrect fallback details.
Scope: `home-work.json` loading and `?project=<id>` routing in this portfolio.
Evidence: The resource loader used `force-cache`; an obsolete `dingjia` ID resolved through `projects.find(...) ?? projects[0]` and rendered PharmAgent. A fresh browser session loaded six current cards, while the old cache state exposed the mismatch.
Correct approach: Request project data with `cache: "no-cache"` so the browser revalidates it, and render an explicit unknown-project page instead of substituting an unrelated first project.
Related files/tests: `src/App.tsx`, fresh-browser route regression check.

### Retries must bypass cached failed resource responses
Conclusion: A resource loader using `force-cache` for fast preloads must refresh cache on retry.
Scope: `useJsonResource` in `src/App.tsx`.
Evidence: When `public/data/home-work.json` was temporarily unavailable, the first retry remained in error because the failed response was reused. A cache-refresh retry then recovered successfully after the file was restored.
Correct approach: Use cache-friendly loading for initial preloads, but append a retry cache-buster and request with `cache: "reload"` for explicit retries.
Related files/tests: `src/App.tsx`, resource failure/retry browser test.

### React loading UI cannot cover the pre-JavaScript gap
Conclusion: A React skeleton cannot render until its JavaScript bundle has downloaded and executed; it cannot prevent an empty first viewport under severe network throttling.
Scope: The homepage and project-detail startup paths.
Evidence: CDP Slow 3G-equivalent reloads kept React unmounted while the inline boot skeleton stayed visible.
Correct approach: Put a small, route-aware first-viewport placeholder and critical CSS directly in `index.html`; dismiss it after the first application commit, not after background media readiness.
Related files/tests: `index.html`, `src/App.tsx`, CDP Slow 3G-equivalent tests.

## Repository Audit
### Audit every visible remote branch, not only the default branch
Conclusion: A repository's default branch is not sufficient evidence for judging whether it contains a project implementation.
Scope: Public repository audits used for portfolio selection and attribution.
Evidence: `zx6831/sso-platform` resolves `HEAD` to `main` (`8d5015e`), but its separate `master` branch at `43171e3` contains the CAS server, two clients, database migrations, infrastructure, and tests.
Correct approach: Enumerate `git ls-remote --heads <repository>` for every audited repository, then inspect each distinct branch head before deciding to exclude or describe a project.
Related files/tests: temporary audit clone `C:\Users\zx\AppData\Local\Temp\zx6831-github-audit\sso-platform-master`, `git ls-remote --heads https://github.com/zx6831/sso-platform.git`.

### Do not link a deployed demo that fails its availability check
Conclusion: A deployment URL found in local project documentation is not evidence that the public demo is currently usable.
Scope: Portfolio actions for locally maintained or privately sourced projects.
Evidence: Opening the V2T URL recorded in its README returned Cloudflare Tunnel Error 1033 during the portfolio audit, while its local frontend build and 23 pytest cases passed.
Correct approach: Keep the portfolio case and its locally verified evidence, but omit the live-demo action until a browser availability check succeeds.
Related files/tests: `C:\Users\zx\Desktop\tmp\v2t\README.md`, V2T `npm run build`, `python -m pytest tests -q`.

### Attribute collaborative work from visible history, not repository ownership
Conclusion: A related component repository does not establish authorship of the whole project.
Scope: Portfolio descriptions for ScholarWeaver and the Dingjia reference-example component.
Evidence: `MikeHuang2000/LLMs_Database_Translater` has 20 visible commits by `MikeHuang2000` and two by `zx`; `zx`'s merged relay work adds a local service forwarding layer and endpoint-connectivity tests.
Correct approach: Label the project a collaboration and scope the contribution statement to the visible history; describe Dingjia as a component when the project README identifies it that way.
Related files/tests: `src/App.tsx`, public commits `e1964c4` and `62687c8`.

### Do not promote private configuration into portfolio content
Conclusion: A private source repository can contain sensitive runtime configuration even when its project summary is safe to describe.
Scope: Portfolio review and detail-page authoring for private repositories.
Evidence: The audited private translation-project mirror included sensitive configuration material.
Correct approach: Omit its link, do not copy configuration values into content or logs, and preserve only non-sensitive project descriptions where attribution is supportable.
Related files/tests: `src/App.tsx`, private audit clone.

## Validation
### A Golden mismatch is a failed test suite
Conclusion: A small screenshot difference still makes a Flutter test command fail.
Scope: Fubao Flutter visual regression tests.
Evidence: `flutter test` executed 86 tests and failed `younger_plans` with 0.17% / 574 pixels differing.
Correct approach: Record the concrete mismatch and fix or review-rebaseline it before claiming all tests pass.
Related files/tests: Fubao `test/visual/page_golden_test.dart`, `src/App.tsx`.

## Portfolio Evidence Design
### Publish original document figures only with explicit user authorization
Conclusion: Project documents should remain local by default, but their selected original figures may be published when the user explicitly authorizes that use and the page clearly describes what each figure demonstrates.
Scope: PharmAgent, ScholarWeaver, and Fubao portfolio detail pages.
Evidence: The 2026-10-12 local review found diagram-heavy project materials and 37 Fubao prototype visuals. The user then explicitly authorized use of document-original architecture figures. Six chosen files were copied to `public/project-evidence/`, where local browser checks confirmed accessible captions, full-resolution links, desktop pairing, and mobile stacking.
Correct approach: Keep the selection narrow and identify each figure by purpose. Retain the page-native evidence chain for orientation, lazy-load the original, provide descriptive alt text and a full-resolution link, and do not turn architecture or screenshot material into unverified performance claims.
Related files/tests: `public/project-evidence/`, `src/App.tsx`, `src/index.css`, `npm run build`, local agent-browser gallery checks (2026-10-12).

### Evidence modules should replace a generic chain, not enlarge the page with a second hero
Conclusion: A source-grounded evidence section has the most value immediately after the project-position facts; it clarifies the page's thesis without competing with the case-specific Hero.
Scope: PharmAgent, ScholarWeaver, and Fubao case studies.
Evidence: The three 2026-10-12 modules replace their prior generic system-chain sections while preserving the shared `CaseMasthead`, evidence boundaries, implementation cards, and resource sections. The follow-up original-figure galleries provide deeper proof without introducing a competing Hero. Local browser checks showed the intended stages, boundary nodes, and figure galleries at desktop and 390px mobile widths.
Correct approach: Make each module encode a real sequence or boundary from source material, use an explicit evidence-status label, and retain one shared structural location. Pair a compact native explanation with user-authorized original diagrams when the reader benefits from the full detail.
Related files/tests: `src/App.tsx`, `src/index.css`, `public/project-evidence/`, `npm run build`, local agent-browser route checks.

### An awards page should begin with only supported credentials
Conclusion: A well-evidenced recognition ledger is more credible than filling a portfolio awards section with placeholders or inferred awards.
Scope: Homepage recognition content and future personal-achievement records.
Evidence: User-supplied award facts support five records: three national, one provincial, and one school-level. The local Xuanji project brief supports only its project title, contest context, iDrugMap positioning, and research-task scope; it does not independently validate clinical or performance claims. Browser review confirmed five readable cards, three intentional project routes, and two intentional non-link math-modeling records.
Correct approach: Keep each record in `public/data/home-awards.json`, include level, title, result, evidence scope, and a project route only when the user specifies an association. Treat independent awards as deliberately non-link records. For project briefs, summarize only their supported positioning and module scope; do not reproduce unverified scale, efficacy, or commercial claims.
Related files/tests: `public/data/home-awards.json`, `public/data/home-work.json`, `public/data/home-summary.json`, `src/App.tsx`, `src/index.css`, `npm run build`, `git diff --check`, awards/Xuanji browser QA (2026-10-12).
## Homepage Navigation and Content Integrity
### Restore first-load hash navigation after resource and font layout settles
Conclusion: Browser-native hash handling can run before a React homepage has rendered or sized its JSON-backed sections, leaving a direct /#section URL at the top of the page.
Scope: First-load anchors on this portfolio homepage.
Evidence: A fresh 390×844 browser open at /#about initially reported scrollY: 0 while #about was far below the viewport. After preloading homepage resources and restoring the section once resource/font gates were ready, the same route reported aboutTop: 90, visible About content, and no horizontal overflow.
Correct approach: Capture the initial hash once, eagerly load the small section resources only for that path, then make one behavior: auto scroll after data and per-section text-font gates are ready. Keep ordinary in-page navigation smooth and reduced-motion aware.
Related files/tests: src/App.tsx, local agent-browser mobile deep-link check (2026-10-12), npm run build.

### Do not expose portfolio placeholders as public profile content
Conclusion: Visible labels such as 姓名, 头像待替换, and a mock résumé download communicate unfinished work more loudly than a restrained, truthful portfolio framing.
Scope: Public-facing Hero, identity, footer, and contact copy when approved personal materials are unavailable.
Evidence: Initial desktop and 390px mobile screenshots exposed each placeholder in the first viewport. The replacement CASEBOOK / 2026 card uses the seven visible cases and their existing source/test/material boundaries; post-edit browser checks found no placeholder text and retained responsive balance.
Correct approach: Replace unsupplied identity claims with a concrete explanation of the work actually present, and route secondary actions to a real contact path. Add a name, portrait, credentials, or résumé only after the user provides approved material.
Related files/tests: src/App.tsx, public/data/home-about.json, post-edit browser checks at 1440×900 and 390×844 (2026-10-12).

### Make mobile floating controls a legible layer, not competing transparent text
Conclusion: A translucent fixed navigation that works over sparse desktop imagery can become illegible when it crosses dense mobile titles and long award cards.
Scope: The Tubelight navigation and theme control below 560px.
Evidence: Before the adjustment, 390px screenshots showed award heading text visibly mixing through the nav pill. With a high-opacity surface derived from existing background tokens, the same mobile award landing remained readable and retained the existing active lamp treatment.
Correct approach: Preserve the component and its motion, but raise the surface opacity only at the constrained breakpoint; verify anchor landing below the control and both themes rather than flattening the desktop design.
Related files/tests: src/index.css, mobile light/dark screenshots and /#awards navigation check (2026-10-12).
