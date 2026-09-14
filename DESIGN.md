# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-09-13
- Primary product surfaces: localized `swjeon.kr/ko/` and `swjeon.kr/en/` homes, About, Work, project detail, archive, and Privacy routes under both locale prefixes, `/404.html`, and the external `swjeon.dev` writing site.
- Evidence reviewed: `.omx/context/cool-technical-redesign-20260913T080834Z.md`, `.omx/artifacts/visual-ralph/moodboard/reference.md`, `docs/IMPLEMENTATION-HANDOFF.md`, `docs/projects-and-experience.md`, `docs/2021.pdf`, `docs/2022.pdf`, the live and legacy `swjeon.kr` portfolio, the user-supplied profile image, verified public project repositories, and the existing route, layout, content, tracking, and style files described by those sources.

## Brand

- Personality: cool, technical, editorial, calm, exact, and generous with knowledge.
- Trust signals: plain statements of scope, explicit project status, accurate employment relationships, visible contribution caveats, and links only to verified public destinations.
- Avoid: beige, cream, sepia, yellow-cast surfaces, portfolio-cover theatrics, dashboard motifs, dense card grids, neon overload, skill meters, gamified counters, invented metrics or imagery, excessive effects, and imitation of a reference site's branded assets.

## Product goals

- Goals: make Sangwan Jeon's identity and purpose legible on the first screen; connect that purpose to credible project evidence; make About, Work, Writing, and contact routes easy to find; present complete Korean and English content with a distinctive typographic system; support strong search and link previews.
- Non-goals: a résumé database, technology catalogue, replacement for the existing writing site, claim that every project was solo work or remains operational, message-delivery backend, or live server-monitoring product.
- Success signals: the purpose statement is the strongest visual element; visitors can reach key content in one interaction; project state and contribution caveats remain visible; all routes remain usable without JavaScript; the visual system feels cool-neutral rather than warm or yellow.

## Personas and jobs

- Primary personas: collaborators, hiring or project partners, peers following shared technical work, and people arriving from search or a shared project link.
- User jobs: understand who Sangwan is, see how he approaches engineering, inspect credible examples, read his writing, and contact him through the currently available route.
- Key contexts of use: a quick mobile introduction, a desktop review of project experience, direct entry to a project detail page, and search-engine or social-preview discovery.

## Information architecture

- Primary navigation: the persistent header links to About, Writing (external), and Work, plus a compact native language menu that preserves the current page when switching between Korean and English. Visible breadcrumbs are omitted because the compact hierarchy and header provide sufficient wayfinding; BreadcrumbList structured data remains for search semantics.
- Core routes/screens: `/ko/` and `/en/` route trees for Home, About, Work, `/work/[slug]/`, `/work/archive/`, and Privacy; `/` and former unprefixed routes select a supported locale from browser preferences in local preview and `Accept-Language` at the CloudFront edge; `/404.html` remains shared.
- Content hierarchy: person and purpose first; approach second; selected evidence third; employment and product experience as equal first-level entries within Experience; then clearly separated client, personal, school, and club/community projects within Projects. Service work and experience highlights use the same numbered evidence-row pattern beneath their organization. A simple contact call to action sits at the end of the reading path. Future message sending and server status must fit this hierarchy without requiring a redesign, but neither receives placeholder UI in this pass.

## Design principles

- Purpose before proof: introduce the intended change before showing project evidence.
- Technical editorial continuity: use strong Korean typography, compact monospace metadata, open sections, thin dividers, and deliberate contrast instead of interchangeable cards.
- Content over spectacle: borrow structural ideas from the approved references while keeping this site's identity, claims, assets, and interaction patterns original.
- Honest specificity: distinguish employment, collaboration, participation, external work, completion, and development states in visible copy.
- Tradeoffs: the site favors reading quality, factual clarity, accessible static output, and a restrained visual signature over imagery, animation, or application-like chrome.

## Visual language

- Color: cool near-black `#090b0f` is the principal canvas; selected reading-heavy surfaces use a pure cool off-white `#f4f5f2`. Primary text is a neutral off-white with no beige or yellow cast, secondary text is cool gray, and restrained mint-cyan `#53e0c2` is the interactive accent. A distinct semantic green is reserved for a future real server-health state.
- Typography: `Pretendard Variable` is the primary family for Korean, Latin, body, and display text. `D2Coding` is limited to indices, metadata, timestamps, and compact status labels, with Pretendard as its explicit fallback so Korean never falls through to a system legacy font. Load only the regular D2Coding webfont face; the second 1.6MB face does not justify its transfer cost for compact metadata. Display type is decisive without overwhelming the page; body text remains at least 16px and metadata at least 13px.
- Spacing/layout rhythm: fluid page gutters, generous vertical sections, strong first-screen composition, bounded introductory prose measures, thin full-width rules, and an editorial grid that collapses cleanly to one column. Descriptions inside list rows and experience/project containers span the available content column; project-group headings are not artificially width-constrained. Korean display headings use open leading around 1.12-1.22 and prose around 1.85-1.9 so wrapped lines do not feel compressed.
- Shape/radius/elevation: square technical geometry, small radii only where state grouping benefits, and no drop-shadow hierarchy or glassmorphism.
- Motion: only short color, underline, and directional-arrow feedback, targeted below 160ms. Do not use scroll hijacking, parallax, continuous loops, cursor-following motion, magnetic interactions, or entrance sequences that hide content. Remove nonessential motion under `prefers-reduced-motion`.
- Imagery/iconography: keep the site typography- and content-led while using one verified square profile image in the shared header and verified project-owned or previously published portfolio screenshots alongside their relevant experience/detail content. Store images locally, preserve their natural aspect ratio, and omit media regions when no public or authorized visual exists. Captions describe the image itself and never distinguish a “previous portfolio” from the current one. Use simple typographic indices and directional marks; do not import reference-site logos, unverified imagery, 3D assets, or branded interaction motifs.

## Components

- Existing components to reuse: the shared base layout, consent-aware `Tracking.astro` integration, route-native content structure, and existing content records.
- New/changed components: refresh shared header, footer, section, metadata, experience evidence, project evidence, contact call-to-action, tracking dialog, and error-page treatments only where reuse is justified by repetition.
- Variants and states: external links identify themselves with `↗`; current navigation uses `aria-current`; status is written as text rather than encoded by color alone; project rows support compact metadata without becoming dashboard cards.
- Token/component ownership: `src/styles/tailwind.css` contains only Tailwind theme tokens and essential element-level base rules. Component, responsive, state, and print styling is expressed directly with Tailwind utilities in Astro markup. Korean and English public facts live in `src/content/public.ts` and `src/content/public.en.ts`; shared document structure remains in `src/layouts/BaseLayout.astro`.

## Accessibility

- Target standard: WCAG 2.2 AA.
- Keyboard/focus behavior: preserve the browser's native cursor everywhere; do not implement a custom cursor, follower, pointer trail, or cursor replacement. All interactive elements remain native links or buttons with a high-contrast visible focus ring, and a skip link reaches the main content.
- Contrast/readability: body, secondary, accent, and focus colors must meet readable contrast on both near-black and off-white surfaces; large type wraps naturally without fixed heights.
- Screen-reader semantics: one page-level `h1`, ordered headings, landmarks, descriptive link text, and JSON-LD that matches visible content. BreadcrumbList data may remain in metadata without duplicating a visual breadcrumb.
- Reduced motion and sensory considerations: disable nonessential transitions for reduced motion; meaning never depends on hover, color, animation, or pointer precision alone.

## Responsive behavior

- Supported breakpoints/devices: fluid from 360px through wide desktop; retain a structural adaptation around the existing tablet breakpoint; bound line length on wide displays.
- Layout adaptations: compact navigation may wrap; persistent wide-screen identity and split editorial rows become a clear single-column reading order; hero type scales with `clamp()`; metadata reflows without horizontal scrolling.
- Touch/hover differences: links and controls keep generous touch targets and visible resting affordances; hover feedback is supplementary and motion remains minimal.

## Interaction states

- Loading: static HTML contains all primary content, so no page-level loading or entrance-gated state is needed.
- Empty: sections with no verified public content are omitted rather than filled with decorative placeholders.
- Error: the 404 page uses the same cool technical editorial system, explains the missing route, and links to Home and Work.
- Success: no submission workflow exists in this pass; the current contact route stays simple. A future message-sending success state is deferred until its delivery provider and requirements are specified.
- Disabled: required preference storage is fixed; tracking categories without configured providers are hidden and disabled.
- Offline/slow network: core content and navigation remain available from static HTML; font loading and analytics must not block reading. Live monitoring, polling, incident history, and offline monitoring states are deferred.

## Content voice

- Tone: direct, calm, and concrete in both Korean and English; established project and product names remain unchanged across locales.
- Terminology: the public identity is “Engineer”; Korean experience headings use bilingual company labels such as “엔진스튜디오 (NGINE STUDIOS) · 넥슨컴퍼니”, “플라네타리움 (나인코퍼레이션)”, and “프로메디우스 (Promedius Inc.)” so the localized name and official brand remain recognizable. Collaboration is “NEXON 플랫폼본부(구 인텔리전스랩스)”.
- Microcopy rules: lead with the problem and contribution; avoid personal-name self-reference and first-person English sentences; use short declarative headings; use `::` as the document-title separator and avoid em dashes; state limitations beside the relevant claim; do not invent current status, metrics, dates, links, or personal details. External evidence links use the visible page title verified from the destination rather than generic labels such as “관련 보도” or “공개 자료”.

## Implementation constraints

- Framework/styling system: Astro 7 static output with Tailwind CSS 4 through its first-party Vite plugin. Preflight remains disabled; Astro components own their styling through Tailwind utilities rather than semantic component selectors or scoped style blocks.
- Design-token constraints: express the cool-neutral palette, Pretendard/D2Coding typography, and leading scale through Tailwind theme variables and the minimal base custom properties consumed by arbitrary utilities; do not retain or reintroduce warm-paper tokens or add a second theme system.
- Performance constraints: static HTML, the approved Pretendard loading strategy with robust fallbacks, locally optimized responsive images with fixed dimensions, lazy-loaded below-fold project media, minimal inline structured data, and consent-aware tracking that never blocks content. Synthetic performance checks cover FCP, LCP, CLS, TTFB, DOM readiness, load time, and transferred bytes on production output.
- Compatibility constraints: preserve factual caveats, SEO metadata, tracking controls, no-JavaScript rendering, and S3/CloudFront-friendly trailing slashes. Both locales use prefixed canonical URLs and reciprocal `hreflang`; former unprefixed and legacy routes temporarily redirect to the visitor's supported preferred locale.
- Test/screenshot expectations: Astro check and build succeed; existing automated accessibility, single-`h1`, no-overflow, no-JavaScript, route, tracking-dialog, alias, and 404 assertions remain green; capture and review desktop at 1440px and mobile at 390px/360px against the approved multi-reference direction.

## Open questions

- [ ] Choose a message delivery provider, abuse-prevention strategy, privacy copy, and success/error behavior before adding message sending; explicitly deferred from this redesign.
- [ ] Choose a monitoring data source, polling/caching strategy, incident model, and accessibility wording before adding server monitoring; explicitly deferred from this redesign.
- [ ] Supply production analytics identifiers and any additional consent requirements; do not embed invented IDs.
