<script lang="ts">
	import Countdown from '$lib/components/Countdown.svelte';
	import AttendeeList from '$lib/components/AttendeeList.svelte';
	import TrendIndicator from '$lib/components/TrendIndicator.svelte';
	import type { Verdict } from '$lib/types';

	let { data } = $props();

	const verdictLabels: Record<Verdict, string> = {
		SI: 'YES',
		MAYBE: 'MAYBE',
		NO: 'NO'
	};

	const verdictColors: Record<Verdict, string> = {
		SI: 'text-verdict-si',
		MAYBE: 'text-verdict-maybe',
		NO: 'text-verdict-no'
	};

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('en-GB', { weekday: 'long', month: 'short', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Live — {data.event.hostName}'s Asado</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center px-4 py-8">
	<div class="w-full max-w-md">
		<p class="text-center text-sm uppercase tracking-wide text-muted">
			{data.event.hostName}'s Asado
		</p>

		<p
			class="mt-6 text-center text-8xl font-black tracking-tighter {verdictColors[data.event.verdict]} sm:text-9xl"
		>
			{verdictLabels[data.event.verdict]}
		</p>

		{#if data.event.verdictScore != null}
			<p class="mt-2 text-center text-2xl font-medium text-muted">
				{data.event.verdictScore}/100
			</p>
		{/if}

		<div class="mt-4 flex justify-center">
			<TrendIndicator direction={data.trend.direction} delta={data.trend.delta} />
		</div>

		<div class="mt-8 flex flex-col items-center gap-2">
			<Countdown targetDate={data.event.date} targetTime={data.event.time} />
			<p class="text-sm text-muted">
				{formatDate(data.event.date)} at {data.event.time}
				{#if data.event.locationLabel}
					· {data.event.locationLabel}
				{/if}
			</p>
		</div>

		{#if data.guests.length > 0}
			<div class="mt-8">
				<AttendeeList guests={data.guests} />
			</div>
		{:else}
			<p class="mt-8 text-center text-muted">No RSVPs yet</p>
		{/if}

		<div class="mt-8 flex flex-col gap-3">
			<a
				href="/e/{data.event.id}/rsvp"
				class="inline-flex w-full items-center justify-center rounded-xl bg-verdict-si px-6 py-4 text-lg font-bold text-white transition-transform active:scale-95"
			>
				RSVP
			</a>

			<a
				href="/e/{data.event.id}"
				class="inline-flex w-full items-center justify-center rounded-xl border border-black/10 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
			>
				Details
			</a>
		</div>
	</div>
</div>
