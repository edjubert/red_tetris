import { Server } from 'socket.io';
import { Room } from '../utils/types';
import { Game } from './classes/Game';
import { IO_EVENTS } from '../utils/constants';

export const sendRoomList = (io: Server, rooms: Map<string, Game>): void => {
	const roomList: Room[] = [];

	for (const [name, val] of rooms) {
		if (!val.started) {
			roomList.push({ name, nbOfPlayers: val.players.size });
		}
	}

	io.emit(IO_EVENTS.ROOM_LIST, roomList);
};
