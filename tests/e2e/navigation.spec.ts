import { test, expect } from '@playwright/test';
import { mockVerdict, mockGeocoding, setupGeolocation } from './fixtures/mock-data';

test.describe('happy path', () => {
	test.beforeEach(async ({ context, page }) => {
		await setupGeolocation(context);
		await mockGeocoding(page);
		await mockVerdict(page, 'SI');
	});

	test('home screen renders city, weather, and call to action', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('BUENOS AIRES')).toBeVisible();
		await expect(page.getByText('26°')).toBeVisible();
		await expect(page.getByText('Clear · light breeze')).toBeVisible();
		await expect(page.getByText('TAP TO ASK')).toBeVisible();
		await expect(page.getByText('Another day or place?')).toBeVisible();
	});

	test('no horizontal overflow on any viewport', async ({ page }) => {
		await page.goto('/');
		const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
		const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
		expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
	});

	test('home → recommendation → back → ask again', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('BUENOS AIRES')).toBeVisible();
		await page.getByText('TAP TO ASK').click();
		await expect(page.getByText('Sí')).toBeVisible();
		await expect(page.getByText('SUNSET TONIGHT')).toBeVisible();

		await page.getByLabel('Go back').click();
		await expect(page.getByText('TAP TO ASK')).toBeVisible();

		await page.getByText('TAP TO ASK').click();
		await expect(page.getByText('Sí')).toBeVisible();
	});

	test('settings flow: change city and date → verdict', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('BUENOS AIRES')).toBeVisible();
		await page.getByText('Another day or place?').click();
		await expect(page.getByText('Where are you?')).toBeVisible();

		await page.getByRole('button', { name: 'Barcelona' }).click();
		await page.getByRole('button', { name: 'Next — pick a day' }).click();
		await expect(page.getByText('Which day?')).toBeVisible();

		await page.getByText('Tomorrow').click();
		await page.getByRole('button', { name: 'See the verdict' }).click();
		await expect(page.getByText('Sí')).toBeVisible();
	});
});

test.describe('geolocation denied', () => {
	test('falls back to settings screen', async ({ page }) => {
		await mockGeocoding(page);
		await mockVerdict(page, 'SI');
		await page.goto('/');
		await expect(page.getByText('Where are you?')).toBeVisible();
	});
});
