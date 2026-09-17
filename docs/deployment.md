# AWS static deployment

The site builds as static Astro output in `dist/` and is deployed by the
`Deploy production` GitHub Actions workflow on every push to `main`. The same
workflow can also be started manually. The workflow does not contain AWS keys:
its deployment job obtains short-lived credentials through GitHub OIDC, while
the build job has no AWS permission.

The production canonical origin is `https://swjeon.kr`. `SITE_URL` is fixed to
that value in CI and deployment so canonical URLs, Open Graph URLs, and the
sitemap cannot accidentally use a preview hostname.

## GitHub configuration

Create a GitHub environment named `production`. Add protection rules or
required reviewers if releases should require an explicit approval.

Configure these variables on the `production` environment. Only the deployment
job can read them:

| Variable | Required | Purpose |
| --- | --- | --- |
| `AWS_ROLE_ARN` | yes | IAM role assumed by GitHub Actions through OIDC |
| `AWS_REGION` | yes | Region used by the AWS CLI and STS action |
| `S3_BUCKET` | yes | Exclusive site bucket/prefix, such as `bucket-name/site`; retired files in this prefix are deleted |
| `CLOUDFRONT_DISTRIBUTION_ID` | yes | Distribution invalidated after the upload |

Configure these as repository variables so the credential-free build job can
read them without access to the protected production environment:

| Variable | Required | Purpose |
| --- | --- | --- |
| `PUBLIC_GA_MEASUREMENT_ID` | no | Google Analytics 4 measurement ID |
| `PUBLIC_GTM_CONTAINER_ID` | no | Google Tag Manager container ID |
| `PUBLIC_GOOGLE_TAG_GATEWAY_PATH` | no | Same-origin Google Tag Gateway path, enabled after its CloudFront behavior is healthy |
| `PUBLIC_CLARITY_PROJECT_ID` | no | Microsoft Clarity project ID |
| `PUBLIC_NAVER_WCS_ID` | no | Naver WCS account ID |
| `PUBLIC_KAKAO_PIXEL_ID` | no | Kakao Pixel ID |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | no | Google Search Console verification token |
| `PUBLIC_NAVER_SITE_VERIFICATION` | no | Naver Search Advisor verification token |
| `PUBLIC_BING_SITE_VERIFICATION` | no | Bing Webmaster Tools verification token |

The `PUBLIC_*` values are intentionally GitHub variables rather than secrets:
Astro embeds them into browser-delivered JavaScript and HTML. Leave an optional
value unset to disable that integration. Do not put API secrets or server-side
credentials in any `PUBLIC_*` value.

## AWS setup

Create a private S3 bucket and serve it through a CloudFront distribution with
Origin Access Control. Keep S3 Block Public Access enabled. Give the OIDC role
only the deployment permissions it needs:

- `s3:ListBucket` on the deployment bucket;
- `s3:PutObject` on the exclusively owned deployed prefix;
- `cloudfront:DescribeFunction`, `cloudfront:UpdateFunction`, and
  `cloudfront:PublishFunction` on
  `arn:aws:cloudfront::025383730468:function/prd-swjeon-website-router`;
- `cloudfront:CreateInvalidation` on
  `arn:aws:cloudfront::025383730468:distribution/E35RRMPHYCD2X9`.

Keep the existing `prd_swjeon-website@s3+write` and
`prd_swjeon.kr@cloudfront+invalidate` policies attached. Add a managed policy
named `prd_swjeon.kr@cloudfront+deploy` with this document:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:DescribeFunction",
        "cloudfront:UpdateFunction",
        "cloudfront:PublishFunction"
      ],
      "Resource": "arn:aws:cloudfront::025383730468:function/prd-swjeon-website-router"
    }
  ]
}
```

The role intentionally has no `cloudfront:CreateFunction`,
`cloudfront:UpdateDistribution`, or `s3:DeleteObject` permission. Provision and
associate the function before the first CI release. A missing function fails
the deployment; its distribution binding is an infrastructure precondition
managed outside CI and is not read or changed by the workflow.

The role trust policy should accept the GitHub OIDC provider
`token.actions.githubusercontent.com`, require audience `sts.amazonaws.com`,
and restrict `sub` to this repository's `production` environment. Use the
exact subject format GitHub reports for the final repository. A repository on
the legacy claim format uses:

```json
{
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    "token.actions.githubusercontent.com:sub": "repo:OWNER/REPOSITORY:environment:production"
  }
}
```

Replace `OWNER/REPOSITORY` with the final GitHub repository name. Repositories
using GitHub's immutable-ID claims add the organization and repository IDs to
this value; copy that exact claim into the condition. Do not use a wildcard
repository or environment condition.

Set the distribution's alternate domain to `swjeon.kr`, attach an ACM
certificate issued in `us-east-1`, redirect HTTP to HTTPS, and set
`index.html` as the default root object. Point the Route 53 alias records at the
distribution only when the reviewed site is ready to replace the current one.

## Extensionless routes and real 404 responses

After Astro builds the site, `scripts/generate-cloudfront-function.mjs` reads
the language redirect pages in `dist/`, infers the supported and default
locales, verifies every localized destination, and injects that route data into
`deployment/cloudfront-viewer-request.template.js`. The generated
`dist/cloudfront-viewer-request.js` travels with the build artifact but is
excluded from the S3 uploads.

CI updates the existing `prd-swjeon-website-router` CloudFront Function using
the `cloudfront-js-2.0` runtime and publishes it. The function must already be
associated with the default behavior's **Viewer request** event. CI neither
creates the function nor reads or changes the distribution configuration. The
`/r8k3p/*` Google Tag Gateway behavior remains unassociated and is not changed
by the workflow.

The function temporarily redirects unprefixed public URLs to `/ko/` or `/en/`
from the request's supported `Accept-Language` preferences, then maps localized
routes such as `/en/about` and `/en/about/` to `/en/about/index.html`; requests
with a filename extension are left unchanged. Because it does not rewrite every
request to the home page, unknown routes still request a missing S3 object and
preserve a real 404.

Configure CloudFront custom error responses for the private S3 origin so 403
and 404 origin misses return `/404.html` with HTTP response code `404`. Do not
map errors to `/index.html` with a 200 response.

## Release behavior

Pushing to `main` starts production deployment automatically. For a manual
release, run **Actions → Deploy production → Run workflow** from `main`. The
workflow checks and builds the source, runs tests, passes `dist/` to an isolated
deployment job, assumes the environment's AWS role, deploys the CloudFront
viewer-request function, and uploads in two phases:

1. Astro's generated redirect pages are converted into the router function;
   the existing function is updated and published without changing its binding.
2. `_astro/` fingerprinted assets receive a one-year immutable cache policy.
3. HTML, sitemap, robots metadata, images, and other files receive a
   revalidation policy.
4. CloudFront is invalidated after both uploads complete.

The build artifact is named from `github.run_id`, which remains stable across
rerun attempts. A failed deploy job can therefore reuse the artifact from the
original successful build. If all jobs are rerun, the build replaces that same
artifact before deployment.

Neither upload uses `--delete`. Existing page and metadata keys are updated in
place, while prior fingerprinted assets and objects at retired paths remain
available. An older document can therefore continue loading the chunks it
references. Clean retired objects only through a separate, deliberate retention
process after the rollback and client cache window is defined. The destination
must still be a bucket or prefix exclusively owned by this site, and S3
versioning should remain enabled for recovery of overwritten objects.

Browser end-to-end tests stay outside these workflows. CI runs the repository's
`pnpm run check`, `pnpm run build`, and `pnpm test` commands; `pnpm test` is the
Node test suite (`node --test tests/*.test.mjs`).

## Action version policy

Third-party actions are pinned to immutable commit SHAs. The comments in the
workflow record their release tags. These pins were checked against the
official repositories on 2026-09-13:

| Action | Release |
| --- | --- |
| [`actions/checkout`](https://github.com/actions/checkout/releases/tag/v7.0.1) | `v7.0.1` |
| [`pnpm/action-setup`](https://github.com/pnpm/action-setup/releases/tag/v6.1.0) | `v6.1.0` |
| [`actions/setup-node`](https://github.com/actions/setup-node/releases/tag/v7.0.0) | `v7.0.0` |
| [`actions/upload-artifact`](https://github.com/actions/upload-artifact/releases/tag/v7.0.1) | `v7.0.1` |
| [`actions/download-artifact`](https://github.com/actions/download-artifact/releases/tag/v8.0.1) | `v8.0.1` |
| [`aws-actions/configure-aws-credentials`](https://github.com/aws-actions/configure-aws-credentials/releases/tag/v6.2.4) | `v6.2.4` |

Dependabot should propose future action updates; review the upstream release
notes and keep the SHA comment paired with the verified tag.

## SEO release checks

Legacy project paths and unprefixed public paths receive language-negotiated HTTP 302 redirects in the CloudFront Function. Keep the legacy alias map aligned with `legacyProjectAliases` in public content. Redirects preserve query parameters, and localized pages remain the canonical URLs.

After deployment, submit `/sitemap.xml` to Google Search Console, Naver Search Advisor, and Bing Webmaster Tools. Verify a nested page returns HTTP 200 and unique rendered metadata, an unknown page returns HTTP 404, and unprefixed or alias routes return a language-aware HTTP 302. Set CloudFront cache policy minimum TTL to 0 so page revalidation headers take effect. Configure an HTTPS response headers policy. CI retains retired objects; review and remove them only through the separate retention process.

Both workflows install the pnpm version pinned in `package.json` before Node’s pnpm cache setup, then use `pnpm install --frozen-lockfile`. `pnpm-workspace.yaml` allows only esbuild’s required dependency install script.
