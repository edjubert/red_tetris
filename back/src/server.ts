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

type Room = {name: string, val: {started: boolean, players: string[]}}
const rooms: Room[] = [];

const getRoomList = (socket: Socket) => ()  => {
		let roomList = [];

		for (let {name, val} of rooms) {
			if (!val.started) {
				roomList.push({ name, nb: val.players.length });
			}
		}

		socket.emit('roomList', roomList);
}

const disconnect = (socket: Socket) => () => {
	socket.on('disconnect', () => {})
}

const handlers = (socket: Socket) => {
	return {
		getRoomList: getRoomList(socket),
		disconnect: disconnect(socket)
	}
}

io.on('connection', (socket) => {
	logger.info('User connected')
	const h = handlers(socket);

	socket.on('getRoomList', h.getRoomList);
	socket.on('disconnect', h.disconnect);
});

io.listen(PORT);