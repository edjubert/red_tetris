import { type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const user: Writable<string> = writable();
export const connected: Writable<boolean> = writable(true);
export let socket: Socket;
export const muted: Writable<boolean> = writable(false);

function writableLocalStorage(writable: Writable<string>, key: string) {
	const value = localStorage.getItem(key);
	if (value) {
		writable.set(value);
	}

	writable.subscribe((value: string | undefined) => {
		if (value === undefined || value === '') {
			return;
		}

		localStorage.setItem(key, value);
	});

	if (browser) {
		writableLocalStorage(user as Writable<never>, 'user');
		writableLocalStorage(muted as Writable<never>, 'muted');

		socket = io('/');
		socket.on('connect', () => connected.set(true));
		socket.on('connect_error', () => connected.set(false));
		socket.on('disconnect', () => connected.set(false));
	}
}
