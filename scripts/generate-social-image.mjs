import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="ko"><meta charset="utf-8"><style>
  *{box-sizing:border-box}body{margin:0;padding:64px 72px;background:#f5f2ea;color:#17202a;font-family:Arial,'Noto Sans CJK KR',sans-serif;width:1200px;height:630px}header{display:flex;justify-content:space-between;border-bottom:1px solid #bfc1bf;padding-bottom:28px;font-size:25px}small{color:#315b88;font-size:22px;letter-spacing:3px}h1{font-size:64px;line-height:1.35;letter-spacing:-3px;margin:55px 0 35px;font-weight:700}footer{display:flex;justify-content:space-between;color:#315b88;font-size:24px}
  </style><header><span>전상완 &nbsp; Sangwan Jeon</span><small>ENGINEER</small></header><h1>세상이 더 효율적으로 움직이고,<br>사람들이 더 능숙하게 일할 수 있도록.</h1><footer><span>도구와 시스템, 그리고 경험과 지식.</span><span>swjeon.kr</span></footer></html>`);
  await page.screenshot({ path: 'public/og.png' });
} finally { await browser.close(); }
