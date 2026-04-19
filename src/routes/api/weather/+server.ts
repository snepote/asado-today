import { json } from "@sveltejs/kit";
import { fetchForecast } from "$lib/server/weather";
import type { RequestHandler } from "./$types";

interface WeatherChip {
	temperature: number;
	condition: string;
	icon: string;
}

function weatherCodeToCondition(code: number): { condition: string; icon: string } {
	if (code === 0) return { condition: "Clear", icon: "sun" };
	if (code <= 3) return { condition: "Cloudy", icon: "cloud" };
	if (code <= 48) return { condition: "Fog", icon: "cloud" };
	if (code <= 57) return { condition: "Drizzle", icon: "rain" };
	if (code <= 67) return { condition: "Rain", icon: "rain" };
	if (code <= 77) return { condition: "Snow", icon: "snow" };
	if (code <= 82) return { condition: "Showers", icon: "rain" };
	if (code <= 86) return { condition: "Snow", icon: "snow" };
	if (code <= 99) return { condition: "Storm", icon: "storm" };
	return { condition: "Unknown", icon: "cloud" };
}

export const GET: RequestHandler = async ({ url }) => {
	const lat = url.searchParams.get("lat");
	const lng = url.searchParams.get("lng");

	if (!lat || !lng) {
		return json({ error: "Missing lat/lng" }, { status: 400 });
	}

	const latNum = Number.parseFloat(lat);
	const lngNum = Number.parseFloat(lng);

	if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
		return json({ error: "Invalid lat/lng" }, { status: 400 });
	}

	const forecast = await fetchForecast(latNum, lngNum);
	const now = new Date();
	const currentHour = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:00`;

	const hourData = forecast.hourly.find((h) => h.time === currentHour) ?? forecast.hourly[0];
	const { condition, icon } = weatherCodeToCondition(hourData.weatherCode);

	const result: WeatherChip = {
		temperature: Math.round(hourData.temperature),
		condition,
		icon,
	};

	return json(result);
};
