// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { mount, unmount } from 'svelte';
import ThemeContext from '../ThemeContext.svelte';

describe('Input', () => {
	test('nominal', async () => {
		const component = mount(ThemeContext, {
			target: document.body
		});
		expect(document.body.innerHTML).toBe('<!---->');
		unmount(component);
	});
});
