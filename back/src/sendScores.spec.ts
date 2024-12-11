import { vi, describe, test } from 'vitest';
import mariadb from 'mariadb';
// @ts-expect-error the library has an any that needs to be updated
import { SocketServerMock } from 'socket.io-mock-ts';
import { sendScores } from './sendScores';

vi.mock('mariadb', async () => {
	const actual = <Record<string, unknown>>await vi.importActual('mariadb');

	return {
		...actual,
		default: {
			createPool: () => ({
				getConnection: () => ({
					query: vi.fn()
				})
			})
		}
	};
});

describe('sendScore', () => {
	test('nominal', async () => {
		const pool = mariadb.createPool({
			host: 'localhost',
			user: 'bob',
			password: 'password',
			database: 'bob'
		});
		const conn = await pool.getConnection();
		const socket = new SocketServerMock();
		const username = 'bob';

		await sendScores(socket, conn, username);
	});
});
