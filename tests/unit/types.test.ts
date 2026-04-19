import { describe, expect, it } from 'vitest';
import type { Verdict, VerdictResult } from '$lib/types';

describe('types', () => {
	it('verdict values are valid', () => {
		const verdicts: Verdict[] = ['SI', 'MAYBE', 'NO'];
		expect(verdicts).toHaveLength(3);
	});

	it('verdict result has all breakdown fields', () => {
		const result: VerdictResult = {
			verdict: 'SI',
			score: 85,
			breakdown: {
				precipitation: 95,
				temperature: 90,
				wind: 80,
				humidity: 75,
				cloudCover: 70,
				goldenHour: 100,
				uvIndex: 85
			}
		};
		expect(result.score).toBeGreaterThanOrEqual(0);
		expect(result.score).toBeLessThanOrEqual(100);
	});
});
