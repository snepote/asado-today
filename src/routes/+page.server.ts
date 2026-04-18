import { fail, redirect } from "@sveltejs/kit";
import { createEvent } from "$lib/server/events/create";
import type { Actions } from "./$types";

export const actions = {
	default: async ({ request, platform, cookies }) => {
		const data = await request.formData();
		const hostName = data.get("host_name")?.toString()?.trim();
		const date = data.get("date")?.toString();
		const time = data.get("time")?.toString();
		const lat = data.get("lat")?.toString();
		const lng = data.get("lng")?.toString();
		const locationLabel = data.get("location_label")?.toString() || null;

		if (!hostName || !date || !time || !lat || !lng) {
			return fail(400, { error: "All fields are required" });
		}

		const latNum = Number.parseFloat(lat);
		const lngNum = Number.parseFloat(lng);

		if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
			return fail(400, { error: "Invalid location" });
		}

		const db = platform?.env?.DB;
		const kv = platform?.env?.KV;

		if (!db || !kv) {
			return fail(500, { error: "Service unavailable" });
		}

		const { id, hostToken } = await createEvent(
			db,
			kv,
			hostName,
			date,
			time,
			latNum,
			lngNum,
			locationLabel,
		);

		cookies.set(`host_${id}`, hostToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30,
		});

		redirect(303, `/e/${id}`);
	},
} satisfies Actions;
