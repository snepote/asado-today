export type Verdict = "SI" | "MAYBE" | "NO";

export type Rsvp = "YES" | "MAYBE" | "NO" | "PENDING";

export interface AsadoEvent {
	id: string;
	host_name: string;
	date: string;
	time: string;
	location_lat: number;
	location_lng: number;
	location_label: string | null;
	verdict: Verdict;
	verdict_score: number | null;
	created_at: string;
	expires_at: string;
	locked_at: string | null;
	reproposed_to: string | null;
}

export interface Guest {
	id: string;
	event_id: string;
	name: string;
	rsvp: Rsvp;
	plus_ones: number;
	location_lat: number | null;
	location_lng: number | null;
	verdict: Verdict | null;
	verdict_score: number | null;
	created_at: string;
	updated_at: string;
}

export interface ForecastSnapshot {
	id: number;
	event_id: string;
	location_lat: number;
	location_lng: number;
	captured_at: string;
	score: number;
	verdict: Verdict;
	raw_data: string;
}

export interface VerdictResult {
	verdict: Verdict;
	score: number;
	breakdown: {
		precipitation: number;
		temperature: number;
		wind: number;
		humidity: number;
		cloudCover: number;
		goldenHour: number;
		uvIndex: number;
	};
}
