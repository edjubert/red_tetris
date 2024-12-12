import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,

	test: {
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		server: {
			deps: {
				inline: ['socket.io-client', 'engine.io-client']
			}
		}
	}
});
