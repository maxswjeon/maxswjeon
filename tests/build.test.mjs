import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]))).flat();
}

test('static output contains indexable, self-canonical pages and no internal source documents', async () => {
  const built = await files('dist');
  const pages = built.filter(p => p.endsWith('.html'));
  assert.ok(pages.length >= 35, 'both localized route trees, redirects, and 404 must be built');
  const titles = new Set();
  for (const file of built) {
    assert.doesNotMatch(file, /(?:internal|IMPLEMENTATION-HANDOFF|\.pdf$|\.map$)/);
    if (!/\.(?:html|js|json|xml|txt|css)$/.test(file)) continue;
    const content = await readFile(file, 'utf8');
    assert.doesNotMatch(content, /notion\.so|github-projects\.internal|projects-and-experience\.internal|1957732d31cf4f3|87971ca25fd4635/);
    if (!file.endsWith('.html')) continue;
    if (content.includes('http-equiv="refresh"')) {
      assert.match(content, /name="robots" content="noindex(?:,follow)?"/);
      assert.match(content, /rel="canonical" href="https:\/\//);
      continue;
    }
    const expectedLocale = file.includes('/en/') ? 'en' : 'ko';
    assert.match(content, new RegExp(`<html[^>]*lang="${expectedLocale}"`));
    assert.equal((content.match(/<h1(?:\s|>)/g) || []).length, 1, file);
    const title = content.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), `unique title: ${file}`);
    titles.add(title);
    assert.match(content, /name="description"/);
    if (file === 'dist/404.html') {
      assert.match(content, /noindex/);
      continue;
    }
    const canonical = content.match(/rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    const expected = new URL(file.replace(/^dist/, '').replace(/index\.html$/, ''), process.env.SITE_URL || 'https://swjeon.kr').href;
    assert.equal(canonical, expected, file);
    assert.match(content, /rel="alternate" hreflang="ko" href="https:\/\//);
    assert.match(content, /rel="alternate" hreflang="en" href="https:\/\//);
    assert.match(content, /application\/ld\+json/);
  }
});

test('all internal page and asset links resolve in the static build', async () => {
  for (const file of (await files('dist')).filter(p => p.endsWith('.html'))) {
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
      const href = match[1];
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const target = resolve('dist', `.${href}`);
      const info = await stat(target).catch(() => null);
      assert.ok(info, `${file}: ${href}`);
      if (info.isDirectory()) assert.ok(await stat(join(target, 'index.html')), href);
    }
  }
});

test('search discovery files use production URLs and omit error pages', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8');
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.match(robots, /Sitemap: https:\/\//);
  assert.match(sitemap, /<loc>https:\/\//);
  assert.doesNotMatch(sitemap, /404|localhost|internal/);
  for (const file of (await files('dist')).filter(p => p.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    if (html.includes('noindex')) continue;
    const canonical = html.match(/rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `sitemap missing ${file}`);
  }
});

test('the style system is fully owned by Tailwind CSS', async () => {
  const legacyGlobal = await stat('src/styles/global.css').catch(() => null);
  assert.equal(legacyGlobal, null);
  const tailwind = await readFile('src/styles/tailwind.css', 'utf8');
  assert.doesNotMatch(tailwind, /global\.css/);
  assert.match(tailwind, /@layer base/);
  assert.doesNotMatch(tailwind, /@layer components/);
  assert.doesNotMatch(tailwind, /^\s*\.[A-Za-z_-][\w-]*/m, 'component classes belong in Astro markup as Tailwind utilities');

  const astroSources = await files('src');
  for (const file of astroSources.filter(path => path.endsWith('.astro'))) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /<style(?:\s|>)/, `${file} must use Tailwind utilities`);
    assert.doesNotMatch(source, /text-\[var\(--size-/, `${file} must type CSS-variable font sizes as lengths`);
  }
});
