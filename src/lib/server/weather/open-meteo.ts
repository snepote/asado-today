import type { ForecastData, HourlyForecast, OpenMeteoResponse } from "./types";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchForecast(lat: number, lng: number): Promise<ForecastData> {
	const params = new URLSearchParams({
		latitude: lat.toString(),
		longitude: lng.toString(),
		hourly: [
			"temperature_2m",
			"apparent_temperature",
			"precipitation_probability",
			"cloudcover",
			"relative_humidity_2m",
			"uv_index",
			"windspeed_10m",
			"winddirection_10m",
			"weathercode",
		].join(","),
		daily: "sunset",
		timezone: "auto",
		forecast_days: "7",
	});

	const response = await fetch(`${BASE_URL}?${params}`);

	if (!response.ok) {
		throw new Error(`Open-Meteo API error: ${response.status}`);
	}

	const data: OpenMeteoResponse = await response.json();
	return parseForecastResponse(data);
}

function parseForecastResponse(data: OpenMeteoResponse): ForecastData {
	const hourly: HourlyForecast[] = data.hourly.time.map((time, i) => ({
		time,
		temperature: data.hourly.temperature_2m[i],
		feelsLike: data.hourly.apparent_temperature[i],
		precipitationProbability: data.hourly.precipitation_probability[i],
		cloudCover: data.hourly.cloudcover[i],
		humidity: data.hourly.relative_humidity_2m[i],
		uvIndex: data.hourly.uv_index[i],
		windSpeed: data.hourly.windspeed_10m[i],
		windDirection: data.hourly.winddirection_10m[i],
		weatherCode: data.hourly.weathercode[i],
	}));

	return {
		hourly,
		sunset: data.daily.sunset[0],
	};
}
