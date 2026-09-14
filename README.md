# Sangwan Jeon :: personal website

A bilingual Astro site introducing 전상완 / Sangwan Jeon as an Engineer, with complete `/ko/` and `/en/` routes for About, Work, project details, and Privacy, plus links to the existing writing site. The deployment artifact is entirely static and targets private S3 behind CloudFront.

## Run locally

Requires Node 24 (locally verified with 24.19.0) and pnpm 12.4.1. The `packageManager` field pins pnpm; Corepack-enabled installations select that version automatically. Commit `pnpm-lock.yaml` and use frozen installs in CI.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm run dev
```

Open http://localhost:4321. Tracking IDs are optional; empty values disable all remote tracking.

## Validate

```sh
pnpm run check
pnpm run build
pnpm test
pnpm exec playwright install chromium
pnpm run test:e2e
```

The Node tests inspect built HTML, canonical URLs, links, publication boundaries, tracking decisions, and CloudFront routing. Browser tests check navigation, responsive overflow, accessibility, no-JavaScript content and tracking behavior. Screenshots are written to `test-results/screenshots/`.

The `.gitignore` base comes from [gitignore.io](https://www.toptal.com/developers/gitignore/api/node,linux,macos,windows,visualstudiocode), with project-specific Astro, test-output, and private-reference exclusions appended. `pnpm-workspace.yaml` explicitly permits esbuild’s required install script.

## Content and design

Edit Korean public facts in `src/content/public.ts`, English public facts in `src/content/public.en.ts`, and site links in `src/config.ts`. Component styling lives beside its markup as Tailwind utilities; `src/styles/tailwind.css` is limited to theme tokens and essential element-level base rules. [DESIGN.md](./DESIGN.md) records the design contract. The source handoff, internal Markdown, and PDFs are reference material: never copy `docs/` into `public/` or use it as a content glob. The deployment workflow publishes only `dist/`.

`public/og.png` is a text-only social preview. To regenerate it after copy/design changes, run `node scripts/generate-social-image.mjs` after installing Chromium. It is committed as an asset and does not require a browser during production builds.

## Architecture and release

- [Framework comparison and version validation](./docs/framework-decision.md)
- [AWS and GitHub Actions setup](./docs/deployment.md)
- [Tracking configuration and consent](./docs/tracking.md)

`SITE_URL` defaults to `https://swjeon.kr`. Public pages use required locale prefixes. In production, the CloudFront viewer-request function negotiates `/ko/` or `/en/` for unprefixed routes from `Accept-Language`; Astro-generated static redirect shells provide the equivalent browser-language fallback in local preview. Writing links to the verified canonical `https://www.swjeon.dev/`; the existing Jekyll engine and post URLs are retained.

No remote repository mutation, production deployment, or DNS change is part of this local implementation. Review the built output before enabling the supplied GitHub workflows, and keep all internal reference documents excluded.
