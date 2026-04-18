<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-4">
	<p class="text-6xl font-black tracking-tighter text-verdict-no sm:text-8xl">
		{$page.status}
	</p>
	<p class="mt-4 text-lg text-muted">
		{$page.error?.message || 'Algo salió mal'}
	</p>
	<a
		href="/"
		class="mt-8 rounded-xl bg-verdict-si px-6 py-3 font-bold text-white transition-transform active:scale-95"
	>
		Volver al inicio
	</a>
</div>
