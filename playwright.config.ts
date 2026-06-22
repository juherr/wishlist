import { defineConfig, devices } from '@playwright/test'

const appUrl = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:18080'
const appKey =
  process.env.APP_KEY ?? 'base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
const databasePath =
  process.env.E2E_DB_DATABASE ?? `/app/database/e2e-${process.pid}.sqlite`

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
    command: `docker rm -f wishlist-e2e >/dev/null 2>&1 || true; npx concurrently -k -s first "docker run --rm --name wishlist-e2e -p 18080:8000 -v \\"$PWD:/app\\" -w /app -e APP_ENV -e APP_KEY -e DB_CONNECTION -e DB_DATABASE -e SESSION_DRIVER -e CACHE_STORE composer:2 sh -lc \\"rm -f ${databasePath} && touch ${databasePath} && php artisan migrate:fresh --seed --seeder=E2eSeeder && php -S 0.0.0.0:8000 -t public public/index.php\\"" "npm run dev -- --host 127.0.0.1 --port 5174"`,
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
