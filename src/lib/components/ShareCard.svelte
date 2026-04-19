<script lang="ts">
	import type { Verdict } from '$lib/types';

	interface Props {
		shareUrl: string;
		whatsappUrl: string;
		verdict: Verdict;
	}

	let { shareUrl, whatsappUrl, verdict }: Props = $props();

	let copied = $state(false);

	async function copyLink() {
		await navigator.clipboard.writeText(shareUrl);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex flex-col items-center gap-4">
	<a
		href={whatsappUrl}
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-lg font-bold text-white transition-transform active:scale-95"
	>
		Share on WhatsApp
	</a>

	<button
		onclick={copyLink}
		class="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-current/10 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
	>
		{copied ? 'Copied!' : 'Copy link'}
	</button>

	<p class="text-xs text-muted">
		{shareUrl}
	</p>
</div>
