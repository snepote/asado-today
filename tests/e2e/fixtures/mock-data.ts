import type { BrowserContext, Page } from '@playwright/test';
import type { VerdictResult } from '../../../src/lib/types';

export const VERDICT_SI: VerdictResult = {
	verdict: 'SI',
	score: 82,
	weather: {
		temperature: 26,
		feelsLike: 25,
		precipitationProbability: 10,
		windSpeed: 12,
		windDirection: 90,
		humidity: 45,
		cloudCover: 15,
		uvIndex: 6,
		weatherCode: 1
	},
	sunset: '19:32'
};

export const VERDICT_MAYBE: VerdictResult = {
	verdict: 'MAYBE',
	score: 55,
	weather: {
		temperature: 20,
		feelsLike: 18,
		precipitationProbability: 40,
		windSpeed: 22,
		windDirection: 225,
		humidity: 65,
		cloudCover: 60,
		uvIndex: 3,
		weatherCode: 3
	},
	sunset: '18:45'
};

export const VERDICT_NO: VerdictResult = {
	verdict: 'NO',
	score: 25,
	weather: {
		temperature: 14,
		feelsLike: 11,
		precipitationProbability: 85,
		windSpeed: 35,
		windDirection: 180,
		humidity: 90,
		cloudCover: 95,
		uvIndex: 1,
		weatherCode: 61
	},
	sunset: '18:10'
};

const verdicts = { SI: VERDICT_SI, MAYBE: VERDICT_MAYBE, NO: VERDICT_NO };

export async function mockVerdict(page: Page, verdict: 'SI' | 'MAYBE' | 'NO') {
	await page.route('**/api/verdict*', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(verdicts[verdict])
		})
	);
}

export async function mockGeocoding(page: Page, city = 'Buenos Aires') {
	await page.route('**/api.bigdatacloud.net/**', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ city, locality: city })
		})
	);
}

export async function setupGeolocation(context: BrowserContext) {
	await context.grantPermissions(['geolocation']);
	await context.setGeolocation({ latitude: -34.6037, longitude: -58.3816 });
}
