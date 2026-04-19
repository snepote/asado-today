<script lang="ts">
	import HomeScreen from '$lib/components/HomeScreen.svelte';
	import RecommendationScreen from '$lib/components/RecommendationScreen.svelte';
	import SettingsScreen from '$lib/components/SettingsScreen.svelte';
	import type { VerdictResult } from '$lib/types';

	type Screen = 'home' | 'recommendation' | 'settings';

	let screen = $state<Screen>('home');
	let city = $state('Detecting...');
	let temperature = $state(23);
	let weatherKind = $state<'sun' | 'cloud' | 'rain'>('sun');
	let verdictResult = $state<VerdictResult | null>(null);
	let loading = $state(false);
	let coords = $state<{ lat: number; lng: number } | null>(null);
	let selectedDate = $state(new Date().toDateString());
	let geoError = $state(false);

	function weatherCodeToKind(code: number): 'sun' | 'cloud' | 'rain' {
		if (code <= 1) return 'sun';
		if (code <= 48) return 'cloud';
		return 'rain';
	}

	async function fetchVerdict(lat: number, lng: number, date?: string) {
		loading = true;
		try {
			const params = new URLSearchParams({
				lat: lat.toString(),
				lng: lng.toString(),
			});
			if (date) {
				const d = new Date(date);
				params.set('date', d.toISOString().split('T')[0]);
			}

			const res = await fetch(`/api/verdict?${params}`);
			if (!res.ok) throw new Error('Failed to fetch verdict');

			verdictResult = await res.json();
			if (verdictResult) {
				temperature = verdictResult.weather.temperature;
				weatherKind = weatherCodeToKind(verdictResult.weather.weatherCode);
			}
		} catch {
			verdictResult = null;
		} finally {
			loading = false;
		}
	}

	async function detectLocation() {
		if (!navigator.geolocation) {
			geoError = true;
			screen = 'settings';
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				try {
					const res = await fetch(
						`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
					);
					const data: { city?: string; locality?: string } = await res.json();
					city = data.city || data.locality || 'Unknown';
				} catch {
					city = 'Unknown';
				}
				await fetchVerdict(pos.coords.latitude, pos.coords.longitude);
			},
			() => {
				geoError = true;
				city = 'Buenos Aires';
				coords = { lat: -34.6037, lng: -58.3816 };
				screen = 'settings';
			}
		);
	}

	$effect(() => {
		detectLocation();
	});

	async function handleAsk() {
		if (!coords) {
			screen = 'settings';
			return;
		}
		if (!verdictResult) {
			await fetchVerdict(coords.lat, coords.lng, selectedDate);
		}
		if (verdictResult) {
			screen = 'recommendation';
		}
	}

	function handleUpdateCity(newCity: string) {
		city = newCity;
		const cityCoords: Record<string, { lat: number; lng: number }> = {
			'Palermo': { lat: -34.5875, lng: -58.4261 },
			'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
			'Montevideo': { lat: -34.9011, lng: -56.1645 },
			'Barcelona': { lat: 41.3874, lng: 2.1686 },
			'Milan': { lat: 45.4642, lng: 9.19 },
			'Lisbon': { lat: 38.7223, lng: -9.1393 },
		};
		const match = cityCoords[newCity];
		if (match) {
			coords = match;
		}
	}

	function handleUpdateDate(date: string) {
		selectedDate = date;
	}

	async function handleSettingsDone() {
		if (coords) {
			verdictResult = null;
			await fetchVerdict(coords.lat, coords.lng, selectedDate);
			screen = 'recommendation';
		}
	}
</script>

<svelte:head>
	<title>Asado Today</title>
	<meta name="description" content="Should you fire up the grill today?" />
</svelte:head>

<div class="h-dvh w-full bg-cream md:bg-cream-deep flex items-center justify-center overflow-hidden font-sans">
	<div class="h-full w-full max-w-md bg-cream md:rounded-2xl md:shadow-lg md:my-8 md:h-[min(100%,800px)] relative">
		{#if loading}
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<div
						class="w-12 h-12 border-4 border-ink/20 border-t-ink rounded-full mx-auto"
						style="animation: spin 1s linear infinite;"
					></div>
					<p class="font-sans text-sm text-ink-soft mt-4">Reading the sky...</p>
				</div>
			</div>
		{:else if screen === 'home'}
			<HomeScreen
				{city}
				{temperature}
				{weatherKind}
				onask={handleAsk}
				onsettings={() => { screen = 'settings'; }}
			/>
		{:else if screen === 'recommendation' && verdictResult}
			<RecommendationScreen
				result={verdictResult}
				{city}
				onback={() => { screen = 'home'; }}
				onsettings={() => { screen = 'settings'; }}
			/>
		{:else}
			<SettingsScreen
				{city}
				dateStr={selectedDate}
				onupdatecity={handleUpdateCity}
				onupdatedate={handleUpdateDate}
				ondone={handleSettingsDone}
				onback={() => { screen = 'home'; }}
			/>
		{/if}
	</div>
</div>
