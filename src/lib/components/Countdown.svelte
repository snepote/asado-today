<script lang="ts">
	interface Props {
		targetDate: string;
		targetTime: string;
	}

	let { targetDate, targetTime }: Props = $props();

	let now = $state(Date.now());

	$effect(() => {
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(interval);
	});

	const target = $derived(new Date(`${targetDate}T${targetTime}`).getTime());
	const diff = $derived(Math.max(0, target - now));

	const days = $derived(Math.floor(diff / (1000 * 60 * 60 * 24)));
	const hours = $derived(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
	const minutes = $derived(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
	const seconds = $derived(Math.floor((diff % (1000 * 60)) / 1000));
	const isOver = $derived(diff === 0);
</script>

{#if isOver}
	<p class="text-lg font-medium text-muted">El asado ya empezó</p>
{:else}
	<div class="flex items-center gap-4 text-center">
		{#if days > 0}
			<div>
				<p class="text-3xl font-bold">{days}</p>
				<p class="text-xs text-muted">días</p>
			</div>
		{/if}
		<div>
			<p class="text-3xl font-bold">{String(hours).padStart(2, '0')}</p>
			<p class="text-xs text-muted">horas</p>
		</div>
		<div>
			<p class="text-3xl font-bold">{String(minutes).padStart(2, '0')}</p>
			<p class="text-xs text-muted">min</p>
		</div>
		<div>
			<p class="text-3xl font-bold">{String(seconds).padStart(2, '0')}</p>
			<p class="text-xs text-muted">seg</p>
		</div>
	</div>
{/if}
