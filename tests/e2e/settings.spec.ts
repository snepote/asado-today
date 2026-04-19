import { test, expect } from '@playwright/test';
import { mockVerdict, mockGeocoding, setupGeolocation } from './fixtures/mock-data';

test.beforeEach(async ({ context, page }) => {
	await setupGeolocation(context);
	await mockGeocoding(page);
	await mockVerdict(page, 'SI');
});

async function goToSettings(page: import('@playwright/test').Page) {
	await page.goto('/');
	await expect(page.getByText('BUENOS AIRES')).toBeVisible();
	await page.getByText('Another day or place?').click();
}

test('step 1: location options and city selection', async ({ page }) => {
	await goToSettings(page);
	await expect(page.getByText('Where are you?')).toBeVisible();
	await expect(page.getByText('STEP 1 / 2')).toBeVisible();

	for (const city of ['Palermo', 'Buenos Aires', 'Montevideo', 'Barcelona', 'Milan', 'Lisbon']) {
		await expect(page.getByRole('button', { name: city })).toBeVisible();
	}

	await page.getByRole('button', { name: 'Barcelona' }).click();
	await expect(page.getByRole('button', { name: 'Barcelona' })).toHaveCSS(
		'background-color',
		'rgb(43, 29, 20)'
	);
});

test('step 2: pick date, back, and verdict', async ({ page }) => {
	await goToSettings(page);
	await page.getByRole('button', { name: 'Next — pick a day' }).click();
	await expect(page.getByText('Which day?')).toBeVisible();
	await expect(page.getByText('STEP 2 / 2')).toBeVisible();
	await expect(page.getByText('Today')).toBeVisible();
	await expect(page.getByText('Tomorrow')).toBeVisible();

	await page.getByLabel('Go back').click();
	await expect(page.getByText('Where are you?')).toBeVisible();

	await page.getByRole('button', { name: 'Barcelona' }).click();
	await page.getByRole('button', { name: 'Next — pick a day' }).click();
	await page.getByText('Tomorrow').click();
	await page.getByRole('button', { name: 'See the verdict' }).click();
	await expect(page.getByText('Sí')).toBeVisible();
});
