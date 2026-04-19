<script lang="ts">
	let { kind, color, size = 86 }: { kind: 'sun' | 'cloud' | 'rain'; color: string; size?: number } =
		$props();

	const sunRays = [0, 45, 90, 135, 180, 225, 270, 315];

	function rayCoords(angle: number) {
		const r = (angle * Math.PI) / 180;
		return {
			x1: 40 + Math.cos(r) * 22,
			y1: 40 + Math.sin(r) * 22,
			x2: 40 + Math.cos(r) * 32,
			y2: 40 + Math.sin(r) * 32,
		};
	}
</script>

{#if kind === 'sun'}
	<svg width={size} height={size} viewBox="0 0 80 80" fill="none">
		<circle cx="40" cy="40" r="14" fill={color} />
		{#each sunRays as angle (angle)}
			{@const c = rayCoords(angle)}
			<line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={color} stroke-width="3.2" stroke-linecap="round" />
		{/each}
	</svg>
{:else if kind === 'cloud'}
	<svg width={size} height={size} viewBox="0 0 80 80" fill="none">
		<path
			d="M22 52 C12 52 10 38 22 36 C22 26 40 22 44 32 C54 28 64 36 60 46 C66 46 68 56 58 56 L24 56 C22 56 22 52 22 52 Z"
			fill={color}
		/>
	</svg>
{:else}
	<svg width={size} height={size} viewBox="0 0 80 80" fill="none">
		<path
			d="M22 40 C12 40 10 28 22 26 C22 16 40 12 44 22 C54 18 64 26 60 36 C66 36 68 46 58 46 L24 46 C22 46 22 40 22 40 Z"
			fill={color}
		/>
		<line x1="28" y1="54" x2="24" y2="66" stroke={color} stroke-width="3" stroke-linecap="round" />
		<line x1="40" y1="54" x2="36" y2="66" stroke={color} stroke-width="3" stroke-linecap="round" />
		<line x1="52" y1="54" x2="48" y2="66" stroke={color} stroke-width="3" stroke-linecap="round" />
	</svg>
{/if}
