import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true })

const baseURL = process.env.BASE_URL ?? 'http://localhost:5173'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright/e2e',

  // Tempo máximo para cada teste completo (o padrão é 30 segundos)
  timeout: 60_000,

  // Tempo máximo para assertions como toBeVisible() e toHaveText()
  expect: {
    // Aumentar deixa as falhas mais lentas; prefira um timeout explícito na assertion que precisar
    timeout: 5_000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',

    // Tempo máximo para ações como click() e fill()
    actionTimeout: 5_000,

    // Tempo máximo para navegações como goto() e waitForURL()
    navigationTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
