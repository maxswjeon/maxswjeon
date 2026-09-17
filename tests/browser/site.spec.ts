import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [360, 768, 1440]) {
  test(`navigation, accessibility and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    for (const route of ['/ko/', '/ko/about/', '/ko/work/']) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const overflowing = await page.locator('body *').evaluateAll(elements => elements
        .filter(element => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
        })
        .map(element => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 60), rect: element.getBoundingClientRect().toJSON() })));
      expect(overflowing, `${route} at ${width}px has horizontal overflow`).toEqual([]);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(audit.violations).toEqual([]);
      if (route === '/ko/work/') {
        for (const image of await page.locator('img[loading="lazy"]').all()) await image.scrollIntoViewIfNeeded();
        await page.evaluate(() => scrollTo(0, 0));
      }
      await page.screenshot({ path: `test-results/screenshots/${width}-${route.replaceAll('/', '') || 'home'}.png`, fullPage: true });
    }
    await page.goto('/ko/');
    await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/\/work\/$/);
  });
}

test('core content is available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/ko/');
  await expect(page.locator('h1')).toContainText('효율');
  await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.locator('main')).toContainText('엔진스튜디오 (NGINE STUDIOS) · 넥슨컴퍼니');
  await context.close();
});

test('no trackers requested before consent or without configured IDs', async ({ page }) => {
  const trackingRequests: string[] = [];
  page.on('request', r => { if (/googletagmanager|google-analytics|clarity\.ms|wcs\.naver|daumcdn/.test(r.url())) trackingRequests.push(r.url()); });
  await page.goto('/ko/');
  await page.waitForLoadState('networkidle');
  expect(trackingRequests).toEqual([]);
});

test('uses Pretendard, D2Coding and Korean-safe line breaking', async ({ page }) => {
  await page.goto('/ko/');
  const typography = await page.evaluate(async () => {
    await document.fonts.load('700 13px D2Coding');
    const rootStyle = getComputedStyle(document.documentElement);
    const monoStyle = getComputedStyle(document.querySelector('main > section:first-child p:first-child')!);
    return {
      documentFamily: rootStyle.fontFamily,
      monoFamily: monoStyle.fontFamily,
      d2CodingLoaded: document.fonts.check('700 13px D2Coding'),
      wordBreak: rootStyle.wordBreak,
    };
  });
  expect(typography.documentFamily).toContain('Pretendard Variable');
  expect(typography.monoFamily).toContain('D2Coding');
  expect(typography.d2CodingLoaded).toBe(true);
  expect(typography.wordBreak).toBe('keep-all');
  await expect(page.locator('link[href*="pretendardvariable-dynamic-subset"]')).toHaveCount(1);
});

test('keeps all visible interface copy at 13px or larger', async ({ page }) => {
  for (const route of ['/ko/', '/ko/about/', '/ko/work/']) {
    await page.goto(route);
    const undersized = await page.locator('p, a, h1, h2, h3, li, span, small, button, summary, label').evaluateAll(elements =>
      elements
        .filter(element => element.textContent?.trim() && element.getClientRects().length > 0)
        .map(element => ({
          text: element.textContent!.replace(/\s+/g, ' ').trim().slice(0, 80),
          pixels: Number.parseFloat(getComputedStyle(element).fontSize),
        }))
        .filter(({ pixels }) => pixels < 13),
    );
    expect(undersized, `${route} has undersized visible copy`).toEqual([]);
  }
});

test('public work links use specific page titles and verified destinations', async ({ page }) => {
  await page.goto('/ko/work/');
  await page.locator('section[aria-labelledby="experience-title"] details').evaluateAll(details => {
    for (const detail of details) detail.setAttribute('open', '');
  });

  const sourceLinks = page.locator('section[aria-labelledby="experience-title"] details li a');
  await expect(sourceLinks).toHaveCount(17);
  const labels = await sourceLinks.locator('span').allTextContents();
  expect(labels.some(label => /관련 보도|공개 자료/.test(label))).toBe(false);
  await expect(page.getByRole('link', { name: /Nexon CEO: It's important/ })).toHaveAttribute(
    'href',
    'https://www.gamedeveloper.com/business/nexon-ceo-it-s-important-to-assume-that-every-game-company-is-now-using-ai',
  );
});

test('separates projects by provenance and keeps work wording specific', async ({ page }) => {
  await page.goto('/ko/work/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    '경력과 외주·개인·학교·동아리 프로젝트, 개발 도구를 소개합니다.',
  );
  await expect(page.getByRole('heading', { name: '프로젝트 모음' })).toBeVisible();
  await expect(page.locator('section[aria-labelledby^="project-group-"]')).toHaveCount(4);
  await expect(page.locator('#project-group-client')).toHaveText('외주로 맡은 작업');
  await expect(page.locator('#project-group-personal')).toHaveText('개인 프로젝트');
  await expect(page.locator('#project-group-school')).toHaveText('학교에서 시작한 프로젝트');
  await expect(page.locator('#project-group-community')).toHaveText('동아리·학회에서 만든 프로젝트');
  await expect(page.locator('section[aria-labelledby^="project-group-"] > article')).toHaveCount(12);
  await expect(page.locator('section[aria-labelledby="project-group-client"]').getByRole('link', { name: /BLIS/ }).first()).toBeVisible();
  await expect(page.locator('section[aria-labelledby="project-group-school"]').getByRole('link', { name: /공정무역 제품 판별/ }).first()).toBeVisible();
  await expect(page.locator('section[aria-labelledby="project-group-school"]').getByRole('link', { name: /연세대학교 마일리지 검색/ }).first()).toBeVisible();
  await expect(page.locator('section[aria-labelledby="project-group-community"]').getByRole('link', { name: /Bear OJ/ }).first()).toBeVisible();
  await expect(page.locator('section[aria-labelledby="project-group-community"]').getByRole('link', { name: /OUTTA 수료증 관리/ }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SpaceY 강연 안내 사이트' })).toBeVisible();
  await expect(page.locator('#nine-corporation')).toContainText('2023.01-2023.04');
  await expect(page.locator('#nine-corporation')).toContainText('Frontend Engineer');
  await expect(page.locator('#nine-corporation')).toContainText('게임 런처의 활성화 흐름');
  await expect(page.locator('#nine-corporation')).toContainText('포털 계정 복구 서비스');
  await expect(page.locator('#nine-corporation').getByRole('heading', { name: /Nine Chronicles Launcher/ })).toBeVisible();
  await expect(page.locator('#nine-corporation').getByRole('heading', { name: /Nine Chronicles Account Recovery/ })).toBeVisible();
  await expect(page.locator('#nine-corporation').getByRole('heading', { name: /Dongrami/ })).toBeVisible();
  await expect(page.locator('#nine-corporation').getByRole('link', { name: /Nine Chronicles Launcher/ })).toHaveAttribute('href', 'https://github.com/planetarium/9c-launcher');
  await expect(page.locator('#nine-corporation').getByRole('link', { name: /Dongrami/ })).toHaveAttribute('href', 'https://github.com/planetarium/dongrami');
  await expect(page.locator('#nine-corporation').getByRole('link', { name: 'Nine Corporation ↗' })).toHaveAttribute('href', 'https://nine-corporation.com/');
  await expect(page.locator('#nine-corporation').getByRole('link', { name: 'Planetarium Labs ↗' })).toHaveAttribute('href', 'https://www.planetariumlabs.com/');
  await expect(page.getByRole('heading', { name: '엔진스튜디오 (NGINE STUDIOS) · 넥슨컴퍼니' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '플라네타리움 (나인코퍼레이션)' })).toBeVisible();
  await expect(page.locator('#nexon-ngine-studios')).toContainText('Frontend Engineer · 정규직 · 2024.04-2026.05');
  await expect(page.locator('#nexon-ngine-studios')).toContainText('넥슨 게임의 활성 이용자를 늘리고');
  await expect(page.locator('#zible')).toContainText('Datahog와 Sentry');
  await expect(page.locator('#zible')).toContainText('Full Stack Engineer');
  await expect(page.locator('#promedius')).toContainText('2022.01-2022.02');
  await expect(page.locator('#promedius')).toContainText('인턴');
  await expect(page.locator('#promedius')).toContainText('라이선스 관리 시스템의 PoC');
  await expect(page.locator('#promedius')).toContainText('FreeIPA');
  await expect(page.locator('#promedius')).toContainText('온프레미스 사내 서버 사용자 관리');
  await expect(page.locator('#promedius').getByRole('heading', { name: 'FreeIPA 기반 시스템 구축' })).toBeVisible();
  await expect(page.locator('#promedius').getByRole('heading', { name: 'Prometheus와 Grafana 기반 GPU 사용량 모니터링 시스템 구축' })).toBeVisible();
  await expect(page.locator('#promedius')).toContainText('Prometheus와 Grafana');
  await expect(page.getByRole('heading', { name: '이전에 맡았던 제품과 서비스' })).toHaveCount(0);
  for (const [label, href] of [
    ['YCC', 'https://www.ycc.club/'],
    ['KUCC', 'https://kucc.co.kr/'],
    ['OUTTA', 'https://outta.ai/'],
    ['SpaceY', 'https://spacey.kr'],
  ]) {
    await expect(page.getByRole('link', { name: `${label} ↗` }).first()).toHaveAttribute('href', href);
  }
  const experienceHierarchy = await page.locator('#nexon-ngine-studios, #nine-corporation, #zible, #promedius').evaluateAll(entries =>
    entries.map(entry => {
      const heading = entry.querySelector('h2')!;
      return {
        left: Math.round(heading.getBoundingClientRect().left),
        level: heading.tagName,
        size: getComputedStyle(heading).fontSize,
      };
    }),
  );
  expect(experienceHierarchy).toHaveLength(4);
  expect(new Set(experienceHierarchy.map(item => item.left)).size).toBe(1);
  expect(new Set(experienceHierarchy.map(item => item.level)).size).toBe(1);
  expect(new Set(experienceHierarchy.map(item => item.size)).size).toBe(1);
  const experienceRuleWidths = await page.evaluate(() => ({
    nexonLastItemBottom: getComputedStyle(document.querySelector('#nexon-ngine-studios > div > article:last-child')!).borderBottomWidth,
    nexonBottom: getComputedStyle(document.querySelector('#nexon-ngine-studios')!).borderBottomWidth,
    nineTop: getComputedStyle(document.querySelector('#nine-corporation')!).borderTopWidth,
  }));
  expect(experienceRuleWidths).toEqual({ nexonLastItemBottom: '0px', nexonBottom: '1px', nineTop: '0px' });
  await expect(page.locator('#nexon-ngine-studios > div > article > span:first-child')).toHaveText(['01', '02', '03', '04']);
  await expect(page.locator('#nine-corporation > div > article > span:first-child')).toHaveText(['01', '02', '03']);
  await expect(page.getByText('개발과 운영 전반을 전담해')).toBeVisible();
  await expect(page.getByText('서비스 정리 업무에도 마지막까지 참여했습니다.')).toBeVisible();
  await expect(page.getByRole('heading', { name: '모바일 웹 기반 AI 이미지 데모' })).toBeVisible();
  await expect(page.getByText('WASM ImageMagick으로')).toBeVisible();
});

test('lets item descriptions use their full content column without forcing group-title wraps', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });

  for (const [route, selectors] of [
    ['/ko/', ['#approach ol > li > p', 'section[aria-labelledby="selected-title"] a[href^="/ko/work/"] > div > p:last-child']],
    ['/ko/work/', ['#nexon-ngine-studios > header > p:last-child', '#nine-corporation > p, #zible > p, #promedius > p', 'section[aria-labelledby="experience-title"] article article p', 'section[aria-labelledby^="project-group-"] > article a[href^="/ko/work/"] > p', 'section[aria-labelledby="tools-title"] li p']],
  ] as const) {
    await page.goto(route);
    for (const selector of selectors) {
      const measurements = await page.locator(selector).evaluateAll(elements => elements.map(element => ({
        maxWidth: getComputedStyle(element).maxWidth,
        rightGap: Math.abs(element.parentElement!.getBoundingClientRect().right - element.getBoundingClientRect().right),
      })));
      expect(measurements.length, `${route} ${selector} should match at least one description`).toBeGreaterThan(0);
      expect(measurements.every(({ maxWidth, rightGap }) => maxWidth === 'none' && rightGap < 1), `${route} ${selector} should fill its parent`).toBe(true);
    }
  }

  await page.goto('/ko/work/bear-oj/');
  expect(await page.locator('section[aria-labelledby="context"], section[aria-labelledby="contribution"], section[aria-labelledby="change"], section[aria-labelledby="status"]').locator(':scope > :last-child').evaluateAll(elements => elements.every(element => getComputedStyle(element).maxWidth === 'none'))).toBe(true);

  await page.goto('/ko/work/');
  for (const id of ['project-group-school', 'project-group-community']) {
    const lineCount = await page.locator(`#${id}`).evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set([...range.getClientRects()].map(rect => Math.round(rect.top))).size;
    });
    expect(lineCount, `${id} should remain on one line at desktop width`).toBe(1);
  }
});

test('serves prefixed Korean and English routes with reciprocal language links and metadata', async ({ browser, page }) => {
  const koreanContext = await browser.newContext({ locale: 'ko-KR', baseURL: 'http://127.0.0.1:4321' });
  const koreanPage = await koreanContext.newPage();
  await koreanPage.goto('/');
  await expect(koreanPage).toHaveURL(/\/ko\/$/);
  await koreanContext.close();

  const englishContext = await browser.newContext({ locale: 'en-US', baseURL: 'http://127.0.0.1:4321' });
  const englishPage = await englishContext.newPage();
  await englishPage.goto('/work/');
  await expect(englishPage).toHaveURL(/\/en\/work\/$/);
  await englishContext.close();

  await page.goto('/ko/work/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://swjeon.kr/ko/work/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://swjeon.kr/en/work/');
  await page.locator('header details').click();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/work\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Planetarium (Nine Corporation)' })).toBeVisible();
  await expect(page.locator('link[rel="alternate"][hreflang="ko"]')).toHaveAttribute('href', 'https://swjeon.kr/ko/work/');
  await page.locator('header details').click();
  await expect(page.getByRole('link', { name: '한국어', exact: true })).toHaveAttribute('href', '/ko/work/');
});

test('keeps the English locale readable at mobile and desktop widths', async ({ page }) => {
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of ['/en/', '/en/about/', '/en/work/']) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toBeVisible();
      const overflowing = await page.locator('body *').evaluateAll(elements => elements
        .filter(element => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
        })
        .map(element => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 60), rect: element.getBoundingClientRect().toJSON() })));
      expect(overflowing, `${route} at ${width}px has horizontal overflow`).toEqual([]);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(audit.violations).toEqual([]);
      if (route === '/en/work/') {
        for (const image of await page.locator('img[loading="lazy"]').all()) await image.scrollIntoViewIfNeeded();
        await page.evaluate(() => scrollTo(0, 0));
      }
      await page.screenshot({ path: `test-results/screenshots/${width}-${route.replaceAll('/', '') || 'en'}.png`, fullPage: true });
    }
  }
});

test('keeps major Korean headings on semantic, visually balanced lines', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/ko/');
  const heading = page.locator('h1');
  await expect(heading).toHaveAttribute('aria-label', '세상이 더 효율적으로 움직이고 사람들이 더 능숙하게 일할 수 있도록');
  await expect(heading.locator(':scope > span')).toHaveText([
    '세상이 더 효율적으로 움직이고',
    '사람들이 더 능숙하게 일할 수 있도록',
  ]);
  const desktopLines = await heading.locator(':scope > span').evaluateAll(elements => elements.map(element => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return new Set([...range.getClientRects()].map(rect => Math.round(rect.top))).size;
  }));
  expect(desktopLines).toEqual([1, 1]);

  await expect(page.locator('#approach-title')).toHaveAttribute('aria-label', '도구부터 운영까지 일의 흐름을 살핍니다');
  await expect(page.locator('#approach ol > li').nth(1).locator('h3')).toHaveAttribute('aria-label', '복잡한 일을 이해하고 다룰 수 있게 합니다');
  await expect(page.locator('#approach ol > li').nth(1).locator('h3 > span')).toHaveText([
    '복잡한 일을 이해하고',
    '다룰\u00a0수\u00a0있게\u00a0합니다',
  ]);
  await expect(page.locator('#approach ol > li').nth(2).locator('h3')).toHaveAttribute('aria-label', '배운 것을 기록하고 나눕니다');
  await expect(page.locator('#selected-title')).toHaveAttribute('aria-label', '생각은 시스템이 되어 실제로 작동합니다');
  await expect(page.locator('#writing-title')).toHaveAttribute('aria-label', '배운 것을 설명하며 다시 이해합니다');
  await expect(page.locator('footer p[data-multiline-text] > .sr-only')).toHaveText('연락하기');
  await expect(page.locator('[data-purpose-introduction] > span')).toHaveText([
    '불필요한 수고를 줄이는 도구와 시스템을 만듭니다.',
    '만든 도구와 시스템을 다른 사람도 이해하고 활용할 수 있도록 경험과 지식을 나눕니다.',
  ]);
  await expect(page.getByRole('link', { name: '소개', exact: true })).toHaveAttribute('href', '/ko/about/');
  const introductionLineTops = await page.locator('[data-purpose-introduction] > span').evaluateAll(elements =>
    elements.map(element => Math.round(element.getBoundingClientRect().top)),
  );
  expect(new Set(introductionLineTops).size).toBe(2);
  expect(await page.locator('footer').evaluate(element => Number.parseFloat(getComputedStyle(element).paddingBottom))).toBeGreaterThanOrEqual(48);

  const semanticLineSelectors = [
    '#approach-title > span',
    '#approach ol > li h3 > span',
    '#selected-title > span',
    '#writing-title > span',
    'footer p[data-multiline-text] > span[aria-hidden="true"]',
  ];
  for (const selector of semanticLineSelectors) {
    const lineCounts = await page.locator(selector).evaluateAll(elements => elements.map(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set([...range.getClientRects()].map(rect => Math.round(rect.top))).size;
    }));
    expect(lineCounts.every(count => count === 1), `${selector} must preserve each semantic line at 1440px`).toBe(true);
  }

  const visualLines = async (route: string) => {
    await page.goto(route);
    return page.locator('h1').evaluate(element => {
      const words: { text: string; top: number }[] = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        for (const match of node.textContent?.matchAll(/\S+/g) ?? []) {
          const range = document.createRange();
          range.setStart(node, match.index!);
          range.setEnd(node, match.index! + match[0].length);
          words.push({ text: match[0], top: Math.round(range.getBoundingClientRect().top) });
        }
        node = walker.nextNode();
      }
      return [...Map.groupBy(words, word => word.top).values()].map(line => line.map(word => word.text).join(' '));
    });
  };

  await page.setViewportSize({ width: 360, height: 960 });
  for (const route of ['/ko/', '/ko/about/', '/ko/work/']) {
    const lines = await visualLines(route);
    expect(lines.at(-1)?.trim().split(/\s+/).length, `${route} must not leave one word on the final line`).toBeGreaterThan(1);
    if (route === '/ko/') {
      expect(lines).toHaveLength(4);
      expect(lines.at(-1)?.replaceAll('\u00a0', ' ')).toBe('일할 수 있도록');
    }
  }

  await page.goto('/ko/');
  for (const selector of semanticLineSelectors) {
    const lineCounts = await page.locator(selector).evaluateAll(elements => elements.map(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set([...range.getClientRects()].map(rect => Math.round(rect.top))).size;
    }));
    expect(lineCounts.every(count => count === 1), `${selector} must preserve each semantic line at 360px`).toBe(true);
  }
});

test('does not isolate protected heading terms on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 960 });

  const visualLines = (selector: string) => page.locator(selector).evaluateAll(elements => elements.flatMap(element => {
    const words: { text: string; top: number }[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.parentElement?.closest('.sr-only')) {
        node = walker.nextNode();
        continue;
      }
      for (const match of node.textContent?.matchAll(/\S+/g) ?? []) {
        const range = document.createRange();
        range.setStart(node, match.index!);
        range.setEnd(node, match.index! + match[0].length);
        words.push({ text: match[0], top: Math.round(range.getBoundingClientRect().top) });
      }
      node = walker.nextNode();
    }
    return [...Map.groupBy(words, word => word.top).values()].map(line => line.map(word => word.text).join(' ').replaceAll('\u00a0', ' '));
  }));

  for (const route of ['/ko/', '/ko/about/', '/ko/work/', '/en/', '/en/about/', '/en/work/', '/404.html']) {
    await page.goto(route);
    const lines = await visualLines('h1, h2, h3, h4, footer p[data-multiline-text]');
    expect(lines, `${route} must not leave a protected term on its own line`).not.toEqual(expect.arrayContaining([
      'STUDIOS)',
      '· 넥슨컴퍼니',
      '· NEXON COMPANY',
      'Recovery',
      'Management',
      '만들어요',
      'better',
      '바꿉니다',
      'systems',
      'reusable',
    ]));
  }
});

test('omits terminal periods from title and subtitle text', async ({ page }) => {
  const routes = [
    '/404.html',
    ...['ko', 'en'].flatMap(locale => [
      `/${locale}/`,
      `/${locale}/about/`,
      `/${locale}/work/`,
      `/${locale}/work/archive/`,
      `/${locale}/privacy/`,
      ...[
        'blis',
        'coryose-process',
        'rp2040-hub75',
        'bear-oj',
        'yonsei-mileage',
        'outta-certificates',
        'monika',
        'cadence',
        'shepherd',
        'fairtrade',
        'spacey-passion',
        'clubroom',
      ].map(slug => `/${locale}/work/${slug}/`),
    ]),
  ];

  for (const route of routes) {
    await page.goto(route);
    const trailingPeriods = await page.locator('h1, h2, h3, h4, [data-multiline-text]').evaluateAll(elements =>
      elements
        .map(element => element.textContent?.replace(/\s+/g, ' ').trim() ?? '')
        .filter(text => text.endsWith('.')),
    );
    expect(trailingPeriods, `${route} has title-level text ending in a period`).toEqual([]);
  }
});

test('serves the local profile image and verified project media with dimensions', async ({ page }) => {
  await page.goto('/ko/');
  const profile = page.locator('body > header img');
  await expect(profile).toHaveCount(1);
  await expect(profile).toHaveAttribute('alt', '전상완 프로필');
  await expect(page.locator('main > section:first-child img')).toHaveCount(0);

  for (const route of [
    '/ko/work/coryose-process/',
    '/ko/work/bear-oj/',
    '/ko/work/yonsei-mileage/',
    '/ko/work/outta-certificates/',
    '/ko/work/fairtrade/',
    '/ko/work/spacey-passion/',
    '/ko/work/clubroom/',
  ]) {
    await page.goto(route);
    const images = page.locator('main > section[aria-label] img');
    await expect(images).toHaveCount(1);
    const image = images.first();
    await expect(image).toHaveAttribute('alt', /.+/);
    await expect(image).toHaveAttribute('width', /^\d+$/);
    await expect(image).toHaveAttribute('height', /^\d+$/);
    expect(await image.getAttribute('src')).toMatch(/^\/_astro\//);
    expect(await image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await expect(page.locator('main > section[aria-label] figcaption')).not.toContainText('기존 포트폴리오에 공개한');
  }

  await page.goto('/ko/work/');
  for (const selector of ['#nine-corporation img', '#zible img']) {
    const image = page.locator(selector);
    await expect(image).toHaveCount(1);
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  const recoveryItem = page.locator('#nine-corporation > div > article').filter({ has: page.getByRole('heading', { name: 'Nine Chronicles Account Recovery' }) });
  await expect(recoveryItem.locator('img')).toHaveCount(1);
  await expect(page.locator('#nine-corporation > figure')).toHaveCount(0);
  await expect(page.getByText(/기존 포트폴리오에 공개한/)).toHaveCount(0);

  await page.goto('/ko/work/bear-oj/');
  const bearLinks = page.getByRole('list', { name: 'Bear OJ 프로젝트 링크' }).getByRole('link');
  await expect(bearLinks).toHaveCount(3);
  await expect(bearLinks.nth(0)).toHaveAttribute('href', 'https://github.com/maxswjeon/Bear-OJ-frontend');
  await expect(bearLinks.nth(1)).toHaveAttribute('href', 'https://github.com/maxswjeon/Bear-OJ-admin');
  await expect(bearLinks.nth(2)).toHaveAttribute('href', 'https://github.com/maxswjeon/Bear-OJ-backend');
});

test('omits visual breadcrumbs while retaining structured breadcrumb metadata', async ({ page }) => {
  await page.goto('/ko/work/bear-oj/');
  await expect(page.locator('nav[aria-label*="breadcrumb" i]')).toHaveCount(0);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.some(schema => JSON.parse(schema)['@type'] === 'BreadcrumbList')).toBe(true);
});

test('uses open leading and readable section labels from the utility layer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/ko/about/');
  const metrics = await page.evaluate(() => {
    const label = getComputedStyle(document.querySelector('#why')!);
    const copy = getComputedStyle(document.querySelector('section[aria-labelledby="why"] > p')!);
    const description = getComputedStyle(document.querySelector('main > header > p:last-child')!);
    return {
      labelSize: Number.parseFloat(label.fontSize),
      labelLeading: Number.parseFloat(label.lineHeight) / Number.parseFloat(label.fontSize),
      copyLeading: Number.parseFloat(copy.lineHeight) / Number.parseFloat(copy.fontSize),
      descriptionLeading: Number.parseFloat(description.lineHeight) / Number.parseFloat(description.fontSize),
    };
  });
  expect(metrics.labelSize).toBeGreaterThanOrEqual(18);
  expect(metrics.labelLeading).toBeGreaterThanOrEqual(1.6);
  expect(metrics.copyLeading).toBeGreaterThanOrEqual(1.85);
  expect(metrics.descriptionLeading).toBeGreaterThanOrEqual(1.85);
});

test('vertically centers the active navigation dot on About and Work', async ({ page }) => {
  for (const route of ['/ko/about/', '/ko/work/']) {
    await page.goto(route);
    const centers = await page.locator('header nav a[aria-current="page"]').evaluate(element => {
      const dot = element.querySelector('span')!;
      const linkRect = element.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();
      return {
        link: linkRect.top + linkRect.height / 2,
        dot: dotRect.top + dotRect.height / 2,
      };
    });
    expect(Math.abs(centers.link - centers.dot)).toBeLessThan(1);
  }
});

test('keeps the native cursor and limits decorative motion', async ({ page }) => {
  await page.goto('/ko/');
  const policy = await page.evaluate(() => {
    const customCursors: string[] = [];
    const longTransitions: string[] = [];
    const animations: string[] = [];
    const visit = (rules: CSSRuleList) => {
      for (const rule of rules) {
        if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules);
        if (!('style' in rule)) continue;
        const style = (rule as CSSStyleRule).style;
        const cursor = style.cursor;
        if (cursor === 'none' || cursor.includes('url(')) customCursors.push(rule.cssText);
        if (style.animationName && style.animationName !== 'none') animations.push(rule.cssText);
        for (const duration of style.transitionDuration.split(',')) {
          const value = duration.trim();
          const milliseconds = value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
          if (Number.isFinite(milliseconds) && milliseconds > 160) longTransitions.push(rule.cssText);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      try { visit(sheet.cssRules); } catch { /* Cross-origin font stylesheet. */ }
    }
    return { customCursors, longTransitions, animations };
  });
  expect(policy).toEqual({ customCursors: [], longTransitions: [], animations: [] });
});

test('settings works without IDs, traps dialog focus and closes with Escape', async ({ page }) => {
  await page.goto('/ko/');
  await page.locator('footer [data-tracking-settings]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('[data-tracking-empty]')).toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('footer [data-tracking-settings]')).toBeFocused();
});

test('project navigation, direct localized entry, and missing route', async ({ page }) => {
  await page.goto('/ko/work/');
  await page.getByRole('link', { name: /BLIS/ }).first().click();
  await expect(page.locator('h1')).toHaveText('BLIS 연고편입 LMS');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('BLIS 연고편입 LMS');
  await page.getByRole('link', { name: 'Work 목록으로 돌아가기' }).click();
  await expect(page).toHaveURL(/\/ko\/work\/$/);
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
});
