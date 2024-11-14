import { Game } from './Game';
import { Server } from 'socket.io';
import { Client } from './Client';
import { Piece } from './Piece';
import { Sequence } from './Sequence';
import { Board, CLIENT_EVENTS, Sound } from '../utils/constants';

function emptyBoard(): number[][] {
	return new Array(20).fill(new Array(10).fill(0));
}


const MOVE_KEYS: {[move:string]: string} = {
	LEFT: 'ArrowLeft',
	RIGHT: 'ArrowRight',
	UP: 'ArrowUp',
	DOWN: 'ArrowDown',
	SPACE: ' ',
}

function makeShadow(currentShape: Piece, layer: Board) {
	const copy: Piece = currentShape.clone();
	copy.colorid = 8;

	while (true) {
		if (!copy.tick(layer)) {
			return copy
		}
	}
}

export class Player {
	client: Client;
	name: string;
	gameover: boolean;
	score: number;

	private io: Server;
	private sequence: Sequence;
	private room: Game;
	private currentShape: Piece | undefined
	private currentShapeIndex: number;
	private board: Board;
	private layer: Board;
	private lines: number;
	private addedLinesNextTurn: number;

	private readonly isBot: boolean;

	constructor(io: Server, userName: string, isBot: boolean, client: Client, room: Game) {
		this.io = io;
		this.name = userName;
		this.client = client;
		this.room = room;
		this.layer = emptyBoard();
		this.board = emptyBoard();
		this.isBot = isBot;
		this.sequence = room.sequence;

		this.currentShapeIndex = 0;
		this.score = 0;
		this.lines = 0;
		this.addedLinesNextTurn = 0;

		this.gameover = false;
	}

	addLinesToBoard(nbLines: number): void {
		const copyBoard = this.layer;
		for (let i = 0; i < nbLines; i++) {
			copyBoard.shift();
			copyBoard.push(new Array(10).fill(9));
		}

		this.layer = copyBoard
	}

	addIndestructibleLine(nbLines: number): void {
		this.addedLinesNextTurn += nbLines;
	}

	applyTetriminos(): void {
		this.layer = this.currentShape?.drawOn(this.layer) || []
		this.currentShape = undefined;

		const filteredLayer = this.layer
			.filter((row: number[]) => row.some((cell: number) => cell == 0 || cell == 8 || cell == 9));
		const n = this.layer.length - filteredLayer.length;

		this.room.makeIndestructibleLines(n - 1, this);
		this.score += [0, 100, 300, 500, 800][n]

		this.sound(['landing', 'single', 'double', 'triple', 'tetris'][n] as Sound)

		while (filteredLayer.length !== this.layer.length) {
			filteredLayer.unshift(new Array(10).fill(0));
			++this.lines;
		}

		this.layer = filteredLayer;
		this.sendLayerData();
	}

	applyEvent(keys: string[]): void {
		if (this.currentShape === undefined) return;
		let newTetriminos = false;
		const apply = (key: string): void => {
			switch (key) {
				case MOVE_KEYS.LEFT:
					this.currentShape?.move(this.layer, -1, 0);
					this.sound('move');
					break;
				case MOVE_KEYS.RIGHT:
					this.currentShape?.move(this.layer, 1, 0);
					this.sound('move')
					break;
				case MOVE_KEYS.UP:
					this.currentShape?.rotateLeft(this.layer);
					this.sound('rotate')
					break;
				case MOVE_KEYS.DOWN:
					this.currentShape?.move(this.layer, 0, 1);
					this.score += 1;
					this.sound('soft-drop');
					break;
				case MOVE_KEYS.SPACE:
					while (this.currentShape?.move(this.layer, 0, 1)) this.score += 2;

					this.newTetriminos();
					newTetriminos = true;
					this.sound('hard-drop');
					break;
				default:
					return;
			}

			for (const key of keys) apply(key)
			this.draw(!this.isBot || newTetriminos);
		}
	}

	sound(track: Sound): void {
		this.client.emit(`sound:${this.room.name}`, track)
	}

	sendLayerData(): void {
		const heights = new Array(10).fill(0).map((_, x: number): number => {
			for (const y in this.layer) {
				if (this.layer[y][x] && this.layer[y][x] !== 8) return +y;
			}

			return 20;
		})

		this.client.in(`${this.room.name}+human`).emit(`${CLIENT_EVENTS.GAME_INFO}:${this.room.name}`, {
			clientId: this.client.id,
			heights,
			username: this.name,
			scores: {
				score: this.score,
				lines: this.lines,
			}
			})
	}

	sendGameData(): void {
		const nextShape = this.sequence.get(this.currentShapeIndex);

		this.client.emit(`${CLIENT_EVENTS.GAME_INFO}:${this.room.name}`, {
			clientId: this.client.id,
			currentShape: this.currentShape,
			nextShape,
			board: this.board,
			...(this.isBot ? {} : {
				scores: {
					score: this.score,
					lines: this.lines
				},
				indestructibleLines: this.addedLinesNextTurn
			})
		});
	}

	newTetriminos(): void {
		if (this.currentShape) this.applyTetriminos();

		this.addLinesToBoard(this.addedLinesNextTurn);
		this.addedLinesNextTurn = 0;
		this.currentShapeIndex = this.currentShapeIndex + 1
		this.currentShape = this.room.sequence.get(this.currentShapeIndex).constructPiece();

		if (this.currentShape.intersect(this.layer)) {
			this.gameover = true;
			this.currentShape = undefined;
			this.io.in(this.room.name).emit(`${CLIENT_EVENTS.GAME_INFO}:${this.room.name}`, {
				clientId: this.client.id,
				gameover: true,
			});
			this.room.gameOverList.push(this);
		}

	}

	draw(send: boolean = true): void {
		this.board = this.layer.map(row => [...row]);

		if (this.currentShape) {
			this.board = makeShadow(this.currentShape, this.layer).drawOn(this.board);
			this.board = this.currentShape.drawOn(this.board);
		}

		if (send) this.sendGameData();
	}


	tick(): void {
		if (this.gameover) return;

		const newTetriminos = !this?.currentShape?.tick?.(this.layer);
		if (newTetriminos) this.newTetriminos();

		this.draw(newTetriminos || !this.isBot);
	}
}