import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('message', (data) => {
		console.log(`Message received: ${data}`);
		io.emit('message', data); // Broadcast the message to all connected clients
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});