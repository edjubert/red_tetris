// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest';
import { mount, unmount } from 'svelte';
import ThemeToggle from '../ThemeToggle.svelte';

const setTheme = vi.fn();

vi.mock('svelte', async () => {
	const actual = <Record<string, unknown>>await vi.importActual('svelte');

	return {
		...actual,
		getContext: () => ({ setTheme })
	};
});

describe('Input', () => {
	test('nominal', async () => {
		const component = mount(ThemeToggle, {
			target: document.body
		});
		expect(document.body.innerHTML).toBe(
			'<select class="red-button svelte-ml111k"><option value="latte">latte</option><option value="frappe">frappe</option><option value="macchiato">macchiato</option><option value="mocha">mocha</option></select>'
		);
		unmount(component);
	});
});
