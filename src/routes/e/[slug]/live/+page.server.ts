import { error } from "@sveltejs/kit";
import { getEventById, getGuestsByEventId, getSnapshotsByEventId } from "$lib/server/db/queries";
import { computeTrend } from "$lib/server/forecast/trend";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform, cookies }) => {
	const db = platform?.env?.DB;
	if (!db) error(500, "Service unavailable");

	const event = await getEventById(db, params.slug);
	if (!event) error(404, "Asado not found");

	const [guests, snapshots] = await Promise.all([
		getGuestsByEventId(db, params.slug),
		getSnapshotsByEventId(db, params.slug),
	]);

	const trend = computeTrend(snapshots);
	const hostToken = cookies.get(`host_${params.slug}`);
	const isHost = hostToken === event.host_token;

	return {
		event: {
			id: event.id,
			hostName: event.host_name,
			date: event.date,
			time: event.time,
			locationLabel: event.location_label,
			verdict: event.verdict as "SI" | "MAYBE" | "NO",
			verdictScore: event.verdict_score,
		},
		guests: guests.map((g) => ({
			id: g.id,
			name: g.name,
			rsvp: g.rsvp,
			plusOnes: g.plus_ones,
			verdict: g.verdict as "SI" | "MAYBE" | "NO" | null,
			verdictScore: g.verdict_score,
		})),
		trend,
		isHost,
	};
};
