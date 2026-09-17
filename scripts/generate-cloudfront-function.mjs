import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_FUNCTION_BYTES = 10_000;
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(projectRoot, process.argv[2] || 'dist');
const templatePath = join(projectRoot, 'deployment/cloudfront-viewer-request.template.js');
const outputPath = join(distDir, 'cloudfront-viewer-request.js');

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => entry.isDirectory()
      ? listFiles(join(directory, entry.name))
      : [join(directory, entry.name)]));
  return nested.flat();
}

function decodeAttribute(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
  return match ? decodeAttribute(match[1]) : undefined;
}

function redirectDestination(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (attribute(match[0], 'http-equiv')?.toLowerCase() !== 'refresh') continue;
    const content = attribute(match[0], 'content');
    const destination = content?.match(/^0\s*;\s*url=(.+)$/i)?.[1];
    if (destination) return destination;
  }
  return undefined;
}

function routeFromFile(file) {
  const path = relative(distDir, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  return `/${path.replace(/index\.html$/, '')}`;
}

function routeKey(route) {
  return route === '/' ? '' : route.replace(/\/$/, '');
}

function localesFromRootRedirect(html) {
  const locales = [];
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const locale = attribute(match[0], 'lang');
    const href = attribute(match[0], 'href');
    if (!locale || href !== `/${locale}/` || locales.includes(locale)) continue;
    locales.push(locale);
  }
  return locales;
}

function withoutDefaultLocale(destination, defaultLocale) {
  const prefix = `/${defaultLocale}`;
  if (!destination.startsWith(`${prefix}/`)) {
    throw new Error(`Redirect destination must start with ${prefix}/: ${destination}`);
  }
  return destination.slice(prefix.length);
}

async function assertLocalizedDestination(destination, locales) {
  const [pathAndQuery, encodedFragment] = destination.split('#', 2);
  const pathname = pathAndQuery.split('?', 1)[0];
  if (!pathname.startsWith('/') || !pathname.endsWith('/')) {
    throw new Error(`Redirect destination must be a directory route: ${destination}`);
  }

  for (const locale of locales) {
    const localizedFile = join(distDir, locale, pathname.slice(1), 'index.html');
    const html = await readFile(localizedFile, 'utf8').catch(() => {
      throw new Error(`Redirect destination is missing from the Astro build: /${locale}${pathname}`);
    });
    if (encodedFragment) {
      const fragment = decodeURIComponent(encodedFragment);
      if (!html.includes(`id="${fragment}"`)) {
        throw new Error(`Redirect fragment is missing from the Astro build: /${locale}${pathname}#${encodedFragment}`);
      }
    }
  }
}

const htmlFiles = (await listFiles(distDir)).filter((file) => file.endsWith('.html'));
const redirects = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const destination = redirectDestination(html);
  if (destination) redirects.push({ file, html, route: routeFromFile(file), destination });
}

const rootRedirect = redirects.find(({ route }) => route === '/');
if (!rootRedirect) throw new Error('Astro build did not produce a root language redirect.');

const defaultLocale = rootRedirect.destination.match(/^\/([^/?#]+)\//)?.[1];
if (!defaultLocale) throw new Error(`Cannot infer the default locale from ${rootRedirect.destination}.`);

const supportedLocales = localesFromRootRedirect(rootRedirect.html);
if (!supportedLocales.includes(defaultLocale)) {
  throw new Error(`The root redirect does not link the default locale ${defaultLocale}.`);
}

const routeEntries = [];
const seenRoutes = new Set();
for (const redirect of redirects.sort((left, right) => left.route.localeCompare(right.route))) {
  const key = routeKey(redirect.route);
  if (seenRoutes.has(key)) throw new Error(`Duplicate redirect route in Astro output: ${redirect.route}`);
  seenRoutes.add(key);

  const destination = withoutDefaultLocale(redirect.destination, defaultLocale);
  await assertLocalizedDestination(destination, supportedLocales);
  routeEntries.push([key, destination]);
}

const template = await readFile(templatePath, 'utf8');
const replacements = {
  __SUPPORTED_LOCALES__: JSON.stringify(supportedLocales),
  __DEFAULT_LOCALE__: JSON.stringify(defaultLocale),
  __REDIRECTS__: JSON.stringify(Object.fromEntries(routeEntries)),
};
const source = Object.entries(replacements)
  .reduce((result, [token, value]) => result.replace(token, value), template);

if (/__[A-Z_]+__/.test(source)) throw new Error('CloudFront function template contains an unresolved token.');
const functionBytes = Buffer.byteLength(source);
if (functionBytes > MAX_FUNCTION_BYTES) {
  throw new Error(`Generated CloudFront function is ${functionBytes} bytes; the limit is ${MAX_FUNCTION_BYTES}.`);
}

await writeFile(outputPath, source);
console.log(`Generated ${relative(projectRoot, outputPath)} from ${routeEntries.length} Astro redirects (${functionBytes} bytes).`);
