import { sendScores } from '../sendScores';
import { Socket } from 'socket.io';
import { PoolConnection } from 'mariadb';

export const handleGetScoresList = (socket: Socket, conn: PoolConnection) => (username: string) =>
	sendScores(socket, conn, username);
