<script lang="ts">
	import type { Verdict } from '$lib/types';

	interface GuestSummary {
		id: string;
		name: string;
		rsvp: string;
		plusOnes: number;
		verdict: Verdict | null;
	}

	interface Props {
		guests: GuestSummary[];
	}

	let { guests }: Props = $props();

	const verdictDot: Record<string, string> = {
		SI: 'bg-verdict-si',
		MAYBE: 'bg-verdict-maybe',
		NO: 'bg-verdict-no'
	};

	const rsvpDot: Record<string, string> = {
		YES: 'bg-verdict-si',
		MAYBE: 'bg-verdict-maybe',
		NO: 'bg-verdict-no',
		PENDING: 'bg-muted'
	};

	const totalCount = $derived(guests.reduce((sum, g) => sum + 1 + g.plusOnes, 0));
	const yesCount = $derived(
		guests.filter((g) => g.rsvp === 'YES').reduce((sum, g) => sum + 1 + g.plusOnes, 0)
	);
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<p class="text-sm font-medium text-muted">
			{yesCount} confirmed · {totalCount} total
		</p>
	</div>

	<div class="flex flex-col gap-2">
		{#each guests as guest (guest.id)}
			<div class="flex items-center justify-between rounded-lg bg-black/5 px-4 py-3 dark:bg-white/5">
				<div class="flex items-center gap-3">
					<span
						class="inline-block h-3 w-3 rounded-full {guest.verdict
							? verdictDot[guest.verdict]
							: rsvpDot[guest.rsvp]}"
					></span>
					<span class="font-medium"
						>{guest.name}{guest.plusOnes > 0 ? ` +${guest.plusOnes}` : ''}</span
					>
				</div>
				<span class="text-sm text-muted">
					{guest.rsvp === 'YES'
						? 'In'
						: guest.rsvp === 'MAYBE'
							? 'Maybe'
							: guest.rsvp === 'NO'
								? 'Out'
								: 'Pending'}
				</span>
			</div>
		{/each}
	</div>
</div>
