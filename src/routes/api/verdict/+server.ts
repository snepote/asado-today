import { json } from "@sveltejs/kit";
import { getVerdict } from "$lib/server/weather";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, platform }) => {
	const kv = platform?.env?.KV;
	if (!kv) {
		return json({ error: "Service unavailable" }, { status: 500 });
	}

	const body = (await request.json()) as {
		lat?: number;
		lng?: number;
		date?: string;
		time?: string;
	};

	if (!body.lat || !body.lng || !body.date || !body.time) {
		return json({ error: "Missing required fields: lat, lng, date, time" }, { status: 400 });
	}

	const result = await getVerdict(body.lat, body.lng, body.date, body.time, kv);
	return json(result);
};
