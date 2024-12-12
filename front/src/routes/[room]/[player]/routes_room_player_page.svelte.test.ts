// @vitest-environment jsdom
import { describe, test, expect, vi, beforeAll } from 'vitest';
import { mount, unmount } from 'svelte';
import Page from './+page.svelte';
import { setupI18n } from '../../../services/i18n';
import { user } from '$lib/user';

vi.mock('socket.io-client', async () => {
	return {
		io: () => ({
			on: vi.fn(),
			removeListener: vi.fn(),
			emit: vi.fn()
		})
	};
});

describe('Page', () => {
	global.fetch = async (str: string | URL | globalThis.Request): Promise<Response> => ({
		...new Response(),
		json: () => Promise.resolve({ [str.toString()]: 'hello' })
	});

	beforeAll(() => {
		setupI18n();
	});

	test('nominal', async () => {
		const component = mount(Page, {
			target: document.body,
			props: { data: { handleRestart: vi.fn(), room: 'pouet', player: 'pouet' } }
		});
		user.set('pouet');
		expect(document.body.innerHTML).toBe(
			'<!----><!----> <!----> <!----> <!----> <!----> <!----> <!----> <main><div class="card svelte-14lga61"><h1>pouet</h1> <p></p> <p>medium-slow</p> <!----> <div class="action disabled svelte-14lga61"><button class="red-button slow false disabled svelte-14lga61"><img class="svelte-14lga61" src="/icons/game-mode/slow.png" alt="slow"></button><button class="red-button medium-slow isActive disabled svelte-14lga61"><img class="svelte-14lga61" src="/icons/game-mode/medium-slow.png" alt="medium-slow"></button><button class="red-button medium-fast false disabled svelte-14lga61"><img class="svelte-14lga61" src="/icons/game-mode/medium-fast.png" alt="medium-fast"></button><button class="red-button fast false disabled svelte-14lga61"><img class="svelte-14lga61" src="/icons/game-mode/fast.png" alt="fast"></button></div> <div class="action svelte-14lga61"><button class="red-button leave svelte-14lga61">room.leave</button> <!----></div></div> <p>room.waiting_to_start</p><!----><!----></main>'
		);
		unmount(component);
	});
});
