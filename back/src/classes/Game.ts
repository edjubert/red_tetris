import { Server } from 'socket.io';
import { Client } from './Client';
import { Player } from './Player';
import { Sequence } from './Sequence';
import { CLIENT_EVENTS, HUMAN_PREFIX } from '../../utils/constants';
import { GameMode } from '../../utils/types';
import { PoolConnection } from 'mariadb';
import { logger } from '../../utils/logger';

export class Game {
	started: boolean;
	players: Map<string, Player>;
	name: string;
	sequence = new Sequence();
	owner: Player | undefined;
	gameOverList: Player[];
	gameMode: string;

	private readonly io: Server;
	private tickPerSeconds: number;
	private timeout: NodeJS.Timeout | undefined;

	constructor(io: Server, name: string, gameMode: GameMode = 'slow') {
		this.io = io;
		this.name = name;
		this.owner = undefined;
		this.started = false;
		this.gameMode = gameMode;

		this.players = new Map<string, Player>();
		this.tickPerSeconds = 0;
		this.gameOverList = [];
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
		const users = this.getPlayersList().map((player) => {
			const isOwner = player.client.id === this.owner?.client?.id;
			return `${player.name}${isOwner ? ' (owner)' : ''}`;
		});

		this.io.in(this.name).emit(`${CLIENT_EVENTS.JOIN}:${this.name}`, users);
		return users;
	}

	getPlayersList() {
		return [...this.players.values()];
	}

	setOwner(owner: Player | undefined): void {
		this.owner = owner;
		owner?.client?.emit?.(`${CLIENT_EVENTS.OWNER}:${this.name}`);
	}

	async removePlayer(conn: PoolConnection, client: Client): Promise<string[]> {
		const currentPlayer = this.players.get(client.id);
		if (this.started && (currentPlayer?.score ?? 0) > 0) {
			try {
				await conn.query(
					'INSERT INTO red_tetris.scores (username, roomname, score, created) VALUES (?, ?, ?, now())',
					[currentPlayer?.name, this.name, currentPlayer?.score]
				);
			} catch (e) {
				logger.error(e)
			}
		}

		client.clearListeners();
		this.players.delete(client.id);

		if (this?.owner?.client?.id === client.id) {
			this.setOwner([...this.players.values()][0]);
		}

		return this.sendUsersList();
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
			this.stopInterval();

			for (const [_, player] of this.players) {
				player.client.removeAllListeners(`${CLIENT_EVENTS.EVENT}:${this.name}`);
			}

			const list = [];
			for (const { name, score } of this.gameOverList) {
				list.unshift({ username: name, score });
			}

			for (const [_, { name, score, gameover }] of this.players) {
				if (!gameover) {
					list.unshift({ username: name, score });
				}
			}

			this.setOwner(this.owner);

			this.io.in(this.name).emit(`${CLIENT_EVENTS.END_GAME}:${this.name}`, list);
		}
	}

	addPlayer(username: string, client: Client): void {
		const newPlayer = new Player(this.io, username, client, this);

		client.join(this.name);
		client.join(`${this.name}${HUMAN_PREFIX}`);
		if (this.players.size === 0 || this.owner?.client?.id === client.id) this.setOwner(newPlayer);

		this.players.get(client.id)?.client?.clearListeners?.();
		this.players.set(client.id, newPlayer);
	}

	launch(): void {
		if (this.started) return;
		this.started = true;
		const isSolo = this.players.size === 1;

		for (const [i, player] of this.players) {
			player.client.on(`${CLIENT_EVENTS.EVENT}:${this.name}`, (key: string) => {
				player.applyEvent([key]);
			});

			player.client.on(CLIENT_EVENTS.INIT_GAME, () => {
				for (const [j, other] of this.players) {
					if (i !== j) other.sendLayerData();
				}
			});

			const ticks: { [key: GameMode]: number } = {
				fast: 13,
				'medium-fast': 6,
				'medium-slow': 2.5,
				slow: 0.25
			};

			if (
				this.gameMode !== 'fast' &&
				this.gameMode !== 'medium-fast' &&
				this.gameMode !== 'medium-slow' &&
				this.gameMode !== 'slow'
			) {
				this.gameMode = 'medium-slow';
			}
			this.tickPerSeconds = ticks[this.gameMode];

			const loop = () => {
				this.checkEndGame(isSolo);

				for (const [_, player] of this.players) {
					player.tick();
				}

				if (this.tickPerSeconds > 0) {
					this.timeout = setTimeout(loop, 1000 / this.tickPerSeconds);
				}
			};
			loop();
		}
	}
}
