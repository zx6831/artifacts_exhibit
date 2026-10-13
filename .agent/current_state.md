# Current State
Last updated: 2026-10-13
Current branch: main (HEAD 0264661, aligned with origin/main)
Current phase: Portfolio redesign and consistent award-card layout implemented; changes are uncommitted

## Current Objective
Present 王泽贤's seven-case AI application engineering portfolio as a recruiter-readable personal site with traceable role boundaries, a usable résumé, and stable desktop/mobile navigation.

## Completed
- Hero and About now identify 王泽贤, 华南理工大学软件学院软件工程专业（工业软件卓越班）本科生, with supplied research interests, experience summary, skills, email, GitHub, and résumé actions.
- Homepage order is Hero → proof strip → projects → capabilities → honours → about/contact, so representative work appears before the full honours ledger.
- All seven project cards now expose project status, personal role or project scope, evidence source, and technology stack. Team/private claims are bounded when the supplied material does not isolate personal ownership.
- PharmAgent and ScholarWeaver role statements were verified from their project documents. Fubao is labeled as project scope because its documents do not assign an individual module to 王泽贤.
- The site has a custom routed-Z favicon, 1200×630 social card, Chinese metadata, canonical/OG/Twitter fields, Person JSON-LD, and route-specific project title/description/canonical updates.
- `public/wang-zexian-resume.pdf` is a generated one-page A4 résumé; obsolete public mock résumé assets were removed.
- Direct and in-page hash navigation now reloads required async sections and recalibrates the target after content/font stabilization.
- All five honour cards use one horizontal certificate template on desktop/tablet and one stacked template on mobile. Linked and independent awards share the same related-work slot.

## In Progress
- No implementation work is in progress.
- The current redesign and state-file changes remain uncommitted.

## Architecture and Key Decisions
- `src/App.tsx` owns routing, JSON resource loading, section navigation, metadata updates, origin capture, and View Transitions.
- Homepage copy remains in `public/data/home-*.json`; detailed case evidence remains in `src/App.tsx` and `src/case-stories.tsx`.
- Project labels distinguish `个人职责`, `参与项目`, `项目范围`, and `实现重点` according to available evidence instead of forcing every project into a sole-author claim.
- The visual direction remains dark ink, ice cyan, glass surfaces, mono evidence labels, and project-specific diagrams.
- The public URL used for canonical metadata is `https://206831.xyz/`.

## Validation Status
- `npm run build` passed on 2026-10-13: TypeScript and Vite completed, 1,588 modules transformed.
- `git diff --check` passed on 2026-10-13; only Git line-ending notices were printed.
- Chromium desktop 1440×900 and mobile 390×844 checks passed for the Hero, project list, compact project grid, About, and PharmAgent detail; measured horizontal overflow was 0.
- Fresh mobile `/#about` stabilized with the target at 87.7px. Immediate homepage navigation to About also stabilized at 87.7px after async sections expanded.
- PharmAgent detail metadata resolved to its project title, description, and `https://206831.xyz/?project=pharmagent` canonical URL.
- `GET /wang-zexian-resume.pdf` returned HTTP 200, `application/pdf`, 182,709 bytes. The rendered one-page PDF was visually checked with no clipping or overlap.
- Award cards were checked in Chromium at 1440×900, 768×1024, and 390×844. Desktop/tablet cards measured 254px high with consistent result/title/related-work/source regions; mobile had no horizontal overflow or runtime errors.

## Known Problems
- Real Safari/iOS WebKit remains unverified.
- The provided `docs` directory contains detailed source groups for PharmAgent, ScholarWeaver, and Fubao only. Other project copy is limited to previously verified repository/test/material facts.
- Several private/team projects still lack public screenshots, demos, measured product outcomes, or individually attributed module records.
- Fubao's prior 0.17% / 574-pixel `younger_plans` Golden mismatch was not re-run in this session.

## Blockers
- None for the requested website redesign.
- Adding stronger project-specific outcomes depends on new verified artefacts or measurements from the user.

## Important Files
- `src/App.tsx` — homepage, project roles, metadata, routing, and stable section navigation.
- `src/index.css` — responsive identity, project, About, awards, and mobile navigation styles.
- `public/data/home-about.json` — biography, education, research, skills, and contact content.
- `public/data/home-work.json` — seven project summaries, roles, status, evidence, and stacks.
- `public/favicon.svg`, `public/social-card.svg`, `public/social-card.png` — brand and social assets.
- `public/wang-zexian-resume.pdf`, `scripts/generate-resume.py` — final résumé and reproducible generator.
- `index.html` — favicon, SEO/social metadata, canonical URL, and Person JSON-LD.
