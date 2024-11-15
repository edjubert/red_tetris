import { sendScores } from '../sendScores';
import { Socket } from 'socket.io';

export const handleGetScoresList =
	(socket: Socket) =>
	({ username }: { username: string }) =>
		sendScores(socket, username);
