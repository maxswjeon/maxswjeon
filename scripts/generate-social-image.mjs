import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const fontPath = new URL('./assets/SWJeonOG.woff2', import.meta.url);
const outputPath = fileURLToPath(new URL('../public/og.png', import.meta.url));
const font = await readFile(fontPath);
const fontDataUrl = `data:font/woff2;base64,${font.toString('base64')}`;
const avatar = await readFile(new URL('../src/assets/profile.jpg', import.meta.url));
const avatarDataUrl = `data:image/jpeg;base64,${avatar.toString('base64')}`;
const fontSample = '전상완 Sangwan Jeon ENGINEER 세상이 더 효율적으로 움직이고, 사람들이 더 능숙하게 일할 수 있도록. 도구와 시스템, 그리고 경험과 지식. swjeon.kr';

const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  await page.setContent(`<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <style>
          @font-face {
            font-family: "SWJeon OG";
            src: url("${fontDataUrl}") format("woff2");
            font-style: normal;
            font-weight: 600;
          }

          * { box-sizing: border-box; }

          html, body {
            width: 1200px;
            height: 630px;
          }

          body {
            margin: 0;
            overflow: hidden;
            background: #f5f6f8;
            color: #15171c;
            font-family: "SWJeon OG", sans-serif;
            font-synthesis: none;
            font-weight: 600;
            text-rendering: geometricPrecision;
          }

          main {
            display: grid;
            height: 100%;
            padding: 62px 72px 58px 80px;
            grid-template-rows: auto 1fr auto;
          }

          header, footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          header {
            padding-bottom: 26px;
            border-bottom: 1px solid #dde0e5;
            font-size: 24px;
            letter-spacing: -0.025em;
          }

          header img {
            width: 56px;
            height: 56px;
            margin-right: 18px;
            border-radius: 50%;
          }

          header span:first-of-type {
            margin-right: auto;
          }

          header span:last-child {
            color: #c4282b;
            font-size: 18px;
            letter-spacing: 0.18em;
          }

          h1 {
            align-self: center;
            margin: -4px 0 0;
            max-width: 1040px;
            font-size: 62px;
            font-weight: 600;
            line-height: 1.28;
            letter-spacing: -0.045em;
          }

          footer {
            color: #5b616c;
            font-size: 21px;
            letter-spacing: -0.025em;
          }

          footer span:last-child {
            color: #c4282b;
            letter-spacing: -0.01em;
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <img src="${avatarDataUrl}" alt="">
            <span>전상완 · Sangwan Jeon</span>
            <span>ENGINEER</span>
          </header>
          <h1>세상이 더 효율적으로 움직이고,<br>사람들이 더 능숙하게 일할 수 있도록.</h1>
          <footer>
            <span>도구와 시스템, 그리고 경험과 지식.</span>
            <span>swjeon.kr</span>
          </footer>
        </main>
      </body>
    </html>`);

  await page.evaluate(async (sample) => {
    const [loadedFont] = await document.fonts.load('600 62px "SWJeon OG"', sample);
    await document.fonts.ready;

    if (!loadedFont || loadedFont.status !== 'loaded') {
      throw new Error('SWJeon OG did not load; refusing to capture a fallback-font image.');
    }
  }, fontSample);

  await page.screenshot({ path: outputPath });
} finally {
  await browser.close();
}
