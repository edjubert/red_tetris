import { describe, test, expect } from 'vitest';
import { Piece } from './Piece';
import { Tetriminos, TETRIMINOS } from './Tetriminos';

describe('Piece', () => {
	test('Should be initiated', () => {
		const tetriminos = TETRIMINOS[0];
		const piece = new Piece(10, tetriminos['shape']);

		expect(piece['x']).toBe(3);
		expect(piece.y).toBe(0);
		expect(piece['shape'].length).toBe(4);
		expect(piece['rotation']).toBe(0);
	});

	test('should clone', () => {
		const tetriminos = TETRIMINOS[0];
		const piece = new Piece(10, tetriminos['shape']);

		piece['x'] = 3;
		piece.y = 5;

		const newPiece = piece.clone();
		expect(newPiece['x']).toBe(3);
		expect(newPiece.y).toBe(5);
		expect(newPiece['shape'].length).toBe(4);
		expect(newPiece['rotation']).toBe(0);
	});

	describe('intersect', () => {
		test('should be true', () => {
			const tetriminos = TETRIMINOS[0];
			const piece = new Piece(10, tetriminos['shape']);

			const intersect = piece.intersect([[0, 0, 0, 0]]);
			expect(intersect).toBeTruthy();
		});

		test('should be false', () => {
			const shape = [[]];
			const piece = new Piece(10, shape);

			const intersect = piece.intersect([[0, 0, 0, 0]]);
			expect(intersect).toBeFalsy();
		});
	});

	describe('rotateLeft', () => {
		const defaultBoard = [[0, 0, 0, 0]];
		test('unknown shape', () => {
			const shape = [[]];
			const piece = new Piece(10, shape);

			piece.rotateLeft([...defaultBoard]);
			expect(piece['rotation']).toBe(1);
		});
		test('shape 0', () => {
			const tetriminos = TETRIMINOS[0];
			const piece = new Piece(10, tetriminos['shape']);

			piece.rotateLeft([...defaultBoard]);
			expect(piece['rotation']).toBe(0);
		});
	});

	test('tick', () => {
		const shape = [[]];
		const piece = new Piece(10, shape);
		const defaultBoard = [[0, 0, 0, 0]];

		piece.tick(defaultBoard);
	});

	describe('drawOn', () => {
		test('with unknown shape', () => {
			const shape = [[]];
			const piece = new Piece(10, shape);
			const defaultBoard = [[0, 0, 0, 0]];

			const newBoard = piece.drawOn(defaultBoard);
			expect(newBoard).toStrictEqual(defaultBoard);
		});

		test('with shape 0', () => {
			const tetriminos = TETRIMINOS[0];
			const piece = new Piece(10, tetriminos['shape']);
			const defaultBoard = [[0, 0, 0, 0]];

			const newBoard = piece.drawOn(defaultBoard);
			expect(newBoard).toStrictEqual(defaultBoard);
		});

		test('with shape 0 and bigger board', () => {
			const tetriminos = TETRIMINOS[0];
			const piece = new Piece(10, tetriminos['shape']);
			const defaultBoard = [
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			];

			const newBoard = piece.drawOn(defaultBoard);
			expect(newBoard).not.toStrictEqual(defaultBoard);
		});
	});
});
