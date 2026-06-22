import { defineConfig, devices } from '@playwright/test'

const appUrl = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:18080'
const appKey =
  process.env.APP_KEY ?? 'base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
const databasePath =
  process.env.E2E_DB_DATABASE ?? `/tmp/wishlist-e2e-${process.pid}.sqlite`
const envFile = `/tmp/wishlist-e2e-${process.pid}.env`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `printf '%s\\n' 'APP_NAME=Wishlist' 'APP_ENV=e2e' 'APP_KEY=${appKey}' 'APP_DEBUG=true' 'APP_URL=${appUrl}' 'DB_CONNECTION=sqlite' 'DB_DATABASE=${databasePath}' 'SESSION_DRIVER=file' 'CACHE_STORE=array' > ${envFile}; docker rm -f wishlist-e2e >/dev/null 2>&1 || true; npx concurrently -k -s first "docker run --rm --name wishlist-e2e -p 18080:8000 -v \\"$PWD:/app\\" -v \\"${envFile}:/app/.env:ro\\" -w /app composer:2 sh -lc \\"rm -f ${databasePath} && touch ${databasePath} && php artisan migrate:fresh --seed --seeder=E2eSeeder && php artisan serve --host=0.0.0.0 --port=8000\\"" "npm run dev -- --host 127.0.0.1 --port 5174"`,
    url: appUrl,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      APP_ENV: 'e2e',
      APP_KEY: appKey,
      DB_CONNECTION: 'sqlite',
      DB_DATABASE: databasePath,
      SESSION_DRIVER: 'file',
      CACHE_STORE: 'array',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
})
