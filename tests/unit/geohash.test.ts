import { describe, expect, it } from "vitest";
import { encodeGeohash } from "$lib/server/weather/geohash";

describe("encodeGeohash", () => {
	it("encodes Buenos Aires correctly", () => {
		const hash = encodeGeohash(-34.6037, -58.3816, 5);
		expect(hash).toHaveLength(5);
		expect(hash).toBe("69y7p");
	});

	it("encodes a known location", () => {
		const hash = encodeGeohash(42.6, -5.6, 5);
		expect(hash).toHaveLength(5);
	});

	it("nearby points share prefix", () => {
		const hash1 = encodeGeohash(-34.6037, -58.3816, 5);
		const hash2 = encodeGeohash(-34.6050, -58.3800, 5);
		expect(hash1.substring(0, 3)).toBe(hash2.substring(0, 3));
	});

	it("distant points have different hashes", () => {
		const buenosAires = encodeGeohash(-34.6037, -58.3816, 5);
		const tokyo = encodeGeohash(35.6762, 139.6503, 5);
		expect(buenosAires).not.toBe(tokyo);
	});

	it("respects precision parameter", () => {
		const short = encodeGeohash(-34.6037, -58.3816, 3);
		const long = encodeGeohash(-34.6037, -58.3816, 7);
		expect(short).toHaveLength(3);
		expect(long).toHaveLength(7);
	});
});
