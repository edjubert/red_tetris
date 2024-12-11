import { describe, it, expect, vi, test } from 'vitest';
import { emptyBoard, Player } from './Player';
import { Server } from 'socket.io';
// @ts-expect-error the library has an any that needs to be updated
import { SocketServerMock } from 'socket.io-mock-ts';
import { Game } from './Game';
import { TETRIMINOS } from './Tetriminos';
import { Piece } from './Piece';

describe('Player', () => {
	const gameName = 'hello';
	const gameMode = 'slow';

	it('Should be initialized', () => {
		const io = new Server({});
		const client = new SocketServerMock();
		const game = new Game(io, gameName, gameMode);
		const player = new Player(io, 'bob', client, game);

		expect(player.client).toStrictEqual(client);
		expect(player.name).toBe('bob');
		expect(player.gameover).toBeFalsy();
		expect(player.score).toBe(0);

		expect(player['io']).toStrictEqual(io);
		expect(player['sequence']).toStrictEqual(game.sequence);
		expect(player['room']).toStrictEqual(game);
		expect(player['currentShape']).toStrictEqual(undefined);
		expect(player['currentShapeIndex']).toStrictEqual(0);
		expect(player['board']).toStrictEqual(emptyBoard());
		expect(player['layer']).toStrictEqual(emptyBoard());
		expect(player['lines']).toStrictEqual(0);
		expect(player['addedLinesNextTurn']).toStrictEqual(0);
	});

	it('addLinesToBoard', () => {
		const io = new Server({});
		const client = new SocketServerMock();
		const game = new Game(io, gameName, gameMode);
		const player = new Player(io, 'bob', client, game);
		const oldLayer = [...player['layer']];

		player.addLinesToBoard(2);
		expect(player['layer']).not.toStrictEqual(oldLayer);
	});

	it('addIndestuctibleLine', () => {
		const io = new Server({});
		const client = new SocketServerMock();
		const game = new Game(io, gameName, gameMode);
		const player = new Player(io, 'bob', client, game);

		player.addIndestructibleLine(2);
		expect(player['addedLinesNextTurn']).toBe(2);

		player.addIndestructibleLine(2);
		expect(player['addedLinesNextTurn']).toBe(4);
	});

	it('applyTetriminos', () => {
		const io = new Server({});
		const client = new SocketServerMock();
		client.in = () => ({ emit: vi.fn() });
		const game = new Game(io, gameName, gameMode);
		const player = new Player(io, 'bob', client, game);

		player.applyTetriminos();
	});

	describe('applyEvent', () => {
		const io = new Server({});
		const client = new SocketServerMock();
		const game = new Game(io, gameName, gameMode);
		const player = new Player(io, 'bob', client, game);

		test('current shape is undefined', () => {
			player.applyEvent(['ArrowLeft', 'ArrowRight']);
		});

		test('valid current shape', () => {
			const tetriminos = TETRIMINOS[0];
			client.in = () => ({ emit: vi.fn() });

			player['currentShape'] = new Piece(tetriminos['colorid'], tetriminos['shape']);
			player.applyEvent(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'pouet']);
		});
	});
});
