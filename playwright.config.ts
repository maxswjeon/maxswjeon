import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4321', headless: true },
  webServer: { command: 'pnpm exec astro preview --host 127.0.0.1 --port 4321', env: { ASTRO_PREVIEW_BACKGROUND: '1' }, url: 'http://127.0.0.1:4321', reuseExistingServer: false },
  reporter: [['list']],
});
