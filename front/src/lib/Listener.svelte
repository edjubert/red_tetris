<script lang="ts">
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { socket } from '$lib/user_browser';
	import type { ListenerHandler } from '$lib/types';

	export let on: string;

	export let handler: (room: ListenerHandler) => void;

	let old_on: string;
	let w_on = writable<string>();

	$: w_on.set(on);

	if (browser) {
		onMount(() => {
			w_on.subscribe((new_on: string) => {
				socket.removeListener(old_on, handler);
				old_on = new_on;
				socket.on(old_on, handler);
			});

			return () => {
				socket.removeListener(old_on, handler);
			};
		});
	}
</script>
