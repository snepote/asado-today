export interface OpenMeteoHourly {
	time: string[];
	temperature_2m: number[];
	apparent_temperature: number[];
	precipitation_probability: number[];
	cloudcover: number[];
	relative_humidity_2m: number[];
	uv_index: number[];
	windspeed_10m: number[];
	winddirection_10m: number[];
	weathercode: number[];
}

export interface OpenMeteoDaily {
	time: string[];
	sunset: string[];
}

export interface OpenMeteoResponse {
	latitude: number;
	longitude: number;
	timezone: string;
	hourly: OpenMeteoHourly;
	daily: OpenMeteoDaily;
}

export interface HourlyForecast {
	time: string;
	temperature: number;
	feelsLike: number;
	precipitationProbability: number;
	cloudCover: number;
	humidity: number;
	uvIndex: number;
	windSpeed: number;
	windDirection: number;
	weatherCode: number;
}

export interface ForecastData {
	hourly: HourlyForecast[];
	sunset: string;
}
