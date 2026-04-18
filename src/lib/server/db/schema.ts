export interface EventRow {
	id: string;
	host_name: string;
	host_token: string;
	date: string;
	time: string;
	location_lat: number;
	location_lng: number;
	location_label: string | null;
	verdict: string;
	verdict_score: number | null;
	created_at: string;
	expires_at: string;
	locked_at: string | null;
	reproposed_to: string | null;
}

export interface GuestRow {
	id: string;
	event_id: string;
	guest_token: string;
	name: string;
	rsvp: string;
	plus_ones: number;
	location_lat: number | null;
	location_lng: number | null;
	verdict: string | null;
	verdict_score: number | null;
	created_at: string;
	updated_at: string;
}

export interface ForecastSnapshotRow {
	id: number;
	event_id: string;
	location_lat: number;
	location_lng: number;
	captured_at: string;
	score: number;
	verdict: string;
	raw_data: string;
}
