// @vitest-environment jsdom
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { mount, unmount } from 'svelte';
import ButtonRestart from '../components/ButtonRestart.svelte';
import { setupI18n } from '../services/i18n';

vi.mock('socket.io-client', async () => {
	return {
		io: () => ({
			on: vi.fn()
		})
	};
});

describe('ButtonRestart', () => {
	global.fetch = async (str: string | URL | globalThis.Request): Promise<Response> => ({
		...new Response(),
		json: () => Promise.resolve({ [str.toString()]: 'hello' })
	});

	beforeAll(() => {
		setupI18n();
	});

	test('nominal', async () => {
		const component = mount(ButtonRestart, {
			target: document.body,
			props: { roomname: 'pouet' }
		});
		expect(document.body.innerHTML).toBe('<button class="red-button">game.restart</button>');
		unmount(component);
	});
});
