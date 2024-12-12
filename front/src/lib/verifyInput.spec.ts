import { describe, expect, test } from 'vitest';
import { verifyInput } from '$lib/verifyInput';

describe('verifyInput', () => {
	test('nominal', () => {
		const input = verifyInput('valid');
		expect(input.err).toBeUndefined();
		expect(input.valid).toBe(true);
	});
});
