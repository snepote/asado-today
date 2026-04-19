import type { ForecastSnapshotRow } from "$lib/server/db/schema";

export type TrendDirection = "improving" | "worsening" | "steady";

export interface Trend {
	direction: TrendDirection;
	delta: number;
}

export function computeTrend(snapshots: ForecastSnapshotRow[]): Trend {
	if (snapshots.length < 2) {
		return { direction: "steady", delta: 0 };
	}

	const first = snapshots[0];
	const latest = snapshots[snapshots.length - 1];
	const delta = latest.score - first.score;

	let direction: TrendDirection;
	if (delta > 3) {
		direction = "improving";
	} else if (delta < -3) {
		direction = "worsening";
	} else {
		direction = "steady";
	}

	return { direction, delta };
}
