import { Server, Socket } from 'socket.io';
import { CLIENT_EVENTS, SOCKET_EVENTS } from '../../utils/constants';
import { Game } from '../classes/Game';
import { Client } from '../classes/Client';
import { sendRoomList } from '../sendRoomList';
import { Player } from '../classes/Player';

export const handleJoinRoom =
	(io: Server, socket: Socket, rooms: Map<string, Game>) =>
	({ roomname, user, isBot = false }: { roomname: string; user: string; isBot: boolean }) => {
		if (!/^[a-z0-9_-]{1,16}$/i.test(user) || user === undefined) {
			socket.emit(SOCKET_EVENTS.ERR_USERNAME_ERROR, 'username required');

			return;
		}
		if (!/^[a-z0-9_-]{1,16}$/i.test(roomname)) {
			socket.emit(SOCKET_EVENTS.ERR_ROOMNAME_ERROR, 'invalid roomname');
			return;
		}

		if (!rooms.has(roomname)) {
			rooms.set(roomname, new Game(io, roomname));
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
			sendRoomList(io, rooms);
		};

		room?.addPlayer(user, isBot, client);
		sendRoomList(io, rooms);
		room?.sendUsersList();

		client.on(`${CLIENT_EVENTS.START}:${roomname}`, () => {
			if (room?.owner?.client?.id !== client.id) return;

			io.in(roomname).emit(`${CLIENT_EVENTS.START}:${roomname}`);

			room.launch();
			sendRoomList(io, rooms);
		});

		client.on(`${CLIENT_EVENTS.RESTART}:${roomname}`, () => {
			if (room?.owner?.client?.id !== client.id) return;
			io.in(roomname).emit(`${CLIENT_EVENTS.RESTART}:${roomname}`);

			for (const [_, player] of room.players) player.client.clearListeners();

			room.players = new Map<string, Player>();
			room.stopInterval();

			rooms.set(roomname, new Game(io, roomname, room.gameMode));
			room = rooms.get(roomname);
			room?.addPlayer(user, isBot, client);
		});

		client.on(`${CLIENT_EVENTS.GAME_MODE}:${roomname}`, (gameMode: string) => {
			const newGameMode = gameMode ?? room?.gameMode;
			if (room?.owner?.client?.id === client.id) room.gameMode = newGameMode;
			io.in(roomname).emit(`${CLIENT_EVENTS.GAME_MODE}:${roomname}`, room?.gameMode);
		});

		client.on(CLIENT_EVENTS.LEAVE, removePlayer);
		client.on(CLIENT_EVENTS.DISCONNECT, removePlayer);
	};
