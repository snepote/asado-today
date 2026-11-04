import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			// Options SvelteKit does not own are forwarded to vite-plugin-svelte.
			preprocess: vitePreprocess(),
			onwarn(warning, handler) {
				if (
					warning.code === 'state_referenced_locally' &&
					warning.filename?.includes('generated/root.svelte')
				)
					return;
				handler(warning);
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}']
	}
});
