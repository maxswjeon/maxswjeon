import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    __labVitals: {
      cls: number;
      inp: number | null;
      lcp: number | null;
    };
  }
}

type Sample = {
  cls: number;
  domContentLoaded: number;
  fcp: number;
  inp: number;
  lcp: number;
  load: number;
  transferredBytes: number;
  ttfb: number;
};

const routes = ['/ko/', '/ko/about/', '/ko/work/', '/ko/work/rp2040-hub75/', '/ko/work/fairtrade/'] as const;
const budgets = {
  cls: 0.1,
  domContentLoaded: 3_000,
  fcp: 1_800,
  inp: 200,
  lcp: 2_500,
  load: 5_000,
  transferredBytes: 2 * 1024 * 1024,
  ttfb: 800,
} satisfies Sample;

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

test.describe.configure({ mode: 'serial' });

for (const route of routes) {
  test(`${route} stays within the lab performance budget`, async ({ browser }, testInfo) => {
    const samples: Sample[] = [];
    const resourceSamples = new Map<string, number[]>();

    for (let iteration = 0; iteration < 3; iteration += 1) {
      const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL as string });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      const transferred = new Map<string, number>();
      const requestUrls = new Map<string, string>();

      await cdp.send('Network.enable');
      cdp.on('Network.requestWillBeSent', ({ requestId, request }) => {
        requestUrls.set(requestId, request.url);
      });
      cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
        transferred.set(requestId, encodedDataLength);
      });

      await page.addInitScript(() => {
        window.__labVitals = { cls: 0, inp: null, lcp: null };

        new PerformanceObserver(list => {
          const entries = list.getEntries();
          window.__labVitals.lcp = entries.at(-1)?.startTime ?? window.__labVitals.lcp;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver(list => {
          for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
            if (!entry.hadRecentInput) window.__labVitals.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });

        new PerformanceObserver(list => {
          for (const entry of list.getEntries() as (PerformanceEntry & { duration: number; interactionId: number })[]) {
            if (entry.interactionId > 0) window.__labVitals.inp = Math.max(window.__labVitals.inp ?? 0, entry.duration);
          }
        }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
      });

      await page.goto(route, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      await page.locator('footer [data-tracking-settings]').click();
      await page.waitForTimeout(100);

      const browserMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
        return {
          cls: window.__labVitals.cls,
          domContentLoaded: navigation.domContentLoadedEventEnd,
          fcp,
          inp: window.__labVitals.inp,
          lcp: window.__labVitals.lcp,
          load: navigation.loadEventEnd,
          ttfb: navigation.responseStart - navigation.requestStart,
        };
      });

      for (const [metric, value] of Object.entries({
        fcp: browserMetrics.fcp,
        inp: browserMetrics.inp,
        lcp: browserMetrics.lcp,
      })) {
        if (value === null || !Number.isFinite(value) || value <= 0) {
          throw new Error(`${route} ${metric} was not observed`);
        }
      }

      samples.push({
        cls: browserMetrics.cls,
        domContentLoaded: browserMetrics.domContentLoaded,
        fcp: browserMetrics.fcp!,
        inp: browserMetrics.inp!,
        lcp: browserMetrics.lcp!,
        load: browserMetrics.load,
        transferredBytes: [...transferred.values()].reduce((total, bytes) => total + bytes, 0),
        ttfb: browserMetrics.ttfb,
      });
      for (const [requestId, bytes] of transferred) {
        const url = requestUrls.get(requestId);
        if (!url || url.startsWith('data:')) continue;
        resourceSamples.set(url, [...(resourceSamples.get(url) ?? []), bytes]);
      }
      await context.close();
    }

    const result: Sample = {
      cls: Math.max(...samples.map(sample => sample.cls)),
      domContentLoaded: median(samples.map(sample => sample.domContentLoaded)),
      fcp: median(samples.map(sample => sample.fcp)),
      inp: median(samples.map(sample => sample.inp)),
      lcp: median(samples.map(sample => sample.lcp)),
      load: median(samples.map(sample => sample.load)),
      transferredBytes: median(samples.map(sample => sample.transferredBytes)),
      ttfb: median(samples.map(sample => sample.ttfb)),
    };

    const largestResources = [...resourceSamples]
      .map(([url, values]) => ({ medianBytes: median(values), url }))
      .sort((a, b) => b.medianBytes - a.medianBytes)
      .slice(0, 10);
    const report = { budgets, largestResources, route, samples, summary: result };
    const slug = route === '/' ? 'home' : route.replaceAll('/', '');
    await mkdir('test-results/performance', { recursive: true });
    await writeFile(`test-results/performance/${slug}.json`, `${JSON.stringify(report, null, 2)}\n`);
    await testInfo.attach('performance-metrics', {
      body: JSON.stringify(report, null, 2),
      contentType: 'application/json',
    });

    console.table({ [route]: result });
    for (const [metric, budget] of Object.entries(budgets) as [keyof Sample, number][]) {
      expect(result[metric], `${route} ${metric} exceeded ${budget}`).toBeLessThanOrEqual(budget);
    }
  });
}
