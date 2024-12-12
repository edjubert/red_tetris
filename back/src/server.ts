import { createSocketServer } from './createServer';
import { Server } from 'socket.io';
import { logger } from '../utils/logger';

const PORT = 4000;

const io = new Server({
	cors: {
		origin: 'http://frontend:5173'
	}
});
const server = createSocketServer(io);
server.listen(PORT);
logger.info(`Server listening on port ${PORT}`);
