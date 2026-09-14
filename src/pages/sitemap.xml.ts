import type { APIRoute } from 'astro';
import { projects } from '../content/public';
const escapeXml = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export const GET: APIRoute = ({ site }) => {
  const localeRoutes = ['/', '/about/', '/work/', '/privacy/', '/work/archive/', ...projects.map(p => `/work/${p.slug}/`)];
  const routes = ['ko', 'en'].flatMap(locale => localeRoutes.map(route => `/${locale}${route}`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${escapeXml(new URL(route, site).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
