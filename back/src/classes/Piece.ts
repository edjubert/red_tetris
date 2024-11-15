import { Board } from '../../utils/constants';

export type Shape = number[][];
export class Piece {
	y: number;
	colorid: number;

	private x: number;
	private rotation: number;
	private shape: Shape;

	constructor(colorid: number, shape: Shape) {
		this.x = 5 - Math.ceil(shape.length / 2);
		this.y = 0;
		this.colorid = colorid;
		this.shape = shape.map((row) => [...row]);
		this.rotation = 0;
	}

	clone(): Piece {
		const newShape = new Piece(this.colorid, this.shape);
		newShape.x = this.x;
		newShape.y = this.y;

		return newShape;
	}

	intersect(board: any): boolean {
		for (const y in this.shape) {
			for (const x in this.shape[y]) {
				const cell = this.shape[y][x];

				if (!cell) continue;

				const rx = this.x + +x;
				const ry = this.y + +y;
				if (rx < 0 || rx >= board[0].length || ry >= board.length || board?.[ry]?.[rx]) return true;
			}
		}

		return false;
	}

	rotateLeft(board: Board): void {
		const oldShape = this.shape.map((row) => [...row]);
		for (const y in this.shape) {
			for (const x in this.shape[y]) {
				this.shape[y][x] = oldShape[this.shape.length - 1 - +x][y];
			}
		}

		// https://tetris.fandom.com/wiki/SRS
		const JLTSZ_WALL_KICK_DATA: number[][] = [
			[
				[0, 0],
				[-1, 0],
				[-1, 1],
				[0, -2],
				[-1, -2]
			],
			[
				[0, 0],
				[1, 0],
				[1, -1],
				[0, 2],
				[1, 2]
			],
			[
				[0, 0],
				[1, 0],
				[1, 1],
				[0, -2],
				[1, -2]
			],
			[
				[0, 0],
				[-1, 0],
				[-1, -1],
				[0, 2],
				[-1, 2]
			]
		][this.rotation % 4];

		const I_WALL_KICK_DATA: number[][] = [
			[
				[0, 0],
				[-2, 0],
				[1, 0],
				[-2, -1],
				[1, 2]
			],
			[
				[0, 0],
				[-1, 0],
				[2, 0],
				[-1, 2],
				[2, -1]
			],
			[
				[0, 0],
				[2, 0],
				[-1, 0],
				[2, 1],
				[-1, -2]
			],
			[
				[0, 0],
				[1, 0],
				[-2, 0],
				[1, -2],
				[-2, 1]
			]
		][this.rotation % 4];

		const WALL_KICK_DATA = this.shape.length === 4 ? I_WALL_KICK_DATA : JLTSZ_WALL_KICK_DATA;

		for (const [x, y] of WALL_KICK_DATA) {
			this.move(board, x, y);
			if (!this.intersect(board)) {
				++this.rotation;
				return;
			}
		}

		this.shape = oldShape;
	}

	move(board: any, ox: number, oy: number): boolean {
		this.x += ox;
		this.y += oy;

		if (this.intersect(board)) {
			this.x -= ox;
			this.y -= oy;

			return false;
		}

		return true;
	}

	tick(board: any): boolean {
		return this.move(board, 0, 1);
	}

	drawOn(board: Board): Board {
		const copyBoard = board.map((row) => [...row]);

		for (const y in this.shape) {
			for (const x in this.shape[y]) {
				if (this.shape[y][x]) {
					const px = this.x + +x;
					const py = this.y + +y;

					if (copyBoard[py]?.[px] !== undefined) {
						copyBoard[py][px] = this.colorid;
					}
				}
			}
		}

		return copyBoard;
	}
}
