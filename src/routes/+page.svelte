<script lang="ts">
	interface WeatherData {
		temperature: number;
		condition: string;
		icon: string;
	}

	let weather = $state<WeatherData | null>(null);
	let city = $state('');
	let dayLabel = $state('');

	function getWeatherIcon(icon: string): string {
		switch (icon) {
			case 'sun':
				return '☀️';
			case 'cloud':
				return '☁️';
			case 'rain':
				return '🌧️';
			case 'snow':
				return '❄️';
			case 'storm':
				return '⛈️';
			default:
				return '☀️';
		}
	}

	function getDayLabel(): string {
		return new Date().toLocaleDateString('en', { weekday: 'short' });
	}

	$effect(() => {
		dayLabel = getDayLabel();

		if (!navigator.geolocation) return;

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;

				try {
					const [weatherRes, geoRes] = await Promise.all([
						fetch(`/api/weather?lat=${latitude}&lng=${longitude}`),
						fetch(
							`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
						)
					]);

					if (weatherRes.ok) {
						weather = (await weatherRes.json()) as WeatherData;
					}

					if (geoRes.ok) {
						const geoData = (await geoRes.json()) as {
							address?: { city?: string; town?: string; village?: string };
						};
						city =
							geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
					}
				} catch {
					// weather chip is optional
				}
			},
			() => {
				// geolocation denied — chip stays hidden
			},
			{ enableHighAccuracy: false, timeout: 10000 }
		);
	});
</script>

<div class="flex min-h-screen flex-col">
	{#if weather}
		<div class="flex items-center justify-center gap-2 px-4 pt-4 text-sm text-muted">
			<span>{dayLabel}</span>
			<span class="text-xs">·</span>
			<span>{getWeatherIcon(weather.icon)} {weather.temperature}° {weather.condition}</span>
			{#if city}
				<span class="text-xs">·</span>
				<span>{city}</span>
			{/if}
		</div>
	{/if}

	<div class="flex flex-1 flex-col items-center justify-center gap-10 px-4">
		<div class="flex flex-col items-center gap-6">
			<span class="text-7xl sm:text-8xl" role="img" aria-label="Fire">🔥</span>
			<h1 class="text-5xl font-bold tracking-tight sm:text-7xl">Asado today?</h1>
		</div>

		<div class="flex flex-col items-center gap-4">
			<a
				href="/host"
				class="rounded-xl bg-verdict-si px-8 py-4 text-lg font-bold text-white transition-transform hover:brightness-110 active:scale-95"
			>
				Host an event
			</a>
			<a href="/join" class="text-muted transition-colors hover:text-text dark:hover:text-text-dark">
				Join an event &rarr;
			</a>
		</div>
	</div>
</div>
