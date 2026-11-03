import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'browser',
  outputDir: 'test-results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: [['list'], ['json', { outputFile: process.env.RESULTADO_JSON || 'test-results/resultado.json' }]],
  use: { baseURL: process.env.BASE_LAB || 'http://127.0.0.1:15174', browserName: 'chromium' },
})
