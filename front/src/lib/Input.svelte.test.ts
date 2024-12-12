// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { mount, unmount } from 'svelte';
import Input from '$lib/Input.svelte';

describe('Input', () => {
	test('nominal', async () => {
		const component = mount(Input, {
			target: document.body,
			props: { verify: () => {}, maxlength: '16', placeholder: '' }
		});
		expect(document.body.innerHTML).toBe(
			'<div><!----> <input class="red-input" maxlength="16" placeholder=""></div>'
		);
		unmount(component);
	});
});
