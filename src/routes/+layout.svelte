<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Asado Today</title>
	<meta name="description" content="Decidí si hoy se hace asado" />
</svelte:head>

<div class="min-h-screen">
	{@render children()}
</div>
