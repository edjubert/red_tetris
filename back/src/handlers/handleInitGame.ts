import { Game } from '../classes/Game';
import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../../utils/constants';

export const handleInitGame =
	(socket: Socket, rooms: Map<string, Game>) =>
	({ roomname }: { roomname: string }): void => {
		const currentRoom = rooms.get(roomname);
		if (currentRoom === undefined || !currentRoom?.players.has(socket.id))
			socket.emit(`${SOCKET_EVENTS.ERR_NOT_AUTHORIZED}:${roomname}`);
	};
