export type Verdict = "SI" | "MAYBE" | "NO";

export interface VerdictResult {
	verdict: Verdict;
	score: number;
	weather: {
		temperature: number;
		feelsLike: number;
		precipitationProbability: number;
		windSpeed: number;
		windDirection: number;
		humidity: number;
		cloudCover: number;
		uvIndex: number;
		weatherCode: number;
	};
	sunset: string;
}
