import { Piece, Shape } from './Piece';

export class Tetriminos {
	private readonly colorid: number;
	private readonly y: number;
	private readonly shape: Shape;

	constructor(colorid: number, y: number, shape: Shape) {
		this.colorid = colorid;
		this.y = y;
		this.shape = shape;
	}

	constructPiece(): Piece {
		const piece = new Piece(this.colorid, this.shape);
		piece.y = this.y;
		return piece
	}
}

export const TETRIMINOS: Tetriminos[] = [
	new Tetriminos(
		1,
		-1,
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	),
	new Tetriminos(
		2,
		0,
		[
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		3,
		0,
		[
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		4,
		0,
		[
			[1, 1],
			[1, 1]
		]
	),
	new Tetriminos(
		5,
		0,
		[
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		6,
		0,
		[
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		]
	),
	new Tetriminos(
		7,
		0,
		[
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		]
	)
]