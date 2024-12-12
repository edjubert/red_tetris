import { type Writable, writable } from 'svelte/store';

export const user: Writable<string> = writable();
export const room: Writable<string> = writable();
export const connected: Writable<boolean> = writable(true);
export const muted: Writable<boolean> = writable(false);

export function writableLocalStorage(writable: Writable<string>, key: string) {
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
}
