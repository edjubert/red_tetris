import { Tetriminos, TETRIMINOS } from './Tetriminos';

export class Sequence {
	private readonly sequence: number[];
	constructor(length: number = 32) {
		this.sequence = [];

		for (let i = 0; i < length; i++) {
			const tetriminos = [0, 1, 2, 3, 4, 5, 6];
			let currentIndex = tetriminos.length,
				randomIndex;

			while (currentIndex !== 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				[tetriminos[currentIndex], tetriminos[randomIndex]] = [
					tetriminos[randomIndex],
					tetriminos[currentIndex]
				];
			}

			this.sequence.push(...tetriminos);
		}
	}

	get(i: number): Tetriminos {
		return TETRIMINOS[this.sequence[i % this.sequence.length]];
	}
}
