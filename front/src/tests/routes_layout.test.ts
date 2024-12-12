import { describe, expect, test } from 'vitest';
import { prerender } from '../routes/+layout';

describe('prerender', () => {
	test('should be false', () => {
		expect(prerender).toBeFalsy();
	});
});
