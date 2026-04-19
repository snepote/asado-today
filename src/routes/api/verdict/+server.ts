import { error, json } from "@sveltejs/kit";
import { fetchForecast } from "$lib/server/weather/open-meteo";
import { computeVerdict } from "$lib/server/weather/verdict";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
	const lat = url.searchParams.get("lat");
	const lng = url.searchParams.get("lng");
	const date = url.searchParams.get("date");
	const hour = url.searchParams.get("hour");

	if (!lat || !lng) {
		error(400, "lat and lng are required");
	}

	const latitude = Number.parseFloat(lat);
	const longitude = Number.parseFloat(lng);

	if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
		error(400, "Invalid coordinates");
	}

	const now = new Date();
	const targetDate = date ?? now.toISOString().split("T")[0];
	const targetHour = hour ? Number.parseInt(hour, 10) : now.getHours();

	const forecast = await fetchForecast(latitude, longitude);
	const result = computeVerdict(forecast, targetDate, targetHour);

	return json(result);
};
