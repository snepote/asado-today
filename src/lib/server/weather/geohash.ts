const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

export function encodeGeohash(lat: number, lng: number, precision = 5): string {
	let minLat = -90;
	let maxLat = 90;
	let minLng = -180;
	let maxLng = 180;
	let hash = "";
	let isLng = true;
	let bit = 0;
	let charIndex = 0;

	while (hash.length < precision) {
		if (isLng) {
			const mid = (minLng + maxLng) / 2;
			if (lng >= mid) {
				charIndex = (charIndex << 1) | 1;
				minLng = mid;
			} else {
				charIndex = charIndex << 1;
				maxLng = mid;
			}
		} else {
			const mid = (minLat + maxLat) / 2;
			if (lat >= mid) {
				charIndex = (charIndex << 1) | 1;
				minLat = mid;
			} else {
				charIndex = charIndex << 1;
				maxLat = mid;
			}
		}

		isLng = !isLng;
		bit++;

		if (bit === 5) {
			hash += BASE32[charIndex];
			bit = 0;
			charIndex = 0;
		}
	}

	return hash;
}
