<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import type { Verdict, VerdictResult } from '$lib/types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	const verdictLabels: Record<Verdict, string> = {
		SI: 'SÍ',
		MAYBE: 'MMMMM',
		NO: 'NO'
	};

	const verdictColors: Record<Verdict, string> = {
		SI: 'text-verdict-si',
		MAYBE: 'text-verdict-maybe',
		NO: 'text-verdict-no'
	};

	let selectedRsvp = $state('');
	let plusOnes = $state(0);
	let submitting = $state(false);

	let guestVerdict = $state<VerdictResult | null>(null);
	let loadingVerdict = $state(false);

	async function fetchGuestVerdict() {
		if (!navigator.geolocation) return;

		loadingVerdict = true;
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					const res = await fetch('/api/verdict', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
							date: data.event.date,
							time: data.event.time
						})
					});
					if (res.ok) {
						guestVerdict = await res.json();
					}
				} catch {
					// verdict is optional
				}
				loadingVerdict = false;
			},
			() => {
				loadingVerdict = false;
			},
			{ enableHighAccuracy: false, timeout: 10000 }
		);
	}

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
	}
</script>

<svelte:head>
	<title>RSVP — Asado de {data.event.hostName}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center px-4 py-8">
	<div class="w-full max-w-md">
		<p class="text-center text-sm uppercase tracking-wide text-muted">
			Asado de {data.event.hostName}
		</p>

		<p class="mt-4 text-center text-6xl font-black tracking-tighter {verdictColors[data.event.verdict]} sm:text-7xl">
			{verdictLabels[data.event.verdict]}
		</p>

		<p class="mt-2 text-center text-muted">
			{formatDate(data.event.date)} a las {data.event.time}
			{#if data.event.locationLabel}
				· {data.event.locationLabel}
			{/if}
		</p>

		{#if guestVerdict}
			<div class="mt-6 rounded-xl border border-black/10 p-4 dark:border-white/10">
				<p class="text-sm text-muted">Tu pronóstico</p>
				<p class="text-3xl font-bold {verdictColors[guestVerdict.verdict]}">
					{verdictLabels[guestVerdict.verdict]} <span class="text-lg font-normal text-muted">{guestVerdict.score}/100</span>
				</p>
			</div>
		{:else}
			<button
				type="button"
				onclick={fetchGuestVerdict}
				disabled={loadingVerdict}
				class="mt-6 w-full rounded-lg border border-black/10 px-4 py-3 text-sm transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
			>
				{loadingVerdict ? 'Consultando...' : 'Ver mi pronóstico'}
			</button>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
			class="mt-8 flex flex-col gap-4"
		>
			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium">Tu nombre</span>
				<input
					type="text"
					name="name"
					required
					placeholder="Juan"
					class="rounded-lg border border-black/10 bg-transparent px-4 py-3 text-base outline-none focus:ring-2 focus:ring-verdict-si dark:border-white/10"
				/>
			</label>

			<div>
				<span class="text-sm font-medium">Vas?</span>
				<div class="mt-2 grid grid-cols-3 gap-2">
					{#each [
						{ value: 'YES', label: 'SÍ', color: 'bg-verdict-si' },
						{ value: 'MAYBE', label: 'Vemos', color: 'bg-verdict-maybe' },
						{ value: 'NO', label: 'No', color: 'bg-verdict-no' }
					] as option (option.value)}
						<button
							type="button"
							onclick={() => (selectedRsvp = option.value)}
							class="rounded-xl px-4 py-4 text-lg font-bold transition-all {selectedRsvp === option.value
								? `${option.color} text-white scale-105`
								: 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}"
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<input type="hidden" name="rsvp" value={selectedRsvp} />

			{#if selectedRsvp === 'YES'}
				<label class="flex items-center justify-between gap-2">
					<span class="text-sm font-medium">Vienen más?</span>
					<div class="flex items-center gap-3">
						<button
							type="button"
							onclick={() => (plusOnes = Math.max(0, plusOnes - 1))}
							class="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-lg font-bold dark:bg-white/5"
						>
							-
						</button>
						<span class="w-8 text-center text-lg font-medium">{plusOnes}</span>
						<button
							type="button"
							onclick={() => (plusOnes = Math.min(10, plusOnes + 1))}
							class="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-lg font-bold dark:bg-white/5"
						>
							+
						</button>
					</div>
				</label>
			{/if}

			<input type="hidden" name="plus_ones" value={plusOnes} />

			{#if form?.error}
				<p class="text-sm text-verdict-no">{form.error}</p>
			{/if}

			<button
				type="submit"
				disabled={!selectedRsvp || submitting}
				class="mt-2 rounded-xl bg-verdict-si px-6 py-4 text-lg font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
			>
				{submitting ? 'Enviando...' : 'Confirmar'}
			</button>
		</form>
	</div>
</div>
