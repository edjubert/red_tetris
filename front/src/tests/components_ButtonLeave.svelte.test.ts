// @vitest-environment jsdom
import { describe, test, expect, vi, beforeAll } from 'vitest';
import { mount, unmount } from 'svelte';
import ButtonLeave from '../components/ButtonLeave.svelte';
import { setupI18n } from '../services/i18n';

vi.mock('socket.io-client', async () => {
	return {
		io: () => ({
			on: vi.fn()
		})
	};
});

describe('ButtonLeave', () => {
	global.fetch = async (str: string | URL | globalThis.Request): Promise<Response> => ({
		...new Response(),
		json: () => Promise.resolve({ [str.toString()]: 'hello' })
	});

	beforeAll(() => {
		setupI18n();
	});

	test('nominal', async () => {
		const component = mount(ButtonLeave, {
			target: document.body
		});
		expect(document.body.innerHTML).toBe(
			'<button class="red-button svelte-1lebp0w">game.leave</button>'
		);
		unmount(component);
	});
});
