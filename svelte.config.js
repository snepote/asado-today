import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	onwarn(warning, handler) {
		if (warning.code === 'state_referenced_locally' && warning.filename?.includes('generated/root.svelte')) return;
		handler(warning);
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
