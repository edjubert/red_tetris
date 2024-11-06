export type Score = {
	username: string;
	score: number;
};

export type AllScore = {
	userScores: Score[];
	bestScores: Score[];
};

export type Room = {
	name: string;
	nb: number;
};
