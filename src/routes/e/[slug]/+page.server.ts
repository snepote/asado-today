import { error } from "@sveltejs/kit";
import { getEventById, getGuestsByEventId } from "$lib/server/db/queries";
import { buildShareUrl, buildWhatsAppUrl } from "$lib/server/events/share";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform, cookies, url }) => {
	const db = platform?.env?.DB;
	if (!db) error(500, "Service unavailable");

	const event = await getEventById(db, params.slug);
	if (!event) error(404, "Asado not found");

	const guests = await getGuestsByEventId(db, params.slug);
	const hostToken = cookies.get(`host_${params.slug}`);
	const isHost = hostToken === event.host_token;

	const shareUrl = buildShareUrl(url.origin, event.id);
	const whatsappUrl = buildWhatsAppUrl(
		url.origin,
		event.id,
		event.host_name,
		event.verdict as "SI" | "MAYBE" | "NO",
		event.location_label,
	);

	return {
		event: {
			id: event.id,
			hostName: event.host_name,
			date: event.date,
			time: event.time,
			locationLat: event.location_lat,
			locationLng: event.location_lng,
			locationLabel: event.location_label,
			verdict: event.verdict as "SI" | "MAYBE" | "NO",
			verdictScore: event.verdict_score,
			createdAt: event.created_at,
			expiresAt: event.expires_at,
		},
		guests: guests.map((g) => ({
			id: g.id,
			name: g.name,
			rsvp: g.rsvp,
			plusOnes: g.plus_ones,
			verdict: g.verdict as "SI" | "MAYBE" | "NO" | null,
			verdictScore: g.verdict_score,
		})),
		isHost,
		shareUrl,
		whatsappUrl,
	};
};
