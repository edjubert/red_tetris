<script lang="ts">
	import { onMount } from 'svelte';
	import { socket } from '$lib/user';
	import Listener from '$lib/Listener.svelte';
	import type { PageData } from './$types';
	import type { Room } from '$lib/types';
	import { _ } from '../../../services/i18n';
	import { goto } from '$app/navigation';
	import Game from '../../../components/Game.svelte';
	import { browser } from '$app/environment';

	let roomData = $state<Room>();
	let owner = false;
	let { data }: { data: PageData } = $props();

	const initGame = (): void => {
		socket.emit('initGame', data.room);
	};

	const syncGameMode = (gameMode?: string): void => {
		if (browser) socket.emit(`gameMode:${data.room}`, gameMode);
	};

	const joinRoom = (): void => {
		socket.emit('joinRoom', { roomname: data.room, user: data.player });
		syncGameMode(undefined);
	};
	onMount(() => {
		// socket.emit('getRoomData', data.room, data.player);
		if (browser) joinRoom();
		return () => {
			owner = false;
		};
	});
</script>

<Listener
	handler={(_roomData) => {
		roomData = _roomData;
	}}
	on="roomData:{data.room}"
/>

<Listener
	handler={() => {
		goto('/');
	}}
	on="unauthorized:{data.room}:{socket?.id}"
/>

{#if !roomData?.started}
	{#if roomData?.owner === data.player}
		<div class="owner">
			<p>Name: {roomData?.name}</p>
			<p>Owner: {roomData?.owner} YOU</p>
			<p>Started: {roomData?.started}</p>
			{#each roomData?.players ?? [] as player}
				<p>- {player}</p>
			{/each}

			<button class="start" onclick={initGame}>{$_('room.start')}</button>
		</div>
	{:else}
		<div class="not-empty">
			<p>Name: {roomData?.name}</p>
			<p>Owner: {roomData?.owner}</p>
			<p>Started: {roomData?.started}</p>
			{#each roomData?.players ?? [] as player}
				<p>- {player}</p>
			{/each}
		</div>
	{/if}
{:else}
	<Game />
{/if}
