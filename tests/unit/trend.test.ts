import { describe, expect, it } from "vitest";
import { computeTrend } from "$lib/server/forecast/trend";
import type { ForecastSnapshotRow } from "$lib/server/db/schema";

function makeSnapshot(score: number, minutesAgo: number): ForecastSnapshotRow {
	const captured = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
	return {
		id: Math.random(),
		event_id: "test",
		location_lat: -34.6,
		location_lng: -58.4,
		captured_at: captured,
		score,
		verdict: score >= 70 ? "SI" : score >= 40 ? "MAYBE" : "NO",
		raw_data: "{}",
	};
}

describe("computeTrend", () => {
	it("returns steady for single snapshot", () => {
		const trend = computeTrend([makeSnapshot(75, 30)]);
		expect(trend.direction).toBe("steady");
		expect(trend.delta).toBe(0);
	});

	it("returns improving when score increases", () => {
		const snapshots = [makeSnapshot(50, 60), makeSnapshot(65, 45), makeSnapshot(80, 30)];
		const trend = computeTrend(snapshots);
		expect(trend.direction).toBe("improving");
		expect(trend.delta).toBe(30);
	});

	it("returns worsening when score decreases", () => {
		const snapshots = [makeSnapshot(85, 60), makeSnapshot(70, 45), makeSnapshot(55, 30)];
		const trend = computeTrend(snapshots);
		expect(trend.direction).toBe("worsening");
		expect(trend.delta).toBe(-30);
	});

	it("returns steady for small changes", () => {
		const snapshots = [makeSnapshot(75, 60), makeSnapshot(77, 30)];
		const trend = computeTrend(snapshots);
		expect(trend.direction).toBe("steady");
	});

	it("returns steady for empty snapshots", () => {
		const trend = computeTrend([]);
		expect(trend.direction).toBe("steady");
		expect(trend.delta).toBe(0);
	});
});
