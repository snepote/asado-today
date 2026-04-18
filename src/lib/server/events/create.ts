import { insertEvent, insertForecastSnapshot } from "$lib/server/db/queries";
import { generateSlug, generateToken } from "$lib/server/slug";
import { getVerdict } from "$lib/server/weather";

export async function createEvent(
	db: D1Database,
	kv: KVNamespace,
	hostName: string,
	date: string,
	time: string,
	lat: number,
	lng: number,
	locationLabel: string | null,
): Promise<{ id: string; hostToken: string }> {
	const id = generateSlug();
	const hostToken = generateToken();

	const verdictResult = await getVerdict(lat, lng, date, time, kv);

	const eventDate = new Date(`${date}T${time}`);
	const expiresAt = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000).toISOString();

	await insertEvent(db, {
		id,
		host_name: hostName,
		host_token: hostToken,
		date,
		time,
		location_lat: lat,
		location_lng: lng,
		location_label: locationLabel,
		verdict: verdictResult.verdict,
		verdict_score: verdictResult.score,
		expires_at: expiresAt,
		locked_at: null,
		reproposed_to: null,
	});

	await insertForecastSnapshot(db, {
		event_id: id,
		location_lat: lat,
		location_lng: lng,
		score: verdictResult.score,
		verdict: verdictResult.verdict,
		raw_data: JSON.stringify(verdictResult.breakdown),
	});

	return { id, hostToken };
}
