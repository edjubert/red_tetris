import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	// server: {
	// 	proxy: {
	// 		'http://localhost:3000': {
	// 			target: 'ws://localhost:5000',
	// 			ws: true
	// 		}
	// 	}
	// },

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
