import { createSocketServer, startServer } from './createServer';
import { Server } from 'socket.io';

const PORT = 4000;

const io = new Server({
	cors: {
		origin: 'http://frontend:5173'
	}
});
const server = createSocketServer(io);
await startServer(server, PORT);
