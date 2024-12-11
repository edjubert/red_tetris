import { describe, test } from 'vitest';
import { handleGetRoomList } from './handleGetRoomList';
import { Server } from 'socket.io';
import { Game } from '../classes/Game';

describe('handleGetRoomList', () => {
	const io = new Server({});
	const rooms = new Map<string, Game>();

	test('nominal', async () => {
		handleGetRoomList(io, rooms);
	});

	test('with one room', () => {
		const gameName = 'hello';
		const gameMode = 'slow';
		const game = new Game(io, gameName, gameMode);
		rooms.set(gameName, game);
		handleGetRoomList(io, rooms);
	});
});
