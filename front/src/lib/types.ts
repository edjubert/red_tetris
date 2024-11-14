export type Room = {
	name: string;
	owner: string;
	players: string[];
	started: boolean;
	gameMode: string;
};

export type GameInfo = {
	clientId: string;
	heights: number[];
	username: string;
	gameover: boolean;
	board: number[][];
	nextShape: any;
	indestrutibleLines: number;
	scores: {
		score: number;
		lines: number;
	};
};

export type ListenerHandler = Room | RoomList[] | ScoreList | Score[] | GameInfo | string;

export type Score = { username: string; score: number };
export type ScoreList = { userScores: Score[]; bestScores: Score[] };
export type RoomList = { name: string; nbOfPlayers: number };
