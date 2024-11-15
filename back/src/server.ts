import { Server } from 'socket.io';
import { Game } from './classes/Game';
import { IO_EVENTS, SOCKET_EVENTS } from '../utils/constants';
import { handleJoinRoom } from './handlers/handleJoinRoom';
import { handleInitGame } from './handlers/handleInitGame';
import { handleGetScoresList } from './handlers/handleGetScoresList';
import { handleGetRoomList } from './handlers/handleGetRoomList';
import { logger } from '../utils/logger';

const io = new Server({
	cors: {
		origin: 'http://localhost:5173'
	}
});

const PORT = 4000;

let rooms = new Map<string, Game>();

io.on(IO_EVENTS.CONNECTION, (socket) => {
	logger.info('User connected');

	socket.on(SOCKET_EVENTS.GET_ROOM_LIST, handleGetRoomList(io, rooms));
	socket.on(SOCKET_EVENTS.GET_SCORES_LIST, handleGetScoresList(socket));
	socket.on(SOCKET_EVENTS.INIT_GAME, handleInitGame(socket, rooms));
	socket.on(SOCKET_EVENTS.JOIN_ROOM, handleJoinRoom(io, socket, rooms));
});

io.listen(PORT);
