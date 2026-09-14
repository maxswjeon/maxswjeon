# Implementation verification :: 2026-09-13

Implemented the handoff as a bilingual Astro static website with complete `/ko/` and `/en/` route trees: Home, About, Work, twelve project detail pages, archive, Privacy, and 404. The public identity, NEXON/Nine Corporation/ZIBLE/PROMEDIUS experience wording, project provenance, and development-status limits are preserved in explicit typed content for both languages. Community projects identify and link their organizations, and screenshot captions describe the artifact without separating previous and current portfolio sources. Component and responsive styling uses Tailwind CSS 4 utilities directly in Astro markup; `src/styles/tailwind.css` now contains only theme tokens and essential element-level base rules.

SEO includes rendered page content, unique titles/descriptions, self-canonical URLs, reciprocal Korean/English `hreflang` links, Person/BreadcrumbList JSON-LD, OG/Twitter metadata and a 1200×630 PNG, robots.txt, sitemap.xml, and optional Google/Naver/Bing webmaster verification tokens. The final `dist/` uses `https://swjeon.kr`.

## Evidence

- `pnpm check`: 0 errors, warnings, hints.
- `pnpm build`: 60 static pages across both locale trees, language-aware local redirect shells, 404, and discovery files.
- `pnpm test`: all three Node test files pass. Includes output/link/sitemap checks, publication exclusions, CloudFront routing, and mocked tracking loader/consent/storage behavior.
- `pnpm test:e2e`: 20 browser tests pass. Korean Home/About/Work are tested at 360, 768, and 1440 pixels; English Home/Work are additionally tested at 360 and 1440 pixels. No horizontal overflow or automated WCAG A/AA violations were found in those checks. Visual breadcrumbs are absent while BreadcrumbList metadata remains, Experience uses consistent company and second-level work headings, the Account Recovery image belongs to its matching work item, and active navigation dots are vertically centered. Dialog accessibility and keyboard close/focus return also pass.
- Browser navigation covers JavaScript-disabled core content, locale negotiation, locale switching with route preservation, reciprocal metadata, direct detail routes, and a real 404.
- Actual browser requests are checked for no tracking when unconfigured. Configured vendor loader decisions are verified with a mocked browser environment; delivery into real vendor dashboards has not been tested because account IDs were not supplied.
- Deployment routing has Node coverage. Direct dependency versions and compatibility exceptions are recorded in `framework-decision.md` and pinned in the lockfile.
- Desktop and mobile Korean and English screenshots were visually inspected; repeatable captures are under ignored `test-results/screenshots/`.
- `pnpm test:performance`: all five Korean route samples pass the FCP, LCP, CLS, synthetic INP, TTFB, load, and transfer budgets.

## Operating boundaries

No production deployment, DNS change, analytics account creation, remote repository mutation, or blog migration occurred. AWS role/bucket/distribution variables and real analytics IDs remain unset. The writing site's canonical URL was verified from live HTML as `https://www.swjeon.dev/`; its deployment source was not conclusively identified, so it is linked without modification. The private `maxswjeon/portfolio` repository was confirmed to use `develop` and the previous React/Vite stack.

Public pages live under `/ko/` and `/en/`. The root, old unprefixed routes, and legacy aliases select Korean or English from browser language in local Astro preview and from `Accept-Language` in the supplied CloudFront function. The edge function still requires deployment and a custom error response preserving HTTP 404, as documented in `deployment.md`.

Final review fixes preserve all eight handoff legacy identifiers at the CloudFront edge. They point to localized project detail pages or Experience anchors, and release configuration removes retired HTML while retaining excluded hashed assets. Alias parity and destinations are verified in the Node suite.

The final 20-test Chromium suite passes after the content, hierarchy, media, localization, breadcrumb, width, and redirect updates.

## pnpm migration

The user selected pnpm and gitignore.io. pnpm 12.4.1 is pinned in `package.json`; `pnpm-lock.yaml` replaces the imported npm lockfile. CI, deployment, browser-server commands, and setup instructions use pnpm. Frozen installation, Astro check/build, Node tests, and 16 disposable Git ignore/include checks passed. The generated gitignore.io template is preserved verbatim before project additions, including private-document exclusions and `.env.example` inclusion.
