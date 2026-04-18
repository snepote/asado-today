<script lang="ts">
	import ShareCard from '$lib/components/ShareCard.svelte';
	import type { Verdict } from '$lib/types';

	let { data } = $props();

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

	const rsvpColors: Record<string, string> = {
		YES: 'bg-verdict-si',
		MAYBE: 'bg-verdict-maybe',
		NO: 'bg-verdict-no',
		PENDING: 'bg-muted'
	};

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
	}

	const totalGuests = $derived(
		data.guests.reduce((sum, g) => sum + 1 + g.plusOnes, 0)
	);
</script>

<svelte:head>
	<title>Asado de {data.event.hostName} — {verdictLabels[data.event.verdict]}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center px-4 py-8">
	<div class="w-full max-w-md">
		<p class="text-center text-sm uppercase tracking-wide text-muted">
			Asado de {data.event.hostName}
		</p>

		<p class="mt-6 text-center text-8xl font-black tracking-tighter {verdictColors[data.event.verdict]} sm:text-9xl">
			{verdictLabels[data.event.verdict]}
		</p>

		{#if data.event.verdictScore != null}
			<p class="mt-2 text-center text-2xl font-medium text-muted">
				{data.event.verdictScore}/100
			</p>
		{/if}

		<div class="mt-8 flex flex-col items-center gap-1 text-center">
			<p class="text-lg font-medium">{formatDate(data.event.date)} a las {data.event.time}</p>
			{#if data.event.locationLabel}
				<p class="text-muted">{data.event.locationLabel}</p>
			{/if}
		</div>

		{#if data.guests.length > 0}
			<div class="mt-8">
				<p class="text-sm font-medium text-muted">
					{totalGuests} {totalGuests === 1 ? 'persona' : 'personas'}
				</p>
				<div class="mt-2 flex flex-col gap-2">
					{#each data.guests as guest (guest.id)}
						<div class="flex items-center justify-between rounded-lg bg-black/5 px-4 py-3 dark:bg-white/5">
							<span>{guest.name}{guest.plusOnes > 0 ? ` +${guest.plusOnes}` : ''}</span>
							<span class="inline-block h-3 w-3 rounded-full {rsvpColors[guest.rsvp]}"></span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.isHost}
			<div class="mt-8">
				<ShareCard
					shareUrl={data.shareUrl}
					whatsappUrl={data.whatsappUrl}
					verdict={data.event.verdict}
				/>
			</div>
		{:else}
			<div class="mt-8">
				<a
					href="/e/{data.event.id}/rsvp"
					class="inline-flex w-full items-center justify-center rounded-xl bg-verdict-si px-6 py-4 text-lg font-bold text-white transition-transform active:scale-95"
				>
					Responder
				</a>
			</div>
		{/if}

		<div class="mt-4">
			<a
				href="/e/{data.event.id}/live"
				class="inline-flex w-full items-center justify-center rounded-xl border border-black/10 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
			>
				Ver en vivo
			</a>
		</div>
	</div>
</div>
