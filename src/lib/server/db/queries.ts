import type { EventRow, ForecastSnapshotRow, GuestRow } from "./schema";

export async function insertEvent(
	db: D1Database,
	event: Omit<EventRow, "created_at">,
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO events (id, host_name, host_token, date, time, location_lat, location_lng, location_label, verdict, verdict_score, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			event.id,
			event.host_name,
			event.host_token,
			event.date,
			event.time,
			event.location_lat,
			event.location_lng,
			event.location_label,
			event.verdict,
			event.verdict_score,
			event.expires_at,
		)
		.run();
}

export async function getEventById(db: D1Database, id: string): Promise<EventRow | null> {
	return db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first<EventRow>();
}

export async function updateEventVerdict(
	db: D1Database,
	id: string,
	verdict: string,
	score: number,
): Promise<void> {
	await db
		.prepare("UPDATE events SET verdict = ?, verdict_score = ? WHERE id = ?")
		.bind(verdict, score, id)
		.run();
}

export async function insertGuest(
	db: D1Database,
	guest: Omit<GuestRow, "created_at" | "updated_at">,
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO guests (id, event_id, guest_token, name, rsvp, plus_ones, location_lat, location_lng, verdict, verdict_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			guest.id,
			guest.event_id,
			guest.guest_token,
			guest.name,
			guest.rsvp,
			guest.plus_ones,
			guest.location_lat,
			guest.location_lng,
			guest.verdict,
			guest.verdict_score,
		)
		.run();
}

export async function getGuestsByEventId(db: D1Database, eventId: string): Promise<GuestRow[]> {
	const result = await db
		.prepare("SELECT * FROM guests WHERE event_id = ? ORDER BY created_at ASC")
		.bind(eventId)
		.all<GuestRow>();
	return result.results;
}

export async function getGuestByToken(
	db: D1Database,
	eventId: string,
	guestToken: string,
): Promise<GuestRow | null> {
	return db
		.prepare("SELECT * FROM guests WHERE event_id = ? AND guest_token = ?")
		.bind(eventId, guestToken)
		.first<GuestRow>();
}

export async function updateGuestRsvp(
	db: D1Database,
	id: string,
	rsvp: string,
	plusOnes: number,
	name: string,
): Promise<void> {
	await db
		.prepare(
			"UPDATE guests SET rsvp = ?, plus_ones = ?, name = ?, updated_at = datetime('now') WHERE id = ?",
		)
		.bind(rsvp, plusOnes, name, id)
		.run();
}

export async function updateGuestVerdict(
	db: D1Database,
	id: string,
	verdict: string,
	score: number,
	lat: number,
	lng: number,
): Promise<void> {
	await db
		.prepare(
			"UPDATE guests SET verdict = ?, verdict_score = ?, location_lat = ?, location_lng = ?, updated_at = datetime('now') WHERE id = ?",
		)
		.bind(verdict, score, lat, lng, id)
		.run();
}

export async function insertForecastSnapshot(
	db: D1Database,
	snapshot: Omit<ForecastSnapshotRow, "id" | "captured_at">,
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO forecast_snapshots (event_id, location_lat, location_lng, score, verdict, raw_data)
       VALUES (?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			snapshot.event_id,
			snapshot.location_lat,
			snapshot.location_lng,
			snapshot.score,
			snapshot.verdict,
			snapshot.raw_data,
		)
		.run();
}

export async function getSnapshotsByEventId(
	db: D1Database,
	eventId: string,
): Promise<ForecastSnapshotRow[]> {
	const result = await db
		.prepare("SELECT * FROM forecast_snapshots WHERE event_id = ? ORDER BY captured_at ASC")
		.bind(eventId)
		.all<ForecastSnapshotRow>();
	return result.results;
}
