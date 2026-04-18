import type { Verdict, VerdictResult } from "$lib/types";
import type { ForecastData, HourlyForecast } from "./types";

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

function scoreGoldenHour(eventTime: string, _eventDate: string, sunset: string): number {
	const eventHour = Number.parseInt(eventTime.split(":")[0], 10);
	const sunsetStr = sunset.includes("T") ? sunset.split("T")[1] : sunset;
	const sunsetHour = Number.parseInt(sunsetStr.split(":")[0], 10);

	const hoursBeforeSunset = sunsetHour - eventHour;

	if (hoursBeforeSunset >= 3) return 100;
	if (hoursBeforeSunset >= 1) return 70;
	if (hoursBeforeSunset >= 0) return 50;
	return 40;
}

function findClosestHour(forecast: ForecastData, date: string, time: string): HourlyForecast {
	const targetPrefix = `${date}T${time}`;
	const targetHour = `${date}T${time.split(":")[0]}:00`;

	const match = forecast.hourly.find((h) => h.time === targetPrefix || h.time === targetHour);

	if (match) return match;

	const targetDate = new Date(`${date}T${time}`);
	let closest = forecast.hourly[0];
	let minDiff = Number.POSITIVE_INFINITY;

	for (const h of forecast.hourly) {
		const diff = Math.abs(new Date(h.time).getTime() - targetDate.getTime());
		if (diff < minDiff) {
			minDiff = diff;
			closest = h;
		}
	}

	return closest;
}

export function computeVerdict(forecast: ForecastData, date: string, time: string): VerdictResult {
	const hour = findClosestHour(forecast, date, time);

	const breakdown = {
		precipitation: scorePrecipitation(hour.precipitationProbability),
		temperature: scoreTemperature(hour.temperature),
		wind: scoreWind(hour.windSpeed),
		humidity: scoreHumidity(hour.humidity),
		cloudCover: scoreCloudCover(hour.cloudCover),
		goldenHour: scoreGoldenHour(time, date, forecast.sunset),
		uvIndex: scoreUvIndex(hour.uvIndex),
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

	return { verdict, score, breakdown };
}
