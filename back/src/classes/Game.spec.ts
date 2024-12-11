import { describe, test, expect, it, vi } from 'vitest';
import { Game } from './Game';
import { Server } from 'socket.io';
import { Client } from './Client';
// @ts-expect-error the library has an any that needs to be updated
import { SocketServerMock } from 'socket.io-mock-ts';
import mariadb, { PoolConnection } from 'mariadb';

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

const addPlayerSocket =
	(socket: SocketServerMock, game: Game) =>
	(name: string): void => {
		socket.id = name;
		const client = new Client(socket);

		game.addPlayer(name, client);
		expect(game.players.get(client.id)?.name).toBe(name);
	};

describe('Game', () => {
	const gameName = 'hello';
	const gameMode = 'slow';

	it('should be initialized', async () => {
		const io = new Server({});
		const game = new Game(io, gameName, gameMode);

		expect(game.started).toBeFalsy();
		expect(game.players.size).toBe(0);
		expect(game.name).toBe(gameName);
		expect(game.owner).toBeUndefined();
		expect(game.gameMode).toBe(gameMode);

		expect(game['io']).toBe(io);
		expect(game['tickPerSeconds']).toBe(0);
		expect(game['gameOverList'].length).toBe(0);
	});

	describe('player management', () => {
		const io = new Server({});
		const game = new Game(io, gameName, gameMode);
		const socket1 = new SocketServerMock();
		const socket2 = new SocketServerMock();

		test('addPlayer', () => {
			socket1.on('addPlayer', addPlayerSocket(socket1, game));
			socket1.clientMock.emit('addPlayer', 'bob');

			socket2.on('addPlayer', addPlayerSocket(socket2, game));
			socket2.clientMock.emit('addPlayer', 'john');
		});

		test('getPlayersList', () => {
			const players = game.getPlayersList();

			expect(players.length).toBe(2);
			expect(players[0].name).toBe('bob');
			expect(players[1].name).toBe('john');
		});

		test('setOwner', () => {
			const players = game.getPlayersList();
			game.setOwner(players[0]);

			expect(game.owner).toBe(players[0]);
		});

		test('sendUsersList', () => {
			const usersList = game.sendUsersList();

			expect(usersList.length).toBe(2);
			expect(usersList[0]).toBe('bob (owner)');
			expect(usersList[1]).toBe('john');
		});

		test('removePlayer', async () => {
			const pool = mariadb.createPool({
				host: 'localhost',
				user: 'bob',
				password: 'password',
				database: 'bob'
			});
			const conn = await pool.getConnection();
			const player1 = game.getPlayersList()[0];
			const player2 = game.getPlayersList()[1];

			const newUserList = await game.removePlayer(conn as PoolConnection, player1.client);

			expect(conn.query).not.toBeCalled();
			expect(game.getPlayersList().length).toBe(1);
			expect(game.owner?.client.id).toBe(player2.client.id);
			expect(newUserList.length).toBe(1);
			expect(newUserList[0]).toBe('john (owner)');

			game.started = true;
			player2.score = 10;

			const finalUserList = await game.removePlayer(conn as PoolConnection, player2.client);
			expect(conn.query).toBeCalled();
			expect(game.getPlayersList().length).toBe(0);
			expect(game.owner?.client.id).toBe(undefined);
			expect(finalUserList.length).toBe(0);
		});
	});

	describe('game manager', () => {
		const io = new Server({});
		const game = new Game(io, gameName, gameMode);
		const socket1 = new SocketServerMock();
		const socket2 = new SocketServerMock();

		test('already started', () => {
			game.started = true;

			game.launch();
		});

		test('applyEvent', () => {
			game.started = false;
			socket1.on('addPlayer', addPlayerSocket(socket1, game));
			socket1.clientMock.emit('addPlayer', 'bob');

			socket2.on('addPlayer', addPlayerSocket(socket2, game));
			socket2.clientMock.emit('addPlayer', 'john');

			game.launch();
			expect(game['tickPerSeconds']).toBe(0.25);
		});

		test('undefined gameMode', () => {
			game.started = false;
			game.gameMode = 'anything';

			game.launch();
			expect(game['tickPerSeconds']).toBe(2.5);
		});

		test('stopInterval', () => {
			game.stopInterval();
			expect(game['tickPerSeconds']).toBe(0);
		});

		test('checkEndGame', () => {
			game.started = true;
			game.gameMode = 'fast';
			game.launch();
			const players = game.getPlayersList();
			players.forEach((player) => {
				player.gameover = true;
			});

			game.checkEndGame(false);
			expect(game['tickPerSeconds']).toBe(0);
			expect(game.gameOverList.length).toBe(0);
			expect(game.players.size).toBe(2);
			expect(game.owner?.client.id).toBe(players[0].client.id);
		});
	});

	describe('makeIndestructibleLines', () => {
		const io = new Server({});
		const game = new Game(io, gameName, gameMode);
		const socket1 = new SocketServerMock();
		const socket2 = new SocketServerMock();

		socket1.on('addPlayer', addPlayerSocket(socket1, game));
		socket1.clientMock.emit('addPlayer', 'bob');

		socket2.on('addPlayer', addPlayerSocket(socket2, game));
		socket2.clientMock.emit('addPlayer', 'john');

		test('nbLines = 0', () => {
			const senderPlayer = game.getPlayersList()[0];
			const otherPlayer = game.getPlayersList()[1];

			game.makeIndestructibleLines(0, senderPlayer);
			expect(otherPlayer['addedLinesNextTurn']).toBe(0);
		});

		test('nbLines < 0', () => {
			const senderPlayer = game.getPlayersList()[0];
			const otherPlayer = game.getPlayersList()[1];

			game.makeIndestructibleLines(-1, senderPlayer);
			expect(otherPlayer['addedLinesNextTurn']).toBe(0);
		});

		test('nbLines > 0', () => {
			const senderPlayer = game.getPlayersList()[0];
			const otherPlayer = game.getPlayersList()[1];

			game.makeIndestructibleLines(3, senderPlayer);
			expect(otherPlayer['addedLinesNextTurn']).toBe(3);
		});
	});
});
