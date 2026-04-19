import type { VerdictResult } from "$lib/types";
import { cacheForecast, getCachedForecast } from "./cache";
import { fetchForecast } from "./open-meteo";
import { computeVerdict } from "./verdict";

export async function getVerdict(
	lat: number,
	lng: number,
	date: string,
	time: string,
	kv: KVNamespace,
): Promise<VerdictResult> {
	const hour = time.split(":")[0];

	let forecast = await getCachedForecast(kv, lat, lng, date, hour);

	if (!forecast) {
		forecast = await fetchForecast(lat, lng);
		await cacheForecast(kv, lat, lng, date, hour, forecast);
	}

	return computeVerdict(forecast, date, time);
}

export { fetchForecast } from "./open-meteo";
export { computeVerdict } from "./verdict";
