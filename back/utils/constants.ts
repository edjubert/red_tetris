export const IO_EVENTS = {
	CONNECTION: 'connection',
	ROOM_LIST: 'roomList',
}

export const SOCKET_EVENTS = {
	GET_ROOM_DATA: 'getRoomData',
	GET_ROOM_LIST: 'getRoomList',
	GET_SCORES_LIST: 'getScoresList',
	INIT_GAME: 'initGame',
	JOIN_ROOM: 'joinRoom',

	ERR_NOT_AUTHORIZED: 'notAuthorized',
	ERR_USERNAME_ERROR: 'userNameError',
	ERR_ROOMNAME_ERROR: 'roomNameError'
}

export const CLIENT_EVENTS = {
	START: 'start',
	RESTART: 'restart',
	JOIN: 'join',
	OWNER: 'owner',
	EVENT: 'event',
	INIT_GAME: 'initgame',
	END_GAME: 'endgame',
	GAME_MODE: 'gameMode',
	LEAVE: 'leaveRoom',
	DISCONNECT: 'disconnect'
}

export const HUMAN_PREFIX = '+human'
export type Board = number[][];
export type Sound = 'move' | 'rotate' | 'soft-drop' | 'hard-drop' | 'landing' | 'single' | 'double' | 'triple' | 'tetris';
