# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-09-18
- Primary product surfaces: localized `swjeon.kr/ko/` and `swjeon.kr/en/` homes, About, Work, project detail, archive, and Privacy routes under both locale prefixes, `/404.html`, and the external `swjeon.dev` writing site.
- Evidence reviewed: `.omx/context/cool-technical-redesign-20260913T080834Z.md`, `.omx/artifacts/visual-ralph/moodboard/reference.md`, `docs/IMPLEMENTATION-HANDOFF.md`, `docs/projects-and-experience.md`, `docs/2021.pdf`, `docs/2022.pdf`, the live and legacy `swjeon.kr` portfolio, the user-supplied profile image, verified public project repositories, and the existing route, layout, content, tracking, and style files described by those sources.

## Brand

- Personality: personal, calm, exact, and generous with knowledge; reads like an annotated CV rather than a studio portfolio.
- Trust signals: plain statements of scope, explicit project status, accurate employment relationships, visible contribution caveats, and links only to verified public destinations.
- Avoid: green in any role, beige, cream, sepia, yellow-cast surfaces, large red fields or bands (red is an accent only), serif display faces, monospace labels, all-caps eyebrows, portfolio-cover theatrics, dashboard motifs, dense card grids, skill meters, gamified counters, invented metrics or imagery, excessive effects, and imitation of a reference site's branded assets.

## Product goals

- Goals: make Sangwan Jeon's identity and purpose legible on the first screen; connect that purpose to credible project evidence; make About, Work, Writing, and contact routes easy to find; present complete Korean and English content with a distinctive typographic system; support strong search and link previews.
- Non-goals: a résumé database, technology catalogue, replacement for the existing writing site, claim that every project was solo work or remains operational, message-delivery backend, or live server-monitoring product.
- Success signals: the purpose statement is the strongest visual element; visitors can reach key content in one interaction; project state and contribution caveats remain visible; all routes remain usable without JavaScript; the visual system feels cool-neutral rather than warm or yellow.

## Personas and jobs

- Primary personas: collaborators, hiring or project partners, peers following shared technical work, and people arriving from search or a shared project link.
- User jobs: understand who Sangwan is, see how he approaches engineering, inspect credible examples, read his writing, and contact him through the currently available route.
- Key contexts of use: a quick mobile introduction, a desktop review of project experience, direct entry to a project detail page, and search-engine or social-preview discovery.

## Information architecture

- Primary navigation: a persistent identity column (avatar, name, role line, navigation, contact) links to 소개/About, 작업/Work, and 글/Writing (external), plus a single link to the other locale that preserves the current page. Visible breadcrumbs are omitted because the compact hierarchy and header provide sufficient wayfinding; BreadcrumbList structured data remains for search semantics.
- Core routes/screens: `/ko/` and `/en/` route trees for Home, About, Work, `/work/[slug]/`, `/work/archive/`, and Privacy; `/` and former unprefixed routes select a supported locale from browser preferences in local preview and `Accept-Language` at the CloudFront edge; `/404.html` remains shared.
- Content hierarchy: person and purpose first; approach second; a dated experience summary third; selected evidence fourth; employment and product experience as equal first-level entries within Experience; then clearly separated client, personal, school, and club/community projects within Projects. Service work and experience highlights sit as an indented list beneath their organization. Contact stays visible in the identity column on wide screens and closes the reading path in the footer on narrow screens. Future message sending and server status must fit this hierarchy without requiring a redesign, but neither receives placeholder UI in this pass.

## Design principles

- Purpose before proof: introduce the intended change before showing project evidence.
- One axis for facts: every row puts its dates, roles, provenance, or section label in a fixed meta column and its substance in the content column, so the page scans like an annotated CV instead of interchangeable cards.
- Semantic line composition: major display headings define line breaks at complete phrases. Wide layouts keep those phrases intact; narrow layouts balance wrapping inside each phrase and keep short verb groups together so a particle, auxiliary phrase, or predicate never sits alone on the last line. Distinct complete sentences may also occupy separate visual blocks when their roles differ.
- Content over spectacle: borrow structural ideas from the approved references while keeping this site's identity, claims, assets, and interaction patterns original.
- Honest specificity: distinguish employment, collaboration, participation, external work, completion, and development states in visible copy.
- Tradeoffs: the site favors reading quality, factual clarity, accessible static output, and a restrained visual signature over imagery, animation, or application-like chrome.

## Visual language

- Color: cool mist `#f5f6f8` is the only page ground; rows lift to white `#ffffff` on hover and images, status boxes, and dialogs sit on white. Ink `#15171c` carries headings and primary text, soft gray `#5b616c` secondary text and meta, rule `#dde0e5` hairlines. Signal red `#c4282b` is the single accent: links and calls to action, the active navigation marker, and the email address. Red tint `#f8e7e7` with deep red `#8f1d20` text forms the project tags. Never use red as a large field or band, and never use green.
- Typography: `Pretendard Variable` is the only family, for Korean, Latin, display, body, and meta. Hierarchy comes from size and weight: extra-bold (800) page headings with tight tracking, bold (700) section and row titles, regular body. Dates use tabular figures. Body text is at least 16px with 1.85 leading, meta at least 13px, section labels in the meta column 18px.
- Spacing/layout rhythm: from 860px the page is two columns, a sticky identity column (14–19rem) and a content column. The page heading aligns with the name in the identity column. Content rows use a 9.5rem meta column plus a content column; descriptions inside rows span the content column, while page introductions keep a bounded measure. Sections are separated by generous space rather than bands; hairline rules only separate rows that belong to one list. Below 860px the identity column collapses into a compact header with a horizontal navigation row, and the meta column stacks above its content.
- Semantic Korean headings keep each phrase on one line from 1280px; below that they balance-wrap inside each phrase. English headings always balance-wrap.
- Shape/radius/elevation: 12px radius for hover-lifted rows, images, status boxes, and dialogs; full radius for the avatar and tags. No drop-shadow hierarchy apart from the consent banner, and no glassmorphism.
- Motion: only color, background, and navigation-marker width feedback, 150ms. Do not use scroll hijacking, parallax, continuous loops, cursor-following motion, magnetic interactions, or entrance sequences that hide content. Remove nonessential motion under `prefers-reduced-motion`.
- Imagery/iconography: the illustrated square profile image is the site mark, shown round in the identity column and the social image. Verified project-owned or previously published screenshots appear beside their experience or project content on white with a hairline border, at their natural aspect ratio; media regions are omitted when no public or authorized visual exists. External links identify themselves with `↗`; internal links carry no arrow.

## Components

- Existing components to reuse: the shared base layout, consent-aware `Tracking.astro` integration, route-native content structure, and existing content records.
- Shared components: `src/components/ui/Entry.astro` (meta column plus content row, optionally a whole-row link that lifts to white), `PageHead.astro` (page heading with semantic lines and an introduction slot), `SectionTitle.astro` (section heading whose semantic lines join on wide screens), and `Tags.astro` (red-tint project tags from the project eyebrow).
- Variants and states: external links identify themselves with `↗`; current navigation uses `aria-current` with a red marker; status is written as text in a white box rather than encoded by color alone; project rows carry tags without becoming dashboard cards.
- Token/component ownership: `src/styles/tailwind.css` contains only Tailwind theme tokens and essential element-level base rules. Component, responsive, state, and print styling is expressed directly with Tailwind utilities in Astro markup. Korean and English public facts live in `src/content/public.ts` and `src/content/public.en.ts`; shared document structure remains in `src/layouts/BaseLayout.astro`.

## Accessibility

- Target standard: WCAG 2.2 AA.
- Keyboard/focus behavior: preserve the browser's native cursor everywhere; do not implement a custom cursor, follower, pointer trail, or cursor replacement. All interactive elements remain native links or buttons with a high-contrast visible focus ring, and a skip link reaches the main content.
- Contrast/readability: body, secondary, accent, and focus colors must meet readable contrast on both the mist ground and white surfaces; large type wraps naturally without fixed heights.
- Screen-reader semantics: one page-level `h1`, ordered headings, landmarks, descriptive link text, and JSON-LD that matches visible content. BreadcrumbList data may remain in metadata without duplicating a visual breadcrumb.
- Reduced motion and sensory considerations: disable nonessential transitions for reduced motion; meaning never depends on hover, color, animation, or pointer precision alone.

## Responsive behavior

- Supported breakpoints/devices: fluid from 360px through wide desktop; the two-column identity layout starts at 860px (`split:`), and Korean headings lock their phrase lines from 1280px (`xl:`).
- Layout adaptations: the sticky identity column becomes a compact header with a wrapping navigation row; the contact block moves to the footer; meta columns stack above their content; heading type scales with `clamp()`; metadata reflows without horizontal scrolling.
- Touch/hover differences: links and controls keep generous touch targets and visible resting affordances; hover feedback is supplementary and motion remains minimal.

## Interaction states

- Loading: static HTML contains all primary content, so no page-level loading or entrance-gated state is needed.
- Empty: sections with no verified public content are omitted rather than filled with decorative placeholders.
- Error: the 404 page uses the same identity-column layout, explains the missing route, and links to Home and Work.
- Success: no submission workflow exists in this pass; the current contact route stays simple. A future message-sending success state is deferred until its delivery provider and requirements are specified.
- Disabled: required preference storage is fixed; tracking categories without configured providers are hidden and disabled.
- Offline/slow network: core content and navigation remain available from static HTML; font loading and analytics must not block reading. Live monitoring, polling, incident history, and offline monitoring states are deferred.

## Content voice

- Tone: direct, calm, and concrete in both Korean and English; established project and product names remain unchanged across locales.
- This is a personal site. Use straightforward navigation labels (“소개”, “작업”, “글” / “About”, “Work”, “Writing”) and contact through the visible email address. Avoid product-discovery prompts such as “Explore the approach” and company-style invitations to build better ways of working together.
- Terminology: the public identity is “Engineer”; Korean experience headings use bilingual company labels such as “엔진스튜디오 (NGINE STUDIOS) · 넥슨컴퍼니”, “플라네타리움 (나인코퍼레이션)”, and “프로메디우스 (Promedius Inc.)” so the localized name and official brand remain recognizable. Collaboration is “NEXON 플랫폼본부(구 인텔리전스랩스)”.
- Microcopy rules: lead with the problem and contribution; avoid personal-name self-reference and first-person English sentences; use short declarative headings without terminal periods; use `::` as the document-title separator and avoid em dashes; state limitations beside the relevant claim; do not invent current status, metrics, dates, links, or personal details. External evidence links use the visible page title verified from the destination rather than generic labels such as “관련 보도” or “공개 자료”.

## Implementation constraints

- Framework/styling system: Astro 7 static output with Tailwind CSS 4 through its first-party Vite plugin. Preflight remains disabled; Astro components own their styling through Tailwind utilities rather than semantic component selectors or scoped style blocks.
- Design-token constraints: express the palette (`mist`, `ink`, `soft`, `rule`, `signal`, `signal-deep`, `signal-tint`, `focus`), Pretendard, the `meta`/`label`/`body` text sizes, leading, `rail`/`section` spacing, and the `split` breakpoint as Tailwind theme variables; do not reintroduce a monospace face, warm-paper or green tokens, or a second theme system.
- Performance constraints: static HTML, the approved Pretendard loading strategy with robust fallbacks, locally optimized responsive images with fixed dimensions, lazy-loaded below-fold project media, minimal inline structured data, and consent-aware tracking that never blocks content. Synthetic performance checks cover FCP, LCP, CLS, TTFB, DOM readiness, load time, and transferred bytes on production output.
- Compatibility constraints: preserve factual caveats, SEO metadata, tracking controls, no-JavaScript rendering, and S3/CloudFront-friendly trailing slashes. Both locales use prefixed canonical URLs and reciprocal `hreflang`; former unprefixed and legacy routes temporarily redirect to the visitor's supported preferred locale.
- Test/screenshot expectations: Astro check and build succeed; existing automated accessibility, single-`h1`, no-overflow, no-JavaScript, route, tracking-dialog, alias, and 404 assertions remain green; capture and review desktop at 1440px and mobile at 390px/360px against the approved “Profile” direction (round two, option E).

## Open questions

- [ ] Choose a message delivery provider, abuse-prevention strategy, privacy copy, and success/error behavior before adding message sending; explicitly deferred from this redesign.
- [ ] Choose a monitoring data source, polling/caching strategy, incident model, and accessibility wording before adding server monitoring; explicitly deferred from this redesign.
- [ ] Supply production analytics identifiers and any additional consent requirements; do not embed invented IDs.
