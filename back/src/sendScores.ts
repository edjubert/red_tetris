import { Socket } from 'socket.io';
import { PoolConnection } from 'mariadb';
import { logger } from '../utils/logger';

export const sendScores = async (socket: Socket, conn: PoolConnection, username: string): Promise<void> => {
	try {
		const userScores = await conn.query('SELECT username, score FROM red_tetris.scores WHERE username = ? ORDER BY score DESC LIMIT 10', [username])
		const bestScores = await conn.query('SELECT username, score FROM red_tetris.scores ORDER BY score DESC LIMIT 10')

		socket.emit('scoresList', { userScores, bestScores });
	} catch (e) {
		logger.error(e);
	}
};
