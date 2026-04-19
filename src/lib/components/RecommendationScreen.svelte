<script lang="ts">
	import WeatherIcon from './WeatherIcon.svelte';
	import StatBox from './StatBox.svelte';
	import type { VerdictResult } from '$lib/types';

	let {
		result,
		city,
		onback,
		onsettings,
	}: {
		result: VerdictResult;
		city: string;
		onback: () => void;
		onsettings: () => void;
	} = $props();

	const verdictMap = {
		SI: {
			word: 'Sí',
			lead: 'Light the fire.',
			copy: 'Clear skies, warm air, a soft breeze from the east. Conditions hold through the evening.',
			accent: '#1f5a3f',
			ring: '#a7c9b2',
			icon: 'sun' as const,
		},
		MAYBE: {
			word: 'Tal vez',
			lead: 'Could go either way.',
			copy: 'Watch the sky — conditions might shift. Have a backup plan or move dinner indoors if needed.',
			accent: '#a0600d',
			ring: '#e0a94a',
			icon: 'cloud' as const,
		},
		NO: {
			word: 'No',
			lead: 'Not today.',
			copy: 'Weather conditions are not ideal. Try another day — the forecast might be kinder.',
			accent: '#a03420',
			ring: '#d98b75',
			icon: 'rain' as const,
		},
	};

	const v = $derived(verdictMap[result.verdict]);

	const now = new Date();
	const dayShort = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
	const dateShort = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
	const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

	const windDirection = $derived(() => {
		const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
		const idx = Math.round(result.weather.windDirection / 45) % 8;
		return dirs[idx];
	});
</script>

<div class="absolute inset-0 flex flex-col bg-cream pt-[52px]">
	<!-- Back + Live -->
	<div class="flex items-center justify-between px-5">
		<button
			onclick={onback}
			aria-label="Go back"
			class="bg-transparent border-none p-0 cursor-pointer text-ink"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
				<path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
		<div class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute flex items-center gap-1.5">
			<span
				class="inline-block w-1.5 h-1.5 rounded-full"
				style="background: {v.accent}; animation: shimmer 1.6s ease-in-out infinite;"
			></span>
			LIVE
		</div>
	</div>

	<!-- Date/time/place -->
	<div
		class="font-mono text-[9.5px] tracking-[0.22em] uppercase text-ink-mute text-center mt-2"
		style="animation: fade-up 0.5s ease-out both; animation-delay: 0.05s;"
	>
		{dayShort} · {dateShort} · {time} · {city.toUpperCase()}
	</div>

	<!-- Circular icon -->
	<div class="flex justify-center mt-3.5" style="animation: fade-up 0.5s ease-out both; animation-delay: 0.1s;">
		<div
			class="w-[138px] h-[138px] rounded-full flex items-center justify-center"
			style="
				background: {v.ring};
				box-shadow: inset 0 0 0 2px {v.accent}44, 0 10px 30px -14px {v.accent}88;
			"
		>
			<WeatherIcon kind={v.icon} color={v.accent} size={68} />
		</div>
	</div>

	<!-- Verdict word -->
	<div
		class="font-display italic text-center leading-none mt-3"
		style="
			font-size: {v.word.length > 3 ? 52 : 72}px;
			color: {v.accent};
			animation: fade-up 0.5s ease-out both;
			animation-delay: 0.2s;
		"
	>
		{v.word}
	</div>

	<!-- Copy -->
	<div
		class="font-sans text-center px-10 pt-2 text-[13px] leading-[1.45] text-ink-soft"
		style="animation: fade-up 0.5s ease-out both; animation-delay: 0.3s;"
	>
		<span class="font-semibold text-ink">{v.lead}</span>
		&nbsp;{v.copy}
	</div>

	<!-- Stats grid -->
	<div
		class="grid grid-cols-2 gap-2 px-5 pt-4"
		style="animation: fade-up 0.5s ease-out both; animation-delay: 0.4s;"
	>
		<StatBox label="PRECIPITATION" value="{result.weather.precipitationProbability}%" />
		<StatBox label="FEELS LIKE" value="{Math.round(result.weather.feelsLike)}°" />
		<StatBox label="WIND" value="{Math.round(result.weather.windSpeed)} km/h {windDirection()}" />
		<StatBox label="HUMIDITY" value="{result.weather.humidity}%" />
	</div>

	<!-- Sunset row -->
	<div
		class="flex items-center justify-between mx-5 mt-2.5 px-3.5 py-2.5 rounded-[14px] text-white"
		style="
			background: linear-gradient(90deg, #2e1a52 0%, #6a2a56 55%, #d16a3c 100%);
			animation: fade-up 0.5s ease-out both;
			animation-delay: 0.45s;
		"
	>
		<div>
			<div class="font-mono text-[9px] tracking-[0.22em] uppercase text-white/65">
				SUNSET TONIGHT
			</div>
			<div class="font-sans text-[15px] font-semibold mt-0.5">
				{result.sunset}
			</div>
		</div>
		<div class="flex items-center gap-1.5 font-sans text-[10.5px] text-white/75 tracking-wide">
			<svg width="12" height="12" viewBox="0 0 14 14">
				<circle cx="7" cy="9" r="3" fill="#ffd89e" />
				<path d="M2 11h10" stroke="#ffd89e" stroke-width="1.2" stroke-linecap="round" />
				<path d="M7 2v3M3 4l1.5 1.5M11 4l-1.5 1.5" stroke="#ffd89e" stroke-width="1.2" stroke-linecap="round" />
			</svg>
			GOLDEN HOUR
		</div>
	</div>

	<div class="flex-1"></div>

	<!-- Bottom link -->
	<div class="text-center pb-10">
		<button
			onclick={onsettings}
			class="font-sans text-sm text-ink-soft border-b border-dashed border-ink/35 pb-0.5 cursor-pointer
				hover:text-ink hover:border-ink transition-colors duration-200 bg-transparent border-t-0 border-x-0"
		>
			Another day or place?
		</button>
	</div>
</div>
