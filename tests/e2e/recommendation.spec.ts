import { test, expect } from '@playwright/test';
import { mockVerdict, mockGeocoding, setupGeolocation, VERDICT_SI } from './fixtures/mock-data';

test.beforeEach(async ({ context, page }) => {
	await setupGeolocation(context);
	await mockGeocoding(page);
});

async function navigateToRecommendation(page: import('@playwright/test').Page) {
	await page.goto('/');
	await page.getByText('BUENOS AIRES').waitFor();
	await page.getByText('TAP TO ASK').click();
}

test('SI verdict shows stats and sunset', async ({ page }) => {
	await mockVerdict(page, 'SI');
	await navigateToRecommendation(page);
	await expect(page.getByText('Sí')).toBeVisible();
	await expect(page.getByText('Light the fire.')).toBeVisible();
	await expect(page.getByText(`${VERDICT_SI.weather.precipitationProbability}%`)).toBeVisible();
	await expect(page.getByText('PRECIPITATION')).toBeVisible();
	await expect(page.getByText('FEELS LIKE')).toBeVisible();
	await expect(page.getByText('WIND')).toBeVisible();
	await expect(page.getByText('HUMIDITY')).toBeVisible();
	await expect(page.getByText('SUNSET TONIGHT')).toBeVisible();
	await expect(page.getByText(VERDICT_SI.sunset)).toBeVisible();
});

test('MAYBE verdict', async ({ page }) => {
	await mockVerdict(page, 'MAYBE');
	await navigateToRecommendation(page);
	await expect(page.getByText('Tal vez')).toBeVisible();
	await expect(page.getByText('Could go either way.')).toBeVisible();
});

test('NO verdict', async ({ page }) => {
	await mockVerdict(page, 'NO');
	await navigateToRecommendation(page);
	await expect(page.getByText('No', { exact: true })).toBeVisible();
	await expect(page.getByText('Not today.')).toBeVisible();
});
