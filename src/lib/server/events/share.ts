import type { Verdict } from "$lib/types";

const VERDICT_EMOJI: Record<Verdict, string> = {
	SI: "\u{1F525}",
	MAYBE: "\u{1F914}",
	NO: "\u{2614}",
};

export function buildShareUrl(origin: string, eventId: string): string {
	return `${origin}/e/${eventId}`;
}

export function buildWhatsAppUrl(
	origin: string,
	eventId: string,
	hostName: string,
	verdict: Verdict,
	locationLabel: string | null,
): string {
	const emoji = VERDICT_EMOJI[verdict];
	const location = locationLabel ? ` at ${locationLabel}` : "";
	const url = buildShareUrl(origin, eventId);
	const text = `${emoji} ${hostName}'s Asado${location} — ${verdict === "SI" ? "IT'S ON" : verdict === "NO" ? "not today" : "maybe..."}\n${url}`;
	return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
