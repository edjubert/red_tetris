import { Server } from 'socket.io';

export class Game {
	private io: Server;
	private name: string;
	private owner: string | undefined;
	
	constructor(io:Server, name: string) {
		this.io = io;
		this.name = name;
		this.owner = undefined;
	}

	setOwner(owner: string): void {
		this.owner = owner;
	}
}