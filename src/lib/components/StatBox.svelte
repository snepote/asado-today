<script lang="ts">
	let { label, value }: { label: string; value: string } = $props();
</script>

<div class="bg-white rounded-[14px] p-[10px_12px] flex-1">
	<div class="font-mono text-[9px] tracking-[0.22em] uppercase text-ink-mute">
		{label}
	</div>
	<div class="font-sans mt-[3px] text-[18px] font-semibold text-ink tracking-tight">
		{value}
	</div>
</div>
