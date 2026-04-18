<script lang="ts">
	import type { Verdict, VerdictResult } from '$lib/types';

	interface Props {
		result: VerdictResult;
	}

	let { result }: Props = $props();

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
</script>

<div class="flex flex-col items-center gap-4">
	<p class="text-8xl font-black tracking-tighter {verdictColors[result.verdict]} sm:text-9xl">
		{verdictLabels[result.verdict]}
	</p>
	<p class="text-2xl font-medium text-muted">
		{result.score}/100
	</p>
	<div class="mt-4 grid w-full max-w-sm grid-cols-2 gap-2 text-sm">
		<div class="flex justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
			<span>Rain</span>
			<span class="font-medium">{result.breakdown.precipitation}</span>
		</div>
		<div class="flex justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
			<span>Temp</span>
			<span class="font-medium">{result.breakdown.temperature}</span>
		</div>
		<div class="flex justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
			<span>Wind</span>
			<span class="font-medium">{result.breakdown.wind}</span>
		</div>
		<div class="flex justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
			<span>Humidity</span>
			<span class="font-medium">{result.breakdown.humidity}</span>
		</div>
		<div class="flex justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
			<span>Clouds</span>
			<span class="font-medium">{result.breakdown.cloudCover}</span>
		</div>
		<div class="flex justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
			<span>Sun</span>
			<span class="font-medium">{result.breakdown.goldenHour}</span>
		</div>
	</div>
</div>
