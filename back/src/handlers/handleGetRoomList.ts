import { sendRoomList } from '../sendRoomList';
import { Server } from 'socket.io';
import { Game } from '../classes/Game';

export const handleGetRoomList = (io: Server, rooms: Map<string, Game>) => () =>
	sendRoomList(io, rooms);
