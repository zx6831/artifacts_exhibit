# Lessons Learned

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
### One-time homepage reveal should unobserve after first intersection
Conclusion: A shared `IntersectionObserver` can independently reveal each homepage section without a scroll event listener when each observed target is unobserved after first visibility.
Scope: Homepage sections in `src/App.tsx`.
Evidence: Browser checks showed sections remain hidden until reached and do not reverse when scrolling up.
Correct approach: Add `is-visible` on `entry.isIntersecting`, then call `observer.unobserve(entry.target)`. Keep a reduced-motion fallback that reveals content immediately.
Related files/tests: `src/App.tsx`, `src/index.css`, `npm run build`.

### Per-element skeleton shimmer needs an equally specific reduced-motion override
Conclusion: A reduced-motion rule targeting only the generic skeleton selector can lose to the visible/loading animation selector and leave shimmer active.
Scope: Resource skeletons in `src/index.css`.
Evidence: Explicit CDP media emulation initially reported `prefers-reduced-motion: reduce` while the pseudo-element still had `element-skeleton-shimmer`; increasing the override selector to match the visible/loading state changed it to `none`.
Correct approach: Each placeholder owns `position:relative`, `overflow:hidden`, a rounded pseudo-element light band, and a transform-only animation. Put the reduced-motion override after the active rule with equal or greater specificity.
Related files/tests: `src/index.css`, CDP `Emulation.setEmulatedMedia` test, `npm run build`.

## Resource Loading
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
