import { Server } from 'socket.io';
import { Client } from './Client';
import { Player } from './Player';
import { Sequence } from './Sequence';

type GameMode = string;

export class Game {
	started: boolean;
	players: Map<string, Player>;

	private io: Server;
	private name: string;
	private gameMode: string;
	private sequence = new Sequence();
	private owner: Player | undefined

	private tickPerSeconds: number;
	private timeout: NodeJS.Timeout | undefined;
	
	constructor(io:Server, name: string, gameMode: GameMode = "earth") {
		this.io = io;
		this.name = name;
		this.owner = undefined;
		this.started = false;
		this.gameMode = gameMode;

		this.players = new Map<string, Player>()
		this.tickPerSeconds = 0;
	}

	makeIndestructibleLines(nbLines: number, senderPlayer: Player): void {
		if (nbLines <= 0) return;

		for (const [_, player] of this.players) {
			if (senderPlayer.client.id !== player.client.id) {
				player.addIndestructibleLine(nbLines);
			}
		}
	}

	sendUsersList() {
		const users = this.getPlayersList()
			.map(player => {
				const isOwner =player.client.id === this.owner?.client?.id;
				return `${player.name}${isOwner ? ' (owner)' : ''}`
			})

		this.io.in(this.name).emit(`join:${this.name}`, users);
	}

	getPlayersList() {
		return [...this.players.values()]
	}

	setOwner(owner: Player | undefined): void {
		this.owner = owner;
		owner?.client?.emit?.(`owner:${this.name}`)
	}

	removePlayer(client: Client): void {
		client.clearListeners();
		this.players.delete(client.id);

		if (this?.owner?.client?.id === client.id) {
			this.setOwner([...this.players.values()][0])
		}

		this.sendUsersList()
	}

	stopInterval() {
		this.tickPerSeconds = 0;
		clearTimeout(this.timeout);
	}

	checkEndGame(isSolo: boolean): void {
		let nbGameOver = 0;

		for (const [_, player] of this.players) {
			if (player.gameover) ++nbGameOver;
		}

		if (nbGameOver >= this.players.size - (isSolo ? 0 : 1)) {
			this.stopInterval()

			for (const [_, player] of this.players) {
				player.client.removeAllListeners(`event:${this.name}`);
			}

			const list = [];
			for (const {username, score} of this.gameOverList) {
				list.unshift({username, score});
			}

			for (const [_, { username, score, gameover}] of this.players) {
				 if (!gameover) {
					 list.unshift({ username, score});
				 }
			}

			this.setOwner(this.owner);

			this.io.in(this.name).emit(`endgame:${this.name}`, list);
		}
	}

	launch(): void {
		if (this.started) return
		this.started = true;
		const isSolo = this.players.size === 1;

		for (const [i, player] of this.players) {
			player.client.on(`event:${this.name}`, (key) => {
				player.applyEvent(key);
			})

			player.client.on('initgame', () => {
				for (const [j, other] of this.players) {
					if (i !== j) other.sendLayerData(player.client);
				}
			});

			const ticks: {[key: GameMode]: number} = {
				blackhole: 13,
				sun: 6,
				earth: 2.5,
				moon: 1.25
			}

			this.tickPerSeconds = ticks[this.gameMode];

			const loop = () => {
				this.checkEndGame(isSolo);

				for (const [_, player] of this.players) {
					player.tick();
				}

				if (this.tickPerSeconds > 0) {
					this.timeout = setTimeout(loop, 1000/this.tickPerSeconds);
				}
			}
		}
	}
}