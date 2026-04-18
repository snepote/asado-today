<script lang="ts">
	import type { TrendDirection } from '$lib/server/forecast/trend';

	interface Props {
		direction: TrendDirection;
		delta: number;
	}

	let { direction, delta }: Props = $props();

	const labels: Record<TrendDirection, string> = {
		improving: 'Mejorando',
		worsening: 'Empeorando',
		steady: 'Estable'
	};

	const colors: Record<TrendDirection, string> = {
		improving: 'text-verdict-si',
		worsening: 'text-verdict-no',
		steady: 'text-muted'
	};

	const arrows: Record<TrendDirection, string> = {
		improving: '↑',
		worsening: '↓',
		steady: '→'
	};
</script>

<div class="flex items-center gap-2 {colors[direction]}">
	<span class="text-xl">{arrows[direction]}</span>
	<span class="text-sm font-medium">
		{labels[direction]}
		{#if Math.abs(delta) > 3}
			<span class="text-xs text-muted">({delta > 0 ? '+' : ''}{delta} pts)</span>
		{/if}
	</span>
</div>
