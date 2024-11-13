import { Server, Socket } from 'socket.io';
import pino from 'pino';
import { Game } from './Game';
import { Client } from './Client';

const logger = pino({
	transport: {
		target: 'pino-pretty'
	}
})



const io = new Server({
	cors: {
		origin: 'http://localhost:5173'
	}
});

const PORT = 4000;

type Room = {
	name: string,
	started: boolean,
	players: string[],
	owner: string
}
let rooms = new Map<string, Game>();

io.on('connection', (socket) => {
	logger.info('User connected')

	socket.on('getRoomData', (roomName: string, userName:string) => {
		if (!/^[a-z0-9_-]{1,16}$/i.test(userName) || userName === undefined)
		{
			socket.emit('userNameError', `username required`);
			return ;
		}
		if (!/^[a-z0-9_-]{1,16}$/i.test(roomName))
		{
			socket.emit('roomNameError', `invalid roomname`);
			return ;
		}

		if (!rooms.has(roomName)) {
			rooms.set(roomName, new Game(io, roomName))
		}

		const room = rooms.get(roomName);
		if (room?.started === true) {
			socket.emit('roomNameError', `room '${roomName}' is already started`);
			return;
		}

		const client = new Client(socket);
		const removePlayer = () => {
			room?.removePlayer(client);

			if (room?.players.size === 0) {
				room.stopInterval();
				rooms.delete(roomName);
			}
		}
	});
});

io.listen(PORT);