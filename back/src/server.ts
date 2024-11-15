import { Server, Socket } from 'socket.io';
import pino from 'pino';
import { Game } from './Game';
import { Client } from './Client';
import { Player } from './Player';
import { Room } from '../utils/types';
import { CLIENT_EVENTS, IO_EVENTS, SOCKET_EVENTS } from '../utils/constants';
import { inspect } from 'node:util';

const logger = pino({
	transport: {
		target: 'pino-pretty'
	}
})



const io = new Server({
	cors: {
		origin: 'http://localhost:5173'
	}
});

const PORT = 4000;

let rooms = new Map<string, Game>();

io.on(IO_EVENTS.CONNECTION, (socket) => {
	logger.info('User connected')

	socket.on(SOCKET_EVENTS.GET_ROOM_LIST, () => sendRoomList(socket));

	socket.on(SOCKET_EVENTS.GET_SCORES_LIST, ({username}: {username: string}) => sendScores(socket, username));

	socket.on(SOCKET_EVENTS.INIT_GAME, ({roomname}:{roomname: string}): void => {
		const currentRoom = rooms.get(roomname);
		if (currentRoom === undefined || !currentRoom?.players.has(socket.id)) socket.emit(`${SOCKET_EVENTS.ERR_NOT_AUTHORIZED}:${roomname}`)
	})

	socket.on(SOCKET_EVENTS.JOIN_ROOM, ({roomname, user, isBot = false}: {roomname: string; user: string;  isBot: boolean}) => {
		if (!/^[a-z0-9_-]{1,16}$/i.test(user) || user === undefined) {
			socket.emit(SOCKET_EVENTS.ERR_USERNAME_ERROR, 'username required');
			return ;
		}
		if (!/^[a-z0-9_-]{1,16}$/i.test(roomname)) {
			socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, 'invalid roomname');
			return ;
		}

		if (!rooms.has(roomname)) {
			rooms.set(roomname, new Game(io, roomname))
		}

		let room = rooms.get(roomname);
		if (room?.started === true) {
			socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, `room '${roomname}' is already started`);
			return;
		}

		const client = new Client(socket);
		const removePlayer = () => {
			room?.removePlayer(client);

			if (room?.players.size === 0) {
				room.stopInterval();
				rooms.delete(roomname);
			}
			sendRoomList(io);
		}

		room?.addPlayer(user, isBot, client);
		sendRoomList(io);
		room?.sendUsersList();

		client.on(`${CLIENT_EVENTS.START}:${roomname}`, () => {
			if (room?.owner?.client?.id !== client.id) return;

			console.log({startGameMode: room?.gameMode})
			io.in(roomname).emit(`${CLIENT_EVENTS.START}:${roomname}`);

			room.launch();
			sendRoomList(io);
		});

		client.on(`${CLIENT_EVENTS.RESTART}:${roomname}`, () => {
			if (room?.owner?.client?.id !== client.id) return;
			io.in(roomname).emit(`${CLIENT_EVENTS.RESTART}:${roomname}`);

			for (const [_, player] of room.players) player.client.clearListeners();

			room.players = new Map<string, Player>();
			room.stopInterval()

			rooms.set(roomname, new Game(io, roomname, room.gameMode))
			room = rooms.get(roomname);
			room?.addPlayer(user, isBot, client);
		});

		client.on(`${CLIENT_EVENTS.GAME_MODE}:${roomname}`, (gameMode: string) => {
			console.log({gameMode, roomGameMode: gameMode})
			const newGameMode = gameMode ?? room?.gameMode;
			if (room?.owner?.client?.id === client.id) room.gameMode = newGameMode;
			io.in(roomname).emit(`${CLIENT_EVENTS.GAME_MODE}:${roomname}`, room?.gameMode);
		});

		client.on(CLIENT_EVENTS.LEAVE, removePlayer)
		client.on(CLIENT_EVENTS.DISCONNECT, removePlayer)
	});
});

function sendRoomList(io: Server): void {
	const roomList: Room[] = [];

	for (const [name, val] of rooms) {
		if (!val.started) {
			roomList.push({ name, nbOfPlayers: val.players.size })
		}
	}

	io.emit(IO_EVENTS.ROOM_LIST, roomList);
}

const sendScores = async (socket: Socket, username: string): Promise<void>  => {
	// TODO implement
	socket.emit('scoresList', {userScores: [], bestScores: []})
}

io.listen(PORT);