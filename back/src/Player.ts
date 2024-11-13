import { Game } from './Game';
import { Server } from 'socket.io';
import { Client } from './Client';
import { Piece } from './Piece';

function emptyBoard(): number[][] {
	return new Array(20).fill(new Array(10).fill(0));
}

export type Board = number[][];

export class Player {
	client: Client;
	name: string;

	private io: Server;
	private room: Game;
	private currentShape: Piece | undefined
	private currentShapeIndex: number;
	private board: Board;
	private layer: Board;
	private isBot: boolean = false;
	private score: number;
	private lines: number;

	private gameover: boolean;

	private addedLinesNextTurn: number;
	constructor(io: Server, userName: string, client: Client, room: Game) {
		this.io = io;
		this.name = userName;
		this.client = client;
		this.room = room;
		this.layer = emptyBoard();
		this.board = emptyBoard();

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

		this.sound(['landing', 'single', 'double', 'triple', 'tetris'][n])

		while (filteredLayer.length !== this.layer.length) {
			filteredLayer.unshift(new Array(10).fill(0));
			++this.lines;
		}

		this.layer = filteredLayer;
		this.sendLayerData();
	}

	sendLayerData(): void {
		const heights = new Array(10).fill(0).map((_, x: number): number => {
			for (const y in this.layer) {
				if (this.layer[y][x] && this.layer[y][x] !== 8) return +y;
			}

			return 20;
		})

		this.client.in(`${this.room.name}+human`).emit(`gameInfo:${this.room.name}`, {
			clientId: this.client.id,
			heights,
			username: this.name,
			scores: {
				score: this.score,
				lines: this.lines,
			}
			})
	}

	newTetriminos(): void {
		if (this.currentShape) this.applyTetriminos();

		this.addLinesToBoard(this.addedLinesNextTurn);
		this.addedLinesNextTurn = 0;
		this.currentShape = this.room.sequence.get(this.currentShapeIndex++).constructPiece();

		if (this.currentShape.intersect(this.layer)) {
			this.gameover = true;
			this.currentShape = undefined;
			this.io.in(this.room.name).emit(`gameInfo:${this.room.name}`, {
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