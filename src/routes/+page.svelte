<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let lat = $state('');
	let lng = $state('');
	let locationLabel = $state('');
	let locating = $state(false);
	let locationError = $state('');
	let submitting = $state(false);

	function today(): string {
		return new Date().toISOString().split('T')[0];
	}

	function nextHour(): string {
		const now = new Date();
		now.setHours(now.getHours() + 1, 0, 0, 0);
		return `${String(now.getHours()).padStart(2, '0')}:00`;
	}

	async function detectLocation() {
		locating = true;
		locationError = '';

		if (!navigator.geolocation) {
			locationError = 'Tu navegador no soporta geolocalización';
			locating = false;
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				lat = position.coords.latitude.toFixed(6);
				lng = position.coords.longitude.toFixed(6);

				try {
					const res = await fetch(
						`https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${lat}&longitude=${lng}&count=1&language=es`
					);
					const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`;
					const geocodeRes = await fetch(geocodeUrl);
					if (geocodeRes.ok) {
						const data = (await geocodeRes.json()) as {
							address?: { suburb?: string; city?: string; town?: string };
							display_name?: string;
						};
						locationLabel =
							data.address?.suburb ||
							data.address?.city ||
							data.address?.town ||
							data.display_name?.split(',')[0] ||
							'';
					}
				} catch {
					// location label is optional
				}

				locating = false;
			},
			(error) => {
				locationError = 'No pudimos obtener tu ubicación';
				locating = false;
			},
			{ enableHighAccuracy: false, timeout: 10000 }
		);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-4 py-8">
	<h1 class="text-5xl font-bold tracking-tight sm:text-7xl">Asado hoy?</h1>
	<p class="mt-2 text-lg text-muted">Vamos a averiguarlo.</p>

	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}}
		class="mt-8 flex w-full max-w-sm flex-col gap-4"
	>
		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium">Tu nombre</span>
			<input
				type="text"
				name="host_name"
				required
				placeholder="Martín"
				class="rounded-lg border border-black/10 bg-transparent px-4 py-3 text-base outline-none focus:ring-2 focus:ring-verdict-si dark:border-white/10"
			/>
		</label>

		<div class="grid grid-cols-2 gap-3">
			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium">Fecha</span>
				<input
					type="date"
					name="date"
					required
					value={today()}
					class="rounded-lg border border-black/10 bg-transparent px-4 py-3 text-base outline-none focus:ring-2 focus:ring-verdict-si dark:border-white/10"
				/>
			</label>
			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium">Hora</span>
				<input
					type="time"
					name="time"
					required
					value={nextHour()}
					class="rounded-lg border border-black/10 bg-transparent px-4 py-3 text-base outline-none focus:ring-2 focus:ring-verdict-si dark:border-white/10"
				/>
			</label>
		</div>

		<div class="flex flex-col gap-1">
			<span class="text-sm font-medium">Ubicación</span>
			<button
				type="button"
				onclick={detectLocation}
				disabled={locating}
				class="rounded-lg border border-black/10 px-4 py-3 text-left text-base transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
			>
				{#if locating}
					Buscando...
				{:else if lat}
					{locationLabel || `${lat}, ${lng}`}
				{:else}
					Usar mi ubicación
				{/if}
			</button>
			{#if locationError}
				<p class="text-sm text-verdict-no">{locationError}</p>
			{/if}
		</div>

		<input type="hidden" name="lat" value={lat} />
		<input type="hidden" name="lng" value={lng} />
		<input type="hidden" name="location_label" value={locationLabel} />

		{#if form?.error}
			<p class="text-sm text-verdict-no">{form.error}</p>
		{/if}

		<button
			type="submit"
			disabled={!lat || !lng || submitting}
			class="mt-2 rounded-xl bg-verdict-si px-6 py-4 text-lg font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
		>
			{submitting ? 'Consultando...' : 'Convocar'}
		</button>
	</form>
</div>
