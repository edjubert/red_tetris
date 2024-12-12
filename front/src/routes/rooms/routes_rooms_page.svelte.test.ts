// @vitest-environment jsdom
import { describe, test, expect, vi, beforeAll } from 'vitest';
import { mount, unmount } from 'svelte';
import Page from './+page.svelte';
import { setupI18n } from '../../services/i18n';

vi.mock('$app/navigation', () => {
	return {
		goto: vi.fn()
	};
});
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
			props: {}
		});
		expect(document.body.innerHTML).toBe(
			'<!----><!----> <!----> <main><div class="greetings svelte-kzih6p"><h1>rooms.hello undefined</h1></div> <div class="hflex svelte-kzih6p"><div class="card scores user-scores svelte-kzih6p"><h2>rooms.user_scores</h2> <!----> <p style="text-align: center">rooms.no_user_score</p><!----></div> <div class="vflex svelte-kzih6p"><form class="card create-room svelte-kzih6p"><h2>rooms.create_or_join_room</h2> <div><!----> <input class="red-input" maxlength="16" placeholder="rooms.roomname_placeholder"></div><!----> <button class="red-button svelte-kzih6p">rooms.create_or_join_button</button></form> <div class="card room-list svelte-kzih6p"><h2>rooms.room_list</h2> <!----> <p>rooms.no_room_available</p><!----></div></div> <div class="card scores best-scores svelte-kzih6p"><h2>rooms.best_scores</h2> <p style="text-align: center">rooms.no_best_score</p><!----> <!----></div></div></main>'
		);
		unmount(component);
	});
});
