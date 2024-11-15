import { Socket } from 'socket.io';

export const sendScores = async (socket: Socket, username: string): Promise<void> => {
	// TODO implement
	socket.emit('scoresList', { userScores: [], bestScores: [] });
};
