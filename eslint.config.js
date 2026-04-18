import svelte from 'eslint-plugin-svelte';

export default [
	...svelte.configs.recommended,
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/prefer-svelte-reactivity': 'off'
		}
	},
	{
		ignores: ['node_modules/', '.svelte-kit/', 'build/', '.wrangler/']
	}
];
