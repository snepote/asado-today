import { error, fail, redirect } from "@sveltejs/kit";
import { getEventById } from "$lib/server/db/queries";
import { submitRsvp } from "$lib/server/guests/rsvp";
import type { Rsvp } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";

const VALID_RSVPS = new Set<string>(["YES", "MAYBE", "NO"]);

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform?.env?.DB;
	if (!db) error(500, "Servicio no disponible");

	const event = await getEventById(db, params.slug);
	if (!event) error(404, "Asado no encontrado");

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
	};
};

export const actions = {
	default: async ({ request, params, platform, cookies }) => {
		const db = platform?.env?.DB;
		if (!db) return fail(500, { error: "Servicio no disponible" });

		const data = await request.formData();
		const name = data.get("name")?.toString()?.trim();
		const rsvp = data.get("rsvp")?.toString()?.toUpperCase();
		const plusOnesStr = data.get("plus_ones")?.toString() ?? "0";
		const plusOnes = Number.parseInt(plusOnesStr, 10) || 0;

		if (!name) {
			return fail(400, { error: "Decinos tu nombre" });
		}

		if (!rsvp || !VALID_RSVPS.has(rsvp)) {
			return fail(400, { error: "Respuesta inválida" });
		}

		const guestToken = cookies.get(`guest_${params.slug}`);
		const result = await submitRsvp(db, params.slug, guestToken, name, rsvp as Rsvp, plusOnes);

		cookies.set(`guest_${params.slug}`, result.guestToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30,
		});

		redirect(303, `/e/${params.slug}`);
	},
} satisfies Actions;
