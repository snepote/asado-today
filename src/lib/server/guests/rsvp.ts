import { getGuestByToken, insertGuest, updateGuestRsvp } from "$lib/server/db/queries";
import { generateSlug, generateToken } from "$lib/server/slug";
import type { Rsvp } from "$lib/types";

export async function submitRsvp(
	db: D1Database,
	eventId: string,
	guestToken: string | undefined,
	name: string,
	rsvp: Rsvp,
	plusOnes: number,
): Promise<{ guestId: string; guestToken: string }> {
	const clampedPlusOnes = Math.max(0, Math.min(10, plusOnes));

	if (guestToken) {
		const existing = await getGuestByToken(db, eventId, guestToken);
		if (existing) {
			await updateGuestRsvp(db, existing.id, rsvp, clampedPlusOnes, name);
			return { guestId: existing.id, guestToken };
		}
	}

	const newToken = generateToken();
	const guestId = generateSlug();

	await insertGuest(db, {
		id: guestId,
		event_id: eventId,
		guest_token: newToken,
		name,
		rsvp,
		plus_ones: clampedPlusOnes,
		location_lat: null,
		location_lng: null,
		verdict: null,
		verdict_score: null,
	});

	return { guestId, guestToken: newToken };
}
