<script lang="ts">
	import WeatherIcon from './WeatherIcon.svelte';

	let {
		city,
		dateStr,
		onupdatecity,
		onupdatedate,
		ondone,
		onback,
	}: {
		city: string;
		dateStr: string;
		onupdatecity: (city: string) => void;
		onupdatedate: (date: string) => void;
		ondone: () => void;
		onback: () => void;
	} = $props();

	let step = $state(0);
	let localCity = $derived(city);

	const cities = ['Palermo', 'Buenos Aires', 'Montevideo', 'Barcelona', 'Milan', 'Lisbon'];

	function next() {
		if (step === 0) {
			onupdatecity(localCity);
			step = 1;
		} else {
			ondone();
		}
	}

	function goBack() {
		if (step === 0) {
			onback();
		} else {
			step = 0;
		}
	}

	const days = (() => {
		const out: Date[] = [];
		const today = new Date();
		for (let i = 0; i < 7; i++) {
			const d = new Date(today);
			d.setDate(today.getDate() + i);
			out.push(d);
		}
		return out;
	})();

	function dayLabel(d: Date, i: number): string {
		if (i === 0) return 'Today';
		if (i === 1) return 'Tomorrow';
		return d.toLocaleDateString('en-US', { weekday: 'long' });
	}

	function dayIcon(i: number): 'sun' | 'cloud' | 'rain' {
		const kinds: Array<'sun' | 'cloud' | 'rain'> = ['sun', 'cloud', 'rain'];
		return kinds[i % 3];
	}

	function dayIconColor(i: number): string {
		const kind = dayIcon(i);
		if (kind === 'sun') return '#2f6b4e';
		if (kind === 'cloud') return '#c88a1a';
		return '#c3462e';
	}

	const temps = ['22°', '19°', '24°', '20°', '17°', '21°', '23°'];
</script>

<div class="absolute inset-0 flex flex-col bg-cream pt-[52px]">
	<!-- Header -->
	<div class="flex items-center justify-between px-[22px]">
		<button onclick={goBack} aria-label="Go back" class="bg-transparent border-none p-0 cursor-pointer">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<path d="M15 6l-6 6 6 6" stroke="var(--color-ink)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
		<span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute">
			STEP {step + 1} / 2
		</span>
		<div class="w-[22px]"></div>
	</div>

	<!-- Progress dots -->
	<div class="flex justify-center gap-1.5 mt-3.5">
		{#each [0, 1] as i (i)}
			<span
				class="h-1.5 rounded-full transition-all duration-250"
				style="width: {i === step ? 22 : 6}px; background: {i === step ? 'var(--color-ink)' : 'rgba(43,29,20,0.22)'};"
			></span>
		{/each}
	</div>

	<!-- Title -->
	<div class="font-display italic text-center px-7 pt-10 text-[40px] leading-[1.05] text-ink">
		{step === 0 ? 'Where are you?' : 'Which day?'}
	</div>
	<div class="font-sans text-center px-10 pt-2.5 text-sm text-ink-soft">
		{step === 0 ? "We'll fetch the local forecast." : 'Pick any day in the next week.'}
	</div>

	<!-- Step content -->
	<div class="flex-1 px-[22px] pt-8 overflow-auto">
		{#if step === 0}
			<!-- Auto-detect card -->
			<div class="bg-white rounded-2xl p-[14px_16px] flex items-center gap-3 mb-3">
				<div class="w-9 h-9 rounded-full bg-[rgba(195,70,46,0.1)] flex items-center justify-center shrink-0">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="7" r="2.6" stroke="#c3462e" stroke-width="1.6" />
						<path
							d="M8 14c3-3.5 4.5-5.4 4.5-7.8A4.5 4.5 0 008 2a4.5 4.5 0 00-4.5 4.2C3.5 8.6 5 10.5 8 14z"
							stroke="#c3462e" stroke-width="1.6" stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<div class="font-mono text-[9.5px] tracking-[0.22em] uppercase text-ink-mute">AUTO · CURRENT</div>
					<div class="font-sans text-base text-ink mt-0.5 font-medium">{localCity}</div>
				</div>
				<span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2f6b4e]">ACTIVE</span>
			</div>

			<!-- Search input -->
			<input
				bind:value={localCity}
				placeholder="Or type a city…"
				class="w-full box-border p-[14px_16px] rounded-2xl border-none bg-white/50 text-base text-ink
					outline-none shadow-[inset_0_0_0_1px_rgba(43,29,20,0.08)] mb-4 font-sans"
			/>

			<!-- Recent cities -->
			<div class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-2.5 pl-1">RECENT</div>
			<div class="flex flex-wrap gap-2">
				{#each cities as c (c)}
					<button
						onclick={() => { localCity = c; }}
						class="font-sans py-2.5 px-3.5 rounded-full border-none cursor-pointer text-sm font-medium transition-all duration-150"
						style="background: {c === localCity ? 'var(--color-ink)' : '#fff'}; color: {c === localCity ? 'var(--color-cream)' : 'var(--color-ink)'};"
					>
						{c}
					</button>
				{/each}
			</div>
		{:else}
			<!-- Day picker -->
			<div class="flex flex-col gap-2">
				{#each days as d, i (d.toDateString())}
					{@const selected = dateStr === d.toDateString()}
					{@const kind = dayIcon(i)}
					<button
						onclick={() => onupdatedate(d.toDateString())}
						class="flex items-center gap-3.5 p-[14px_16px] rounded-2xl border-none cursor-pointer text-left transition-all duration-150"
						style="background: {selected ? 'var(--color-ink)' : '#fff'}; color: {selected ? 'var(--color-cream)' : 'var(--color-ink)'};"
					>
						<div
							class="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0"
							style="background: {selected ? 'rgba(255,255,255,0.08)' : 'rgba(43,29,20,0.05)'};"
						>
							<WeatherIcon {kind} size={22} color={selected ? 'var(--color-cream)' : dayIconColor(i)} />
						</div>
						<div class="flex-1">
							<div class="font-sans text-base font-medium">{dayLabel(d, i)}</div>
							<div
								class="font-sans text-xs mt-0.5"
								style="color: {selected ? 'rgba(244,228,207,0.6)' : 'var(--color-ink-mute)'};"
							>
								{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
							</div>
						</div>
						<span
							class="font-mono text-[9.5px] tracking-[0.22em] uppercase"
							style="color: {selected ? 'rgba(244,228,207,0.5)' : 'var(--color-ink-mute)'};"
						>
							{temps[i]}
						</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Next / Done button -->
	<div class="px-[22px] pb-9 pt-4">
		<button
			onclick={next}
			class="w-full py-4 rounded-full border-none bg-ink text-cream text-[15px] font-medium
				tracking-wide cursor-pointer font-sans"
		>
			{step === 0 ? 'Next — pick a day' : 'See the verdict'}
		</button>
	</div>
</div>
