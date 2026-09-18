# Performance baseline

Measured on 2026-09-13 against the local production build served by Astro preview.
Each route was loaded three times in a fresh Chromium context; the table reports
the median sample for each metric except CLS, which reports the worst sample.

| Route | FCP | LCP | CLS | Synthetic INP | TTFB | DOMContentLoaded | Load | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/ko/` | 216 ms | 216 ms | 0 | 24 ms | 2.6 ms | 60 ms | 429.2 ms | 1,996,799 B |
| `/ko/about/` | 208 ms | 208 ms | 0 | 24 ms | 2.2 ms | 55.8 ms | 421.9 ms | 1,929,026 B |
| `/ko/work/` | 228 ms | 228 ms | 0 | 24 ms | 2.7 ms | 53.6 ms | 417.9 ms | 1,956,684 B |
| `/ko/work/rp2040-hub75/` | 208 ms | 208 ms | 0 | 16 ms | 2 ms | 55.3 ms | 416.1 ms | 1,839,837 B |
| `/ko/work/fairtrade/` | 204 ms | 204 ms | 0 | 16 ms | 2 ms | 54.4 ms | 414.1 ms | 1,856,775 B |

## Budgets

- FCP: 1,800 ms
- LCP: 2,500 ms
- CLS: 0.1
- Synthetic INP: 200 ms
- TTFB: 800 ms
- DOMContentLoaded: 3,000 ms
- Load: 5,000 ms
- Transfer: 2 MiB

Run the same check with:

```sh
pnpm test:performance
```

The test records FCP and navigation timings from the Performance API, observes
LCP and CLS in the page, performs one controlled interaction for a synthetic INP
sample, and sums encoded response bytes through Chrome DevTools Protocol. JSON
samples are written to `test-results/performance/`.

The first run exceeded the transfer budget because both regular and bold
D2Coding font files were loaded. Keeping the required regular face and removing
the unused 1.59 MB bold face brought all measured routes below 2 MiB. The
2026-09-18 redesign removed D2Coding entirely; the five sampled routes now
transfer roughly 0.36-0.50 MB each.

These are reproducible lab measurements, not field data. Production CDN,
network, device, and real-user interaction conditions can produce different
results.
