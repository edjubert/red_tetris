import { Server, Socket } from 'socket.io';
import pino from 'pino';

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

type Room = {name: string, started: boolean, players: string[], owner: string}
const rooms: Room[] = [];

io.on('connection', (socket) => {
	logger.info('User connected')

	socket.on('initGame', (roomName: string) => {
		const _current = rooms.findIndex((r: Room) => r.name === roomName);
		rooms[_current] = {...rooms[_current], started: true};
		io.emit(`roomData:${roomName}`, rooms[_current]);
	});

	socket.on('getRoomData', (roomName: string, userName:string) => {
		const _current = rooms.find((r: Room) => r.name === roomName);
		const _currentIdx = rooms.findIndex((r: Room) => r.name === roomName)
		if (_currentIdx === -1) {
			const room:Room = {
				name: roomName,
				owner: userName,
				players: [userName],
				started: false
			}

			rooms.push(room)
			socket.emit(`roomData:${roomName}`, room);
		} else if (_current?.players.findIndex(p => p === userName) === -1) {
			if (_current?.started || _current?.players.length >= 2) {
				socket.emit(`unauthorized:${roomName}`)
			} else {
				const room:Room = {..._current, players: [..._current?.players || [], userName]};
				io.emit(`roomData:${roomName}`, room);
			}
		} else {
			io.emit(`unauthorized:${roomName}:${socket.id}`)
		}
	});
	socket.on('disconnect', () => {
		logger.info({socket: socket.id})
	});
});

io.listen(PORT);