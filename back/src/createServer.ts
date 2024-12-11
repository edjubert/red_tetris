import { Server } from 'socket.io';
import { Game } from './classes/Game';
import { IO_EVENTS, SOCKET_EVENTS } from '../utils/constants';
import { handleJoinRoom } from './handlers/handleJoinRoom';
import { handleInitGame } from './handlers/handleInitGame';
import { handleGetScoresList } from './handlers/handleGetScoresList';
import { handleGetRoomList } from './handlers/handleGetRoomList';
import { logger } from '../utils/logger';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
	host: process.env.DB_HOST || 'localhost',
	port: +(process.env.DB_PORT || 3306),
	user: process.env.MARIADB_USER,
	password: process.env.MARIADB_PASSWORD
});

export const createSocketServer = (io: Server) => {
	const rooms = new Map<string, Game>();

	io.on(IO_EVENTS.CONNECTION, async (socket) => {
		logger.info('User connected');

		try {
			const conn = await pool.getConnection();

			socket.on(SOCKET_EVENTS.GET_ROOM_LIST, handleGetRoomList(io, rooms));
			socket.on(SOCKET_EVENTS.GET_SCORES_LIST, handleGetScoresList(socket, conn));
			socket.on(SOCKET_EVENTS.INIT_GAME, handleInitGame(socket, rooms));
			socket.on(SOCKET_EVENTS.JOIN_ROOM, handleJoinRoom(io, socket, conn, rooms));
		} catch (e) {
			logger.error(e);
		}
	});
	return io;
};

export const startServer = async (io: Server, port: number) => {
	io.listen(port);
	logger.info(`Server listening on port ${port}`);
};
