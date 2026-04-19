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

<div
	class="min-h-dvh w-full flex items-center justify-center p-4 font-sans relative overflow-hidden transition-[background] duration-600"
	style="background: radial-gradient(ellipse 80% 60% at 50% 0%, #2e1a52 0%, #4d2352 30%, #8a2f4a 60%, #d16a3c 90%, #f0a25b 100%);"
>
	<!-- Stardust -->
	<div
		aria-hidden="true"
		class="absolute inset-0 pointer-events-none"
		style="background: radial-gradient(1px 1px at 20% 15%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(1px 1px at 72% 12%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(1px 1px at 40% 8%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(1px 1px at 85% 22%, rgba(255,255,255,0.45), transparent 50%), radial-gradient(1px 1px at 12% 30%, rgba(255,255,255,0.3), transparent 50%);"
	></div>

	<!-- Phone frame -->
	<div class="relative w-[390px] max-w-full" style="aspect-ratio: 390 / 760;">
		<div
			class="absolute inset-0 rounded-[48px] overflow-hidden shadow-2xl"
			style="background: var(--color-cream); border: 1px solid rgba(0,0,0,0.08);"
		>
			<!-- Status bar -->
			<div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 pt-3">
				<span class="text-ink text-sm font-semibold">9:41</span>
				<div class="w-[120px] h-[32px] bg-black rounded-full"></div>
				<div class="flex items-center gap-1">
					<svg width="16" height="12" viewBox="0 0 16 12" fill="var(--color-ink)">
						<rect x="0" y="6" width="3" height="6" rx="0.5" />
						<rect x="4.5" y="4" width="3" height="8" rx="0.5" />
						<rect x="9" y="1" width="3" height="11" rx="0.5" />
						<rect x="13" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
					</svg>
					<svg width="15" height="12" viewBox="0 0 15 12" fill="var(--color-ink)">
						<path d="M7.5 3.6c1.8 0 3.4.7 4.6 1.9l1.4-1.4C11.8 2.4 9.7 1.6 7.5 1.6S3.2 2.4 1.5 4.1l1.4 1.4C4.1 4.3 5.7 3.6 7.5 3.6z" />
						<path d="M7.5 7.2c1 0 2 .4 2.7 1.1l1.4-1.4c-1.1-1.1-2.5-1.7-4.1-1.7s-3 .6-4.1 1.7l1.4 1.4c.7-.7 1.7-1.1 2.7-1.1z" />
						<circle cx="7.5" cy="10.5" r="1.5" />
					</svg>
					<svg width="24" height="12" viewBox="0 0 24 12" fill="var(--color-ink)">
						<rect x="0" y="1" width="20" height="10" rx="2" stroke="var(--color-ink)" stroke-width="1" fill="none" />
						<rect x="21" y="3.5" width="2" height="5" rx="0.5" />
						<rect x="1.5" y="2.5" width="17" height="7" rx="1" />
					</svg>
				</div>
			</div>

			<!-- Screen content -->
			{#if loading}
				<div class="absolute inset-0 flex items-center justify-center bg-cream">
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

		<!-- Home indicator -->
		<div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-ink/20 z-10"></div>
	</div>
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
