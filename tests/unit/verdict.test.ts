import { describe, expect, it } from "vitest";
import { computeVerdict } from "$lib/server/weather/verdict";
import type { ForecastData } from "$lib/server/weather/types";

function makeForecast(
	overrides: Partial<{
		temperature: number;
		feelsLike: number;
		precipitationProbability: number;
		cloudCover: number;
		humidity: number;
		uvIndex: number;
		windSpeed: number;
		windDirection: number;
		weatherCode: number;
	}> = {},
): ForecastData {
	const base = {
		temperature: 25,
		feelsLike: 25,
		precipitationProbability: 0,
		cloudCover: 10,
		humidity: 50,
		uvIndex: 5,
		windSpeed: 8,
		windDirection: 90,
		weatherCode: 1,
		...overrides,
	};

	return {
		hourly: Array.from({ length: 48 }, (_, i) => ({
			time: `2026-04-19T${String(i % 24).padStart(2, "0")}:00`,
			...base,
		})),
		sunset: "2026-04-19T19:30",
	};
}

describe("computeVerdict", () => {
	it("returns SI for ideal conditions", () => {
		const forecast = makeForecast();
		const result = computeVerdict(forecast, "2026-04-19", 16);
		expect(result.verdict).toBe("SI");
		expect(result.score).toBeGreaterThanOrEqual(70);
	});

	it("returns NO for terrible conditions across all factors", () => {
		const forecast = makeForecast({
			precipitationProbability: 95,
			temperature: 2,
			windSpeed: 50,
			humidity: 95,
			cloudCover: 100,
			uvIndex: 0,
			weatherCode: 65,
		});
		const result = computeVerdict(forecast, "2026-04-19", 16);
		expect(result.verdict).toBe("NO");
		expect(result.score).toBeLessThan(40);
	});

	it("returns lower score for moderate conditions", () => {
		const forecast = makeForecast({
			precipitationProbability: 40,
			windSpeed: 20,
			humidity: 75,
			cloudCover: 60,
		});
		const result = computeVerdict(forecast, "2026-04-19", 16);
		expect(result.score).toBeLessThan(
			computeVerdict(makeForecast(), "2026-04-19", 16).score,
		);
	});

	it("includes sunset time in result", () => {
		const forecast = makeForecast();
		const result = computeVerdict(forecast, "2026-04-19", 16);
		expect(result.sunset).toBe("19:30");
	});

	it("includes weather data in result", () => {
		const forecast = makeForecast({ temperature: 28, humidity: 45 });
		const result = computeVerdict(forecast, "2026-04-19", 16);
		expect(result.weather.temperature).toBe(28);
		expect(result.weather.humidity).toBe(45);
	});

	it("precipitation heavily impacts score due to 30% weight", () => {
		const idealResult = computeVerdict(makeForecast(), "2026-04-19", 16);
		const rainyResult = computeVerdict(
			makeForecast({ precipitationProbability: 90 }),
			"2026-04-19",
			16,
		);
		expect(idealResult.score - rainyResult.score).toBeGreaterThanOrEqual(20);
	});

	it("returns consistent verdict for same inputs", () => {
		const forecast = makeForecast();
		const a = computeVerdict(forecast, "2026-04-19", 16);
		const b = computeVerdict(forecast, "2026-04-19", 16);
		expect(a.verdict).toBe(b.verdict);
		expect(a.score).toBe(b.score);
	});
});
