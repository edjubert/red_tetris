// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { mount, unmount } from 'svelte';
import Layout from '../routes/+layout.svelte';

describe('Input', () => {
	test('nominal', async () => {
		const component = mount(Layout, {
			target: document.body
		});
		expect(document.body.innerHTML).toBe(
			'<!----><!----><div class="top-navigation svelte-1f62nos"><a href="/" id="logo" class="svelte-1f62nos"><img alt="logo" src="/icons/tetris.png" class="svelte-1f62nos"></a> <select class="red-button svelte-ml111k"><option value="latte">latte</option><option value="frappe">frappe</option><option value="macchiato">macchiato</option><option value="mocha">mocha</option></select><!----></div><!----> <!---->'
		);
		unmount(component);
	});
});
