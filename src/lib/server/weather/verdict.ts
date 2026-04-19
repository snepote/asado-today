import type { Verdict, VerdictResult } from "$lib/types";
import type { ForecastData } from "./types";

const WEIGHTS = {
	precipitation: 0.3,
	temperature: 0.2,
	wind: 0.15,
	humidity: 0.1,
	cloudCover: 0.1,
	goldenHour: 0.1,
	uvIndex: 0.05,
};

function scorePrecipitation(probability: number): number {
	return Math.max(0, 100 - probability);
}

function scoreTemperature(temp: number): number {
	if (temp >= 22 && temp <= 30) return 100;
	if (temp < 15) return Math.max(0, ((temp - 5) / 10) * 100);
	if (temp < 22) return 50 + ((temp - 15) / 7) * 50;
	if (temp <= 38) return 100 - ((temp - 30) / 8) * 60;
	return Math.max(0, 40 - ((temp - 38) / 5) * 40);
}

function scoreWind(speed: number): number {
	if (speed <= 10) return 100;
	if (speed <= 25) return 100 - ((speed - 10) / 15) * 60;
	if (speed <= 40) return 40 - ((speed - 25) / 15) * 40;
	return 0;
}

function scoreHumidity(humidity: number): number {
	if (humidity >= 30 && humidity <= 60) return 100;
	if (humidity < 20) return 70;
	if (humidity < 30) return 70 + ((humidity - 20) / 10) * 30;
	if (humidity <= 80) return 100 - ((humidity - 60) / 20) * 70;
	return 30;
}

function scoreCloudCover(cover: number): number {
	return Math.max(30, 100 - cover * 0.7);
}

function scoreUvIndex(uv: number): number {
	if (uv === 0) return 70;
	if (uv >= 3 && uv <= 6) return 100;
	if (uv < 3) return 70 + (uv / 3) * 30;
	if (uv <= 10) return 100 - ((uv - 6) / 4) * 50;
	return 50;
}

function scoreGoldenHour(hour: number, sunset: string): number {
	const sunsetStr = sunset.includes("T") ? sunset.split("T")[1] : sunset;
	const sunsetHour = Number.parseInt(sunsetStr.split(":")[0], 10);
	const hoursBeforeSunset = sunsetHour - hour;

	if (hoursBeforeSunset >= 3) return 100;
	if (hoursBeforeSunset >= 1) return 70;
	if (hoursBeforeSunset >= 0) return 50;
	return 40;
}

export function computeVerdict(forecast: ForecastData, date: string, hour: number): VerdictResult {
	const targetHour = `${date}T${String(hour).padStart(2, "0")}:00`;

	const hourData =
		forecast.hourly.find((h) => h.time === targetHour) ??
		forecast.hourly.reduce((closest, h) => {
			const diff = Math.abs(new Date(h.time).getTime() - new Date(targetHour).getTime());
			const closestDiff = Math.abs(
				new Date(closest.time).getTime() - new Date(targetHour).getTime(),
			);
			return diff < closestDiff ? h : closest;
		});

	const sunset = forecast.sunset;

	const breakdown = {
		precipitation: scorePrecipitation(hourData.precipitationProbability),
		temperature: scoreTemperature(hourData.temperature),
		wind: scoreWind(hourData.windSpeed),
		humidity: scoreHumidity(hourData.humidity),
		cloudCover: scoreCloudCover(hourData.cloudCover),
		goldenHour: scoreGoldenHour(hour, sunset),
		uvIndex: scoreUvIndex(hourData.uvIndex),
	};

	const score = Math.round(
		breakdown.precipitation * WEIGHTS.precipitation +
			breakdown.temperature * WEIGHTS.temperature +
			breakdown.wind * WEIGHTS.wind +
			breakdown.humidity * WEIGHTS.humidity +
			breakdown.cloudCover * WEIGHTS.cloudCover +
			breakdown.goldenHour * WEIGHTS.goldenHour +
			breakdown.uvIndex * WEIGHTS.uvIndex,
	);

	let verdict: Verdict;
	if (score >= 70) {
		verdict = "SI";
	} else if (score >= 40) {
		verdict = "MAYBE";
	} else {
		verdict = "NO";
	}

	return {
		verdict,
		score,
		weather: {
			temperature: hourData.temperature,
			feelsLike: hourData.feelsLike,
			precipitationProbability: hourData.precipitationProbability,
			windSpeed: hourData.windSpeed,
			windDirection: hourData.windDirection,
			humidity: hourData.humidity,
			cloudCover: hourData.cloudCover,
			uvIndex: hourData.uvIndex,
			weatherCode: hourData.weatherCode,
		},
		sunset: sunset.includes("T") ? sunset.split("T")[1].substring(0, 5) : sunset,
	};
}
