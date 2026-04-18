import { describe, expect, it } from "vitest";
import { computeVerdict } from "$lib/server/weather/verdict";
import type { ForecastData } from "$lib/server/weather/types";

function makeForecast(overrides: Partial<{
	temperature: number;
	precipitationProbability: number;
	cloudCover: number;
	humidity: number;
	uvIndex: number;
	windSpeed: number;
	windDirection: number;
	weatherCode: number;
}> = {}): ForecastData {
	return {
		hourly: [
			{
				time: "2026-04-20T14:00",
				temperature: overrides.temperature ?? 26,
				precipitationProbability: overrides.precipitationProbability ?? 5,
				cloudCover: overrides.cloudCover ?? 20,
				humidity: overrides.humidity ?? 45,
				uvIndex: overrides.uvIndex ?? 5,
				windSpeed: overrides.windSpeed ?? 8,
				windDirection: overrides.windDirection ?? 180,
				weatherCode: overrides.weatherCode ?? 0,
			},
		],
		sunset: "2026-04-20T18:30",
	};
}

describe("computeVerdict", () => {
	it("returns SI for perfect weather", () => {
		const result = computeVerdict(makeForecast(), "2026-04-20", "14:00");
		expect(result.verdict).toBe("SI");
		expect(result.score).toBeGreaterThanOrEqual(70);
	});

	it("returns NO for terrible weather", () => {
		const result = computeVerdict(
			makeForecast({
				temperature: 5,
				precipitationProbability: 95,
				windSpeed: 50,
				humidity: 95,
				cloudCover: 100,
			}),
			"2026-04-20",
			"14:00",
		);
		expect(result.verdict).toBe("NO");
		expect(result.score).toBeLessThan(40);
	});

	it("returns MAYBE for borderline conditions", () => {
		const result = computeVerdict(
			makeForecast({
				temperature: 18,
				precipitationProbability: 40,
				windSpeed: 20,
				humidity: 70,
				cloudCover: 60,
			}),
			"2026-04-20",
			"14:00",
		);
		expect(result.verdict).toBe("MAYBE");
		expect(result.score).toBeGreaterThanOrEqual(40);
		expect(result.score).toBeLessThan(70);
	});

	it("provides all breakdown fields", () => {
		const result = computeVerdict(makeForecast(), "2026-04-20", "14:00");
		expect(result.breakdown).toHaveProperty("precipitation");
		expect(result.breakdown).toHaveProperty("temperature");
		expect(result.breakdown).toHaveProperty("wind");
		expect(result.breakdown).toHaveProperty("humidity");
		expect(result.breakdown).toHaveProperty("cloudCover");
		expect(result.breakdown).toHaveProperty("goldenHour");
		expect(result.breakdown).toHaveProperty("uvIndex");
	});

	it("score is between 0 and 100", () => {
		const result = computeVerdict(makeForecast(), "2026-04-20", "14:00");
		expect(result.score).toBeGreaterThanOrEqual(0);
		expect(result.score).toBeLessThanOrEqual(100);
	});

	it("high precipitation kills the score", () => {
		const dry = computeVerdict(
			makeForecast({ precipitationProbability: 0 }),
			"2026-04-20",
			"14:00",
		);
		const wet = computeVerdict(
			makeForecast({ precipitationProbability: 100 }),
			"2026-04-20",
			"14:00",
		);
		expect(dry.score - wet.score).toBeGreaterThanOrEqual(25);
	});

	it("finds closest hour when exact match missing", () => {
		const forecast: ForecastData = {
			hourly: [
				{
					time: "2026-04-20T13:00",
					temperature: 20,
					precipitationProbability: 50,
					cloudCover: 50,
					humidity: 50,
					uvIndex: 3,
					windSpeed: 15,
					windDirection: 90,
					weatherCode: 3,
				},
				{
					time: "2026-04-20T15:00",
					temperature: 28,
					precipitationProbability: 0,
					cloudCover: 10,
					humidity: 40,
					uvIndex: 5,
					windSpeed: 5,
					windDirection: 180,
					weatherCode: 0,
				},
			],
			sunset: "2026-04-20T18:30",
		};
		const result = computeVerdict(forecast, "2026-04-20", "14:30");
		expect(result.score).toBeDefined();
	});
});
