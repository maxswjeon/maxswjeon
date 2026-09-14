import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { legacyProjectAliases } from '../src/content/public.ts';

const source = await readFile(
  new URL('../deployment/cloudfront-viewer-request.js', import.meta.url),
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


test('every public legacy fallback has the same temporary edge redirect and an existing destination', async () => {
  for (const [legacy, destination] of Object.entries(legacyProjectAliases)) {
    for (const uri of [`/${legacy}`, `/${legacy}/`]) {
      const response = context.handler({ request: { uri } });
      assert.equal(response.statusCode, 302, uri);
      assert.equal(response.headers.location.value, destination, uri);
    }
    const [path, anchor] = destination.split('#');
    const html = await readFile(`dist${path}index.html`, 'utf8');
    if (anchor) assert.ok(html.includes(`id="${anchor}"`), destination);
  }
});

test('deployment removes retired pages while retaining excluded fingerprinted assets', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  const assetStep = workflow.split('- name: Upload immutable assets')[1].split('- name: Upload pages and metadata')[0];
  const pageStep = workflow.split('- name: Upload pages and metadata')[1].split('- name: Invalidate CloudFront')[0];
  assert.doesNotMatch(assetStep, /--delete/);
  assert.match(pageStep, /--exclude '_astro\/\*'/);
  assert.match(pageStep, /--delete/);
});
