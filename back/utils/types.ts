export type GameMode = string;

export type Room = {
	name: string;
	started?: boolean;
	nbOfPlayers: number;
	players?: string[];
	owner?: string;
};
