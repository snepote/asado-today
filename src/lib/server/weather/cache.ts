import { encodeGeohash } from "./geohash";
import type { ForecastData } from "./types";

const CACHE_TTL = 900;

function buildKey(lat: number, lng: number, date: string, hour: string): string {
	const geohash = encodeGeohash(lat, lng, 5);
	return `weather:${geohash}:${date}:${hour}`;
}

export async function getCachedForecast(
	kv: KVNamespace,
	lat: number,
	lng: number,
	date: string,
	hour: string,
): Promise<ForecastData | null> {
	const key = buildKey(lat, lng, date, hour);
	const cached = await kv.get(key, "text");
	if (!cached) return null;
	return JSON.parse(cached) as ForecastData;
}

export async function cacheForecast(
	kv: KVNamespace,
	lat: number,
	lng: number,
	date: string,
	hour: string,
	data: ForecastData,
): Promise<void> {
	const key = buildKey(lat, lng, date, hour);
	await kv.put(key, JSON.stringify(data), { expirationTtl: CACHE_TTL });
}
