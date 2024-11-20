<script lang="ts">
	import { browser } from '$app/environment';
	import { socket, user } from '$lib/user';
	import { onMount } from 'svelte';
	import Listener from '$lib/Listener.svelte';
	import { goto } from '$app/navigation';
	import Game from './Game.svelte';
	import type { ListenerHandler, Room } from '$lib/types';
	import LevelSelection from './LevelSelection.svelte';

	const { data } = $props();
	let users = $state<string[]>([]);
	let owner = $state<boolean>(false);
	let gameMode = $state<string>('medium-slow');
	let started = $state<boolean>(false);

	const syncGameMode = (gameMode?: string): void => {
		if (browser) socket.emit(`gameMode:${data.room}`, gameMode);
	};

	const handleJoinRoom = (): void => {
		if ($user !== data.player) goto('/', { state: { usernameError: 'username mismatch' } });
		socket.emit('joinRoom', { roomname: data.room, user: $user, isBot: false });
		syncGameMode(undefined);
	};

	const handleRoomnameError = (roomnameError: ListenerHandler) => {
		goto('/rooms', { state: { roomnameError } });
	};

	const handleUsernameError = (usernameError: ListenerHandler) => {
		goto('/rooms', { state: { usernameError } });
	};

	const handleJoin = (_users: ListenerHandler) => {
		users = (_users as Room).players;
	};

	const handleGameMode = (_gameMode: ListenerHandler) => {
		gameMode = _gameMode as string;
	};

	const handleStart = () => {
		started = true;
	};

	const handleOwner = () => {
		owner = true;
	};

	const handleRestart = () => {
		started = false;
		if (browser) handleJoinRoom();
	};

	onMount(() => {
		if (browser) handleJoinRoom();
		return () => {
			owner = false;
		};
	});
</script>

<Listener handler={handleRoomnameError} on="roomnameError" />
<Listener handler={handleUsernameError} on="usernameError" />
<Listener handler={handleJoin} on="join:{data.room}" />
<Listener handler={handleStart} on="start:{data.room}" />
<Listener handler={handleJoinRoom} on="connect" />
<Listener handler={handleGameMode} on="gameMode:{data.room}" />
<Listener handler={handleOwner} on="owner:{data.room}" />

<main>
	{#if !started}
		<LevelSelection room={data.room} {users} {gameMode} {owner} {syncGameMode} />
	{:else}
		<Game restart={handleRestart} roomname={data.room} />
	{/if}
</main>
