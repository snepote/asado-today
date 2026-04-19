<script lang="ts">
	import WeatherIcon from './WeatherIcon.svelte';

	let {
		city,
		temperature,
		weatherKind = 'sun',
		onask,
		onsettings,
	}: {
		city: string;
		temperature: number;
		weatherKind?: 'sun' | 'cloud' | 'rain';
		onask: () => void;
		onsettings: () => void;
	} = $props();

	const dayShort = new Date()
		.toLocaleDateString('en-US', { weekday: 'short' })
		.toUpperCase();

	const weatherLabel = $derived(
		weatherKind === 'sun' ? 'Clear · light breeze' : weatherKind === 'cloud' ? 'Partly cloudy' : 'Rain expected'
	);

	const buttonSize = 220;
	const ringSize = buttonSize + 22;
</script>

<div class="absolute inset-0 flex flex-col bg-cream pt-[52px]">
	<!-- Top strip -->
	<div class="flex items-center justify-between px-[22px] mt-1">
		<span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute">
			{dayShort} · {Math.round(temperature)}°
		</span>
		<span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute flex items-center gap-1.5">
			<span
				class="inline-block w-1.5 h-1.5 rounded-full bg-[#c3462e]"
				style="animation: shimmer 1.8s ease-in-out infinite;"
			></span>
			{city.toUpperCase()}
		</span>
	</div>

	<!-- Weather mini strip -->
	<div class="flex items-center justify-center gap-2 mt-2.5">
		<WeatherIcon kind={weatherKind} size={14} color="var(--color-ink-soft)" />
		<span class="font-sans text-xs text-ink-soft tracking-wide">
			{weatherLabel}
		</span>
	</div>

	<div class="flex-1"></div>

	<!-- Central button -->
	<div class="flex justify-center relative">
		<button
			onclick={onask}
			class="rounded-full border-none p-0 cursor-pointer relative overflow-hidden"
			style="
				width: {buttonSize}px;
				height: {buttonSize}px;
				background: radial-gradient(circle at 35% 30%, #3d2a1c 0%, #1c120a 70%);
				color: #f7d9a6;
				box-shadow: 0 24px 44px -18px rgba(43,29,20,0.55), inset 0 0 40px rgba(255,170,90,0.10);
				animation: pulse-ember 3.6s ease-in-out infinite;
			"
		>
			<span
				class="font-display italic block text-[36px] leading-none"
				style="color: #f7d9a6;"
			>
				Asado
			</span>
			<span
				class="font-display italic block text-[36px] leading-[1.15]"
				style="color: #f7d9a6;"
			>
				today?
			</span>
			<span
				class="font-mono block mt-3 text-[9px] tracking-[0.22em] uppercase"
				style="color: #f7d9a6; opacity: 0.55;"
			>
				TAP TO ASK
			</span>
		</button>

		<!-- Decorative ring -->
		<svg
			width={ringSize}
			height={ringSize}
			class="absolute -top-[11px] pointer-events-none"
			viewBox="0 0 {ringSize} {ringSize}"
		>
			<circle
				cx={ringSize / 2}
				cy={ringSize / 2}
				r={buttonSize / 2 + 4}
				fill="none"
				stroke="rgba(43,29,20,0.18)"
				stroke-width="1.5"
				stroke-dasharray="4 6"
			/>
		</svg>
	</div>

	<div class="flex-1"></div>

	<!-- Bottom link -->
	<div class="text-center pb-[42px]">
		<button
			onclick={onsettings}
			class="font-sans text-sm text-ink-soft border-b border-dashed border-ink/35 pb-0.5 cursor-pointer
				hover:text-ink hover:border-ink transition-colors duration-200 bg-transparent border-t-0 border-x-0"
		>
			Another day or place?
		</button>
	</div>
</div>
