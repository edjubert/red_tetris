import {   Socket } from 'socket.io';

export class Client {
	private socket: Socket;
	private readonly listeners: any[];
	private readonly rooms: any[];

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

	emit(emition: string, ...args: any[]): void {
		this.socket.emit(emition, ...args);
	}

	on(event:string, handler: any): void {
		this.socket.on(event, handler);
		this.listeners.push([event, handler]);
	}

	in(roomname: string) {
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