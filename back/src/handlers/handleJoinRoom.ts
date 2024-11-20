import { Server, Socket } from 'socket.io';
import { CLIENT_EVENTS, SOCKET_EVENTS } from '../../utils/constants';
import { Game } from '../classes/Game';
import { Client } from '../classes/Client';
import { sendRoomList } from '../sendRoomList';
import { Player } from '../classes/Player';
import { PoolConnection } from 'mariadb';

const verifyUserAndRoom = (socket: Socket, username: string | undefined, roomname: string | undefined): boolean => {
	if (username === undefined || !/^[a-z0-9_-]{1,16}$/i.test(username)) {
		socket.emit(SOCKET_EVENTS.ERR_USERNAME_ERROR, 'username required');

		return false;
	}
	if (roomname === undefined || !/^[a-z0-9_-]{1,16}$/i.test(roomname)) {
		socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, 'invalid roomname');
		return false;
	}

	return true;
}

const removePlayerFunc = (io: Server, conn: PoolConnection, client: Client, rooms: Map<string,Game>, roomname: string, room: Game | undefined) => async () => {
	await room?.removePlayer(conn, client);

	if (room?.players.size === 0) {
		room.stopInterval();
		rooms.delete(roomname);
	}
	sendRoomList(io, rooms);
};

const clientStart = (io: Server, client: Client, rooms: Map<string, Game>, room: Game | undefined, roomname: string) => () => {
	if (room?.owner?.client?.id !== client.id) return;

	io.in(roomname).emit(`${CLIENT_EVENTS.START}:${roomname}`);

	room.launch();
	sendRoomList(io, rooms);
}

const clientRestart = (io: Server, conn: PoolConnection, client: Client, rooms: Map<string, Game>, room: Game | undefined, roomname: string, user: string, isBot: boolean) => () => {
	if (room?.owner?.client?.id !== client.id) return;

	sendRoomList(io, rooms)
	io.in(roomname).emit(`${CLIENT_EVENTS.RESTART}:${roomname}`);

	for (const [_, player] of room.players) player.client.clearListeners();

	room.players = new Map<string, Player>();
	room.stopInterval();

	rooms.set(roomname, new Game(io, conn, roomname, room.gameMode));
	room = rooms.get(roomname);
	room?.addPlayer(user, isBot, client);

	clientStart(io, client, rooms, room, roomname)
}

const clientGameMode = (io: Server, client: Client, room: Game|undefined, roomname: string) => (gameMode: string) => {
	const newGameMode = gameMode ?? room?.gameMode;
	if (room?.owner?.client?.id === client.id) room.gameMode = newGameMode;
	io.in(roomname).emit(`${CLIENT_EVENTS.GAME_MODE}:${roomname}`, room?.gameMode);
}

export const handleJoinRoom =
	(io: Server, socket: Socket, conn: PoolConnection, rooms: Map<string, Game>) =>
		async ({ roomname, user, isBot = false }: { roomname: string; user: string; isBot: boolean }) => {
			if (!verifyUserAndRoom(socket, user, roomname)) {
				return;
			}

			if (!rooms.has(roomname)) {
				rooms.set(roomname, new Game(io, conn, roomname));
			}

			let room = rooms.get(roomname);
			if (room?.started === true) {
				socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, `room '${roomname}' is already started`);
				return;
			}

			const client = new Client(socket);
			const removePlayer = removePlayerFunc(io, conn, client, rooms, roomname, room);

			room?.addPlayer(user, isBot, client);
			sendRoomList(io, rooms);
			room?.sendUsersList();

			client.on(`${CLIENT_EVENTS.START}:${roomname}`, clientStart(io, client, rooms, room, roomname));
			client.on(`${CLIENT_EVENTS.RESTART}:${roomname}`, clientRestart(io, conn, client, rooms, room, roomname, user, isBot));
			client.on(`${CLIENT_EVENTS.GAME_MODE}:${roomname}`, clientGameMode(io, client, room, roomname));
			client.on(CLIENT_EVENTS.LEAVE, removePlayer);
			client.on(CLIENT_EVENTS.DISCONNECT, removePlayer);
		};
