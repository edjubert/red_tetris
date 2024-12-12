import { describe, test, vi } from 'vitest';
import { load } from './+page';

describe('load', () => {
	test('nominal', () => {
		load({ params: { restart: vi.fn(), room: 'hello', player: 'world' } });
	});
});
