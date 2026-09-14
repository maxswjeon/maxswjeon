# Framework decision for `swjeon.kr`

**Decision:** use **Astro 7.3.2** with static output for the first implementation.

**Status:** confirmed by the user on 2026-09-13 ("Go with Astro"). The existing Astro implementation is the selected production foundation for S3 and CloudFront.

**Validated:** 2026-09-13 UTC. Versions, engine constraints, peer dependencies, licenses, npm download counts, and repository activity were checked against the npm registry and GitHub APIs on this date. The exact read-only checks were `npm view <package> version engines peerDependencies license` and `gh api repos/<owner>/<repo>`; the linked registry and API responses below are the reproducible evidence. This decision applies to the static personal home and Work pages described in the [implementation handoff](./IMPLEMENTATION-HANDOFF.md); it does not propose migrating the existing Jekyll site at `swjeon.dev`.

## Why Astro

Astro's default build mode prerenders pages as a static site and writes the deployable result to `dist/`, which maps directly to an S3 artifact synchronized behind CloudFront. No server adapter is required for this scope. Astro's build-time content collections also validate structured Work entries and provide generated TypeScript types, which supports the handoff's requirement to publish only explicitly approved content. [Astro deployment documentation](https://docs.astro.build/en/guides/deploy/) · [Astro content collections](https://docs.astro.build/en/guides/content-collections/)

Astro also keeps page metadata in ordinary rendered HTML and has an official sitemap integration that discovers statically generated routes. SEO quality still depends on implementation: each public page needs a unique Korean title and description, one canonical URL, Open Graph and social metadata, structured data where appropriate, correct `lang`, crawlable internal links, `robots.txt`, and a sitemap. The framework does not replace those checks. [Astro sitemap documentation](https://docs.astro.build/en/guides/integrations-guide/sitemap/) · [Google Search Essentials](https://developers.google.com/search/docs/essentials)

Analytics and advertising tags do not require a client framework. Google Tag Manager, Google Analytics, Microsoft Clarity, Naver, Kakao, and later tracking vendors can be loaded as controlled scripts from a shared Astro layout while the page content remains pre-rendered. Tracking consent, identifiers, environment configuration, and avoiding duplicate page-view events remain application responsibilities. [Astro client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/)

For private S3 origins behind CloudFront, clean URLs such as `/about/` need a viewer-request rewrite to `/about/index.html` (or an equivalent explicit object-key policy). CloudFront's default root object applies to the distribution root and does not automatically return nested `index.html` files for subdirectory requests. This is a hosting concern shared by all four generators and should be verified with direct URL requests after deployment. [AWS CloudFront default root object behavior](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)

## Candidate comparison

| Candidate | Latest stable | npm downloads/week | Repository activity | License | Fit for this site |
| --- | ---: | ---: | --- | --- | --- |
| **Astro** | [7.3.2](https://www.npmjs.com/package/astro) | 3,296,591 | [Pushed 2026-09-12; 62,505 stars](https://api.github.com/repos/withastro/astro) | MIT ([npm metadata](https://registry.npmjs.org/astro/latest)) | **Best fit.** Static output is the default, content collections validate public project data, and the official sitemap integration covers generated routes. |
| Next.js static export | [16.3.4](https://www.npmjs.com/package/next) | 29,679,536 | [Pushed 2026-09-13; 142,265 stars](https://api.github.com/repos/vercel/next.js) | MIT ([npm](https://www.npmjs.com/package/next)) | Strong typed metadata and sitemap conventions, but `output: 'export'` excludes redirects, headers, ISR, default image optimization, server actions, and other runtime features. This site would carry a full-stack React framework while deliberately excluding much of its differentiating API. [Static export limits](https://nextjs.org/docs/app/guides/static-exports) · [metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) |
| Nuxt prerender | [4.5.2](https://www.npmjs.com/package/nuxt) | 1,046,183 | [Pushed 2026-09-12; 60,847 stars](https://api.github.com/repos/nuxt/nuxt) | MIT ([npm](https://www.npmjs.com/package/nuxt)) | Viable when Vue is a project constraint. `nuxt generate` prerenders for static hosting and Nuxt has good `useSeoMeta` support, but the handoff does not need its server, data-fetching, or full-stack conventions. [Static hosting](https://nuxt.com/docs/4.x/getting-started/deployment#static-hosting) · [SEO metadata](https://nuxt.com/docs/4.x/getting-started/seo-meta) |
| Eleventy | [3.1.6](https://www.npmjs.com/package/%4011ty/eleventy) | 134,953 | [Pushed 2026-09-10; 19,908 stars](https://api.github.com/repos/11ty/eleventy) | MIT ([npm](https://www.npmjs.com/package/%4011ty/eleventy)) | The leanest option and zero client JavaScript by default, with full control over emitted HTML. It needs more project-owned conventions for typed content, reusable UI, SEO metadata, images, and validation. The project is also in an active Eleventy-to-Build-Awesome naming transition, while the compatible `@11ty/eleventy` package remains supported. [Official Eleventy site](https://www.11ty.dev/) · [current repository redirect](https://github.com/11ty/eleventy) |

All candidates are actively maintained: their upstream repositories were pushed within three days of validation, and their current npm packages were released recently. None triggers the 12-month maintenance warning. Download counts are registry snapshots and will change; they establish that none of the candidates is obscure. The four framework packages are MIT-licensed and compatible with a public or proprietary personal website.

Astro wins because its default operating mode is the deployment target, its content model directly supports the handoff's publication boundary, and it leaves less unused framework surface than Next or Nuxt. Eleventy is the close second on output simplicity, but Astro supplies stronger typed content and component conventions without requiring a browser runtime for static components.

## Security assessment

Static S3 deployment removes the production Node server and therefore makes server-only framework vulnerabilities unreachable in the deployed site. It does not remove build-time dependency or script-supply-chain risk, so the repository should commit the lockfile, run an audit in CI, pin GitHub Actions to immutable versions where practical, and review framework security advisories during upgrades.

Astro has published advisories, including a 2026 XSS fixed in `7.0.4`; the selected `7.3.2` is beyond that patched version. A 2025 open-redirect advisory explicitly did not affect static sites. [Astro XSS advisory](https://github.com/withastro/astro/security/advisories/GHSA-7pw4-f3q4-r2p2) · [Astro static-site exclusion](https://github.com/withastro/astro/security/advisories/GHSA-cq8c-xv66-36gw)

Next.js has a larger recent advisory history. Its August 2026 AVIF image-optimization RCE was fixed in `16.3.3`, so `16.3.4` is patched; static export also cannot use the default server image optimizer. [Next.js AVIF advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) · [static export image limitation](https://nextjs.org/docs/app/guides/static-exports#image-optimization)

Nuxt published several 2026 server and development advisories. The server-island RCE was fixed in `4.5.1` and its advisory states that static deployments are largely unreachable; `4.5.2` is beyond the patch. Its DevTools RCE was fixed in `@nuxt/devtools` 3.3.1 and reinforces the need to refresh the lockfile and avoid exposing a development server to an untrusted network. [Nuxt server-island advisory](https://github.com/nuxt/nuxt/security/advisories/GHSA-9473-5f9j-94wq) · [Nuxt DevTools advisory](https://github.com/nuxt/nuxt/security/advisories/GHSA-279x-mwfv-vcqv)

Eleventy's upstream security page reported no published advisories at validation time. This is not evidence that vulnerabilities cannot exist, so the same lockfile and audit controls still apply. [Eleventy security policy](https://github.com/11ty/eleventy/security)

## Validated implementation dependencies

Use exact versions in the initial lockfile. The `latest` tag was checked for every requested package, but compatibility takes precedence where the latest tags conflict.

| Package | Latest stable on 2026-09-13 | Selected | License | Decision |
| --- | ---: | ---: | --- | --- |
| [`astro`](https://www.npmjs.com/package/astro) | 7.3.2 | **7.3.2** | MIT | Framework. Requires Node `>=22.12.0`. [Registry metadata](https://registry.npmjs.org/astro/latest) |
| [`@astrojs/check`](https://www.npmjs.com/package/%40astrojs/check) | 0.9.10 | **0.9.10** | MIT | Official `astro check` diagnostics package. It accepts TypeScript `^5 || ^6`, not TypeScript 7. [Registry metadata](https://registry.npmjs.org/@astrojs%2fcheck/0.9.10) |
| [`typescript`](https://www.npmjs.com/package/typescript) | 7.0.2 | **6.0.3** | Apache-2.0 | `7.0.2` was validated and rejected because it violates `@astrojs/check@0.9.10`'s peer range. `6.0.3` is the newest stable 6.x release and is also Astro 7.3.2's own development range. [TypeScript latest metadata](https://registry.npmjs.org/typescript/latest) · [TypeScript 6.0.3 metadata](https://registry.npmjs.org/typescript/6.0.3) |
| [`@playwright/test`](https://www.npmjs.com/package/%40playwright/test) | 1.63.0 | **1.63.0** | Apache-2.0 | End-to-end, direct-route, metadata, responsive, and tracking smoke tests. Requires Node `>=20`. [Registry metadata](https://registry.npmjs.org/@playwright%2ftest/1.63.0) |
| [`@axe-core/playwright`](https://www.npmjs.com/package/%40axe-core/playwright) | 4.13.0 | **4.13.0** | MPL-2.0 | Accessibility assertions through Playwright. Keep it development-only; MPL-2.0 is file-level copyleft and does not affect generated site output when the package is not distributed. [Registry metadata](https://registry.npmjs.org/@axe-core%2fplaywright/4.13.0) · [MPL 2.0 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) |
| [`tailwindcss`](https://www.npmjs.com/package/tailwindcss) | 4.3.3 | **4.3.3** | MIT | Build-time utility CSS and theme tokens. Preflight remains intentionally omitted; components use direct utilities while the Tailwind entrypoint keeps only essential element-level base rules. [Official Astro styling guide](https://docs.astro.build/en/guides/styling/#tailwind) |
| [`@tailwindcss/vite`](https://www.npmjs.com/package/%40tailwindcss%2fvite) | 4.3.3 | **4.3.3** | MIT | Tailwind CSS 4's first-party Vite plugin, integrated through Astro's existing Vite configuration. [Official Tailwind Astro guide](https://tailwindcss.com/docs/installation/framework-guides/astro) |
| [`@astrojs/sitemap`](https://www.npmjs.com/package/%40astrojs/sitemap) | 3.7.4 | Not installed | MIT | Evaluated; this implementation generates `sitemap.xml` explicitly from the public project data and fixed routes, with build tests for coverage. [Official integration docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) |

Use Node **24.11.0 or newer within the Node 24 LTS release line** for local development and GitHub Actions. It satisfies Astro, Playwright, and the stricter Nuxt comparison constraint, avoiding different CI runtimes during evaluation. Astro requires Node `>=22.12.0`; Next requires `>=20.9.0`; Nuxt accepts `^22.19.0`, `^24.11.0`, or `>=26`; Eleventy requires `>=18`, as validated from each package's npm metadata. [Node.js release status](https://nodejs.org/en/about/previous-releases) · [Astro metadata](https://registry.npmjs.org/astro/latest) · [Next metadata](https://registry.npmjs.org/next/latest) · [Nuxt metadata](https://registry.npmjs.org/nuxt/latest) · [Eleventy metadata](https://registry.npmjs.org/@11ty%2feleventy/latest)

Astro 7.3.2 was published less than seven days before this validation, so a repository-wide minimum-release-age policy may refuse it. The user explicitly requested current versions; use a one-command scoped override to create the lockfile, retain exact resolved integrity data, and let the normal age policy protect later unreviewed additions.

## Migration and operating boundary

There is no application-code migration because the handoff states that the new site has not yet been implemented. Build new public pages in Astro and link to the existing Jekyll `swjeon.dev`; do not migrate that blog as part of this decision.

Keep the initial Astro site fully static. Any future requirement for authenticated previews, request-time personalization, server actions, or runtime content fetching changes the hosting and security model and requires a fresh framework/output review before adding an adapter or Lambda origin.

## Implementation outcome

The application uses explicit typed public data in `src/content/public.ts`, rather than content collections or document globs. The sitemap endpoint uses that same allowlist. Seven selected packages in `package.json` are installed directly; no sitemap integration is needed. Tailwind CSS is build-only and adds no browser runtime. Installation completed with the scoped package-manager override, and the dependency graph passed the configured supply-chain policy. Node 24.19.0 was used locally.

## Package manager

The user selected pnpm. Registry `latest` was checked on 2026-09-13: **pnpm 12.4.1** is pinned in `package.json`. The existing npm lockfile was imported with `pnpm import` and replaced by `pnpm-lock.yaml`; direct package versions remain unchanged. Frozen installation passes with only esbuild’s install script permitted via `allowBuilds` in `pnpm-workspace.yaml`. See [pnpm import](https://pnpm.io/cli/import), [build approvals](https://pnpm.io/cli/approve-builds), and [registry version metadata](https://registry.npmjs.org/pnpm/latest).
