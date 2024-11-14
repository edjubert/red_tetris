<script lang="ts">
	import { browser } from '$app/environment';
	import { _ } from '../../../services/i18n';
	import { socket, user } from '$lib/user';
	import { onMount } from 'svelte';
	import Listener from '$lib/Listener.svelte';
	import { goto } from '$app/navigation';
	import LevelSelection from './LevelSelection.svelte';
	import Game from './Game.svelte';

	const { data } = $props();
	let users = $state<string[]>([]);
	let owner = $state<boolean>(false);
	let gameMode = $state<string>('');
	let started = $state<boolean>(false);

	const syncGameMode = (gameMode?: string): void => {
		if (browser) socket.emit(`gameMode:${data.room}`, gameMode);
	};

	const joinRoom = (): void => {
		if ($user !== data.player) goto('/', { state: { usernameError: 'username mismatch' } });
		socket.emit('joinRoom', { roomname: data.room, user: $user, isBot: false });
		syncGameMode(undefined);
	};

	onMount(() => {
		if (browser) joinRoom();
		return () => {
			owner = false;
		};
	});
</script>

<Listener
	handler={(roomnameError) => {
		goto('/rooms', { state: { roomnameError } });
	}}
	on="roomnameError"
/>

<Listener
	handler={(usernameError) => {
		goto('/', { state: { usernameError } });
	}}
	on="usernameError"
/>

<Listener
	handler={(_users) => {
		users = _users.players;
	}}
	on="join:{data.room}"
/>

<Listener
	handler={() => {
		started = true;
	}}
	on="start:{data.room}"
/>

<Listener handler={joinRoom} on="connect" />

<Listener
	handler={(_gameMode) => {
		gameMode = _gameMode.gameMode;
	}}
	on="gameMode:{data.room}"
/>

<Listener
	handler={() => {
		owner = true;
	}}
	on="owner:{data.room}"
/>

<main>
	{#if !started}
		<LevelSelection room={data.room} {users} {gameMode} {owner} {syncGameMode} />
	{:else}
		<Game roomname={data.room} />
	{/if}
</main>
