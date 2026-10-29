import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120000,
  expect: { timeout: 45000 },
  reporter: [['list'], ['json', { outputFile: 'evidencias/resultado.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:15173',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
  },
});
