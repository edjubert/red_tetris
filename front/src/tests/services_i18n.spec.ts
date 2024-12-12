import { describe, test, expect } from 'vitest';
import { getLocale, setupI18n } from '../services/i18n';

describe('i18n', () => {
	describe('getLocale', () => {
		test('nominal', () => {
			const locale = getLocale();
			expect(locale).toBe('en');
		});
	});

	describe('setupI18n', () => {
		global.fetch = async (str: string | URL | globalThis.Request): Promise<Response> => ({
			...new Response(),
			json: () => Promise.resolve({ [str.toString()]: 'hello' })
		});

		test('nominal', async () => {
			await setupI18n();
		});
	});
});
