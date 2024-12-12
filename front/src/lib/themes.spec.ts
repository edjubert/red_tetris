import { describe, test, expect } from 'vitest';
import { catppuccinThemes } from '$lib/themes';

describe('themes', () => {
	const themes = catppuccinThemes;
	test('latte', () => {
		expect(themes[0].name).toBe('latte');
	});
});
