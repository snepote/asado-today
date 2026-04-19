import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	timeout: 10_000,
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'pnpm dev --port 4173',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 30_000
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'iphone-12',
			use: { ...devices['iPhone 12'] }
		},
		{
			name: 'pixel-8',
			use: {
				...devices['Pixel 7'],
				userAgent: devices['Pixel 7'].userAgent.replace('Pixel 7', 'Pixel 8'),
				viewport: { width: 412, height: 852 },
				screen: { width: 412, height: 932 }
			}
		}
	]
});
