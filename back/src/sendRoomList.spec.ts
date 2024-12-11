import { describe, test } from 'vitest';
import { sendRoomList } from './sendRoomList';
import { Server } from 'socket.io';
import { Game } from './classes/Game';

describe('sendRoomList', () => {
	const io = new Server({});
	const rooms = new Map<string, Game>();

	test('with no rooms', () => {
		sendRoomList(io, rooms);
	});

	test('with one room', () => {
		const gameName = 'hello';
		const gameMode = 'slow';
		const game = new Game(io, gameName, gameMode);
		rooms.set(gameName, game);
		sendRoomList(io, rooms);
	});
});
