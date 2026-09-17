import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(
  new URL('../dist/cloudfront-viewer-request.js', import.meta.url),
  'utf8',
);
const context = vm.createContext({});
vm.runInContext(source, context);

const requestFor = (uri, acceptLanguage, querystring) => ({
  request: {
    uri,
    headers: acceptLanguage ? { 'accept-language': { value: acceptLanguage } } : {},
    querystring: querystring || {},
  },
});
const route = (uri) => context.handler(requestFor(uri)).uri;

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? files(join(directory, entry.name))
    : [join(directory, entry.name)]))).flat();
}

test('maps Astro directory routes to their generated index documents', () => {
  assert.equal(route('/ko'), '/ko/index.html');
  assert.equal(route('/en/about'), '/en/about/index.html');
  assert.equal(route('/ko/about/'), '/ko/about/index.html');
  assert.equal(route('/en/work/example'), '/en/work/example/index.html');
});

test('keeps file requests unchanged', () => {
  assert.equal(route('/robots.txt'), '/robots.txt');
  assert.equal(route('/_astro/app.abc123.js'), '/_astro/app.abc123.js');
});

test('does not rewrite an unknown route to the home page', () => {
  assert.equal(route('/does-not-exist'), '/does-not-exist/index.html');
  assert.notEqual(route('/does-not-exist'), '/index.html');
});


test('legacy project routes redirect to the corresponding localized work page', () => {
  for (const uri of ['/online-judge', '/online-judge/']) {
    const response = context.handler(requestFor(uri));
    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.location.value, '/ko/work/bear-oj/');
  }
  const english = context.handler(requestFor('/online-judge/', 'en-US,en;q=0.9,ko;q=0.4'));
  assert.equal(english.headers.location.value, '/en/work/bear-oj/');
});

test('unprefixed public routes redirect according to the preferred supported language', () => {
  for (const [uri, destination] of [
    ['/', '/ko/'],
    ['/about/', '/ko/about/'],
    ['/privacy', '/ko/privacy/'],
    ['/work/', '/ko/work/'],
    ['/work/blis/', '/ko/work/blis/'],
  ]) {
    const response = context.handler(requestFor(uri));
    assert.equal(response.statusCode, 302, uri);
    assert.equal(response.headers.location.value, destination, uri);
    assert.equal(response.headers.vary.value, 'Accept-Language');
  }

  assert.equal(
    context.handler(requestFor('/about/', 'ko-KR;q=0.6,en-GB;q=0.9')).headers.location.value,
    '/en/about/',
  );
  assert.equal(
    context.handler(requestFor('/about/', 'en ; q=0.9, ko;q=0.4')).headers.location.value,
    '/en/about/',
  );
  assert.equal(
    context.handler({
      request: {
        uri: '/work/',
        headers: {
          'accept-language': {
            value: 'ko;q=0.4',
            multiValue: [{ value: 'ko;q=0.4' }, { value: 'en-US;q=0.9' }],
          },
        },
        querystring: {},
      },
    }).headers.location.value,
    '/en/work/',
  );
  assert.equal(
    context.handler(requestFor('/work/', 'fr-FR,ko;q=0.8,en;q=0.7')).headers.location.value,
    '/ko/work/',
  );
  assert.equal(
    context.handler(requestFor('/work/', 'en-US', { ref: { value: 'portfolio link' } })).headers.location.value,
    '/en/work/?ref=portfolio%20link',
  );
  assert.equal(
    context.handler(requestFor('/9c-account-recovery/', 'en;q=0,ko;q=0.8', { from: { value: 'legacy' } })).headers.location.value,
    '/ko/work/?from=legacy#nine-corporation',
  );
});

test('generated function mirrors every language redirect in the Astro build', async () => {
  const redirects = [];
  for (const file of (await files('dist')).filter((path) => path.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    const destination = html.match(/<meta http-equiv="refresh" content="0;url=([^"]+)"/)?.[1];
    if (!destination) continue;
    const builtPath = relative('dist', file).split(sep).join('/');
    const uri = builtPath === 'index.html' ? '/' : `/${builtPath.replace(/index\.html$/, '')}`;
    redirects.push({ uri, destination });
  }

  assert.ok(redirects.length > 10, 'Astro should produce the public and legacy redirect routes');
  for (const { uri, destination } of redirects) {
    for (const requestUri of uri === '/' ? ['/'] : [uri, uri.replace(/\/$/, '')]) {
      const response = context.handler(requestFor(requestUri));
      assert.equal(response.statusCode, 302, requestUri);
      assert.equal(response.headers.location.value, destination, requestUri);
    }
    const english = context.handler(requestFor(uri, 'en-US'));
    assert.equal(english.headers.location.value, destination.replace(/^\/ko\//, '/en/'), uri);
  }
});

test('deployment removes retired pages while retaining excluded fingerprinted assets', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  const assetStep = workflow.split('- name: Upload immutable assets')[1].split('- name: Upload pages and metadata')[0];
  const pageStep = workflow.split('- name: Upload pages and metadata')[1].split('- name: Invalidate CloudFront')[0];
  assert.doesNotMatch(assetStep, /--delete/);
  assert.match(pageStep, /--exclude '_astro\/\*'/);
  assert.match(pageStep, /--exclude 'cloudfront-viewer-request\.js'/);
  assert.match(pageStep, /--delete/);
});

test('production deployment runs on main pushes and reuses artifacts across partial reruns', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /push:\s+branches:\s+- main/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.equal((workflow.match(/site-\$\{\{ github\.run_id \}\}/g) || []).length, 2);
  assert.doesNotMatch(workflow, /github\.run_attempt/);

  const uploadStep = workflow.split('- name: Upload static site')[1].split('deploy:')[0];
  assert.match(uploadStep, /overwrite: true/);
});

test('production deployment publishes and safely associates the viewer request function', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  const functionStep = workflow
    .split('- name: Deploy CloudFront viewer request function')[1]
    .split('# Keep prior fingerprinted assets')[0];

  assert.equal((workflow.match(/uses: actions\/checkout@/g) || []).length, 1);
  assert.match(functionStep, /prd-swjeon-website-router/);
  assert.match(functionStep, /dist\/cloudfront-viewer-request\.js/);
  assert.match(functionStep, /cloudfront create-function/);
  assert.match(functionStep, /cloudfront update-function/);
  assert.match(functionStep, /cloudfront publish-function/);
  assert.match(functionStep, /cloudfront get-distribution-config/);
  assert.match(functionStep, /select\(\.EventType == "viewer-request"\)/);
  assert.match(functionStep, /already has another viewer-request function/);
  assert.match(functionStep, /cloudfront update-distribution/);
  assert.match(functionStep, /cloudfront wait distribution-deployed/);
});

test('the build generates route data instead of keeping it in the function template', async () => {
  const template = await readFile('deployment/cloudfront-viewer-request.template.js', 'utf8');
  const generator = await readFile('scripts/generate-cloudfront-function.mjs', 'utf8');
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));

  assert.match(packageJson.scripts.build, /generate-cloudfront-function\.mjs/);
  assert.match(template, /__SUPPORTED_LOCALES__/);
  assert.match(template, /__DEFAULT_LOCALE__/);
  assert.match(template, /__REDIRECTS__/);
  assert.doesNotMatch(template, /online-judge|work\/blis|\/about/);
  assert.match(generator, /redirectDestination/);
  assert.match(generator, /routeFromFile/);
  assert.doesNotMatch(source, /__[A-Z_]+__/);
});
