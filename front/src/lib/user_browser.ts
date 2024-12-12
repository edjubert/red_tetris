import { browser } from '$app/environment';
import { io, type Socket } from 'socket.io-client';
import { connected, muted, room, user, writableLocalStorage } from '$lib/user';
import type { Writable } from 'svelte/store';

export let socket: Socket;

if (browser) {
	writableLocalStorage(user as Writable<never>, 'user');
	writableLocalStorage(room as Writable<never>, 'room');
	writableLocalStorage(muted as Writable<never>, 'muted');

	socket = io('http://localhost:4000', { transports: ['websocket'] });
	socket.on('connect', () => connected.set(true));
	socket.on('connect_error', () => connected.set(false));
	socket.on('disconnect', () => connected.set(false));
}
