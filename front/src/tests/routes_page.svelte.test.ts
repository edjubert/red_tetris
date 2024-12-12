// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { mount, unmount } from 'svelte';
import Page from '../routes/+page.svelte';

describe('page', () => {
	test('nominal', async () => {
		const component = mount(Page, {
			target: document.body
		});
		expect(document.body.innerHTML).toBe('<main class="main svelte-1m351uz"><!----></main>');
		unmount(component);
	});
});
