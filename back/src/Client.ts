import { BroadcastOperator, DefaultEventsMap, Socket } from 'socket.io';
import { DecorateAcknowledgementsWithMultipleResponses, EventParams } from 'socket.io/dist/typed-events';

export class Client {
	private socket: Socket;
	private listeners: any[];
	private rooms: any[];

	constructor(socket: Socket) {
		this.socket = socket;
		this.listeners = [];
		this.rooms = [];
	}

	get id(): string {
		return this.socket.id;
	}

	join(roomname: string): void {
		this.socket.join(roomname);
		this.rooms.push(roomname)
	}

	emit(emition: string): void {
		this.socket.emit(emition);
	}

	on(event:string, handler: any): void {
		this.socket.on(event, handler);
		this.listeners.push([event, handler]);
	}

	in(roomname: string): BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any> {
		return this.socket.in(roomname);
	}

	removeAllListeners(event: string): void {
		this.socket.removeAllListeners(event);
	}

	clearListeners(): void {
		for (const [event, handler] of this.listeners) this.socket.removeListener(event, handler);
		for (const room of this.rooms) this.socket.leave(room);
	}
}