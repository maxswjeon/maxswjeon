import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
if (existsSync('.env')) loadEnvFile('.env');
const site = process.env.SITE_URL || 'https://swjeon.kr';
const url = new URL(site);
if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
  throw new Error('SITE_URL must be an HTTPS origin without a path, query, or fragment.');
}
export default defineConfig({
  site: url.origin,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    build: { sourcemap: false },
  },
});
