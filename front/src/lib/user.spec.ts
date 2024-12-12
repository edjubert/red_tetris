import { describe, expectTypeOf, expect, test, vi } from 'vitest';
import { connected, muted, room, user, writableLocalStorage } from '$lib/user';

describe('user', () => {
	test('user', () => {
		expectTypeOf(user).toBeObject();
	});
	test('room', () => {
		expectTypeOf(room).toBeObject();
	});
	test('connected', () => {
		expectTypeOf(connected).toBeObject();
	});
	test('muted', () => {
		expectTypeOf(muted).toBeObject();
	});

	const setItem = vi.fn();
	// @ts-expect-error only for mocking purpose
	global.localStorage = {
		...global.Storage,
		getItem: (key: string): string | null => {
			return key;
		},
		setItem
	};

	test('empty writableLocalStorage', () => {
		writableLocalStorage(user, '');
		expect(setItem.mock.calls.length).toBe(0);
	});
	test('writableLocalStorage', () => {
		writableLocalStorage(user, 'key');
		expect(setItem.mock.calls.length).toBe(2);
	});
});
