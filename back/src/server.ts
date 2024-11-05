import { Server } from 'socket.io';

const io = new Server({
	cors: {
		origin: 'http://localhost:5173'
	}
});

const PORT = 3000;

io.on('connection', (socket) => {
	console.log('A user connected', socket.client);

	const messages: string[] = [];
	socket.on('message', (data) => {
		console.log(`Message received: ${data}`);
		messages.push(data)
		console.log({messages})
		io.emit('message', data); // Broadcast the message to all connected clients
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

io.listen(PORT);