import { Server } from 'socket.io';
import pino from 'pino';
import { Game } from './Game';
import { Client } from './Client';
import { Player } from './Player';
import { Room } from '../utils/types';
import { CLIENT_EVENTS, IO_EVENTS, SOCKET_EVENTS } from '../utils/constants';

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

	socket.on(SOCKET_EVENTS.GET_ROOM_DATA, (roomName: string, userName:string, isBot: boolean = false) => {
		if (!/^[a-z0-9_-]{1,16}$/i.test(userName) || userName === undefined)
		{
			socket.emit(SOCKET_EVENTS.ERR_USERNAME_ERROR, 'username required');
			return ;
		}
		if (!/^[a-z0-9_-]{1,16}$/i.test(roomName))
		{
			socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, 'invalid roomname');
			return ;
		}

		if (!rooms.has(roomName)) {
			rooms.set(roomName, new Game(io, roomName))
		}

		let room = rooms.get(roomName);
		if (room?.started === true) {
			socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, `room '${roomName}' is already started`);
			return;
		}

		const client = new Client(socket);
		const removePlayer = () => {
			room?.removePlayer(client);

			if (room?.players.size === 0) {
				room.stopInterval();
				rooms.delete(roomName);
			}
			sendRoomList(io);
		}

		room?.addPlayer(userName, isBot, client);
		sendRoomList(io);
		room?.sendUsersList();

		client.on(`${CLIENT_EVENTS.START}:${roomName}`, () => {
			if (room?.owner?.client?.id !== client.id) return;

			io.in(roomName).emit(`${CLIENT_EVENTS.START}:${roomName}`);

			room.launch();
			sendRoomList(io);
		});

		client.on(`${CLIENT_EVENTS.RESTART}:${roomName}`, () => {
			if (room?.owner?.client?.id !== client.id) return;
			io.in(roomName).emit(`${CLIENT_EVENTS.RESTART}:${roomName}`);

			for (const [_, player] of room.players) player.client.clearListeners();

			room.players = new Map<string, Player>();
			room.stopInterval()

			rooms.set(roomName, new Game(io, roomName, room.gameMode))
			room = rooms.get(roomName);
			room?.addPlayer(userName, isBot, client);
		});

		client.on(`${CLIENT_EVENTS.GAME_MODE}:${roomName}`, (gameMode: string) => {
			const newGameMode = gameMode ?? room?.gameMode;
			if (room?.owner?.client?.id === client.id) room.gameMode = newGameMode;
			io.in(roomName).emit(`${CLIENT_EVENTS.GAME_MODE}:${roomName}`, room?.gameMode);
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

io.listen(PORT);