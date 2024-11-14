<script lang="ts">
	import { browser } from '$app/environment';
	import { _ } from '../../../services/i18n';
	import { socket, user } from '$lib/user';
	import { onMount } from 'svelte';
	import Listener from '$lib/Listener.svelte';
	import { goto } from '$app/navigation';

	let roomname: string = '';
	let users: any[] = [];
	let owner: boolean = false;
	let gameMode: string = '';

	const syncGameMode = (gameMode?: string): void => {
		if (browser) socket.emit(`gameMode:${roomname}`, gameMode);
	};

	const joinRoom = (): void => {
		console.log({ roomname, user: $user, isBot: false });
		socket.emit('joinRoom', { roomname, user: $user, isBot: false });
		syncGameMode(undefined);
	};

	onMount(() => {
		roomname = location.hash.slice(1).toLocaleLowerCase();
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
	on="join:{roomname}"
/>

<Listener
	handler={() => {
		goto('/{roomname}/{$user}');
	}}
	on="start:{roomname}"
/>

<Listener handler={joinRoom} on="connect" />

<Listener
	handler={(_gameMode) => {
		gameMode = _gameMode.gameMode;
	}}
	on="gameMode:{roomname}"
/>

<Listener
	handler={() => {
		owner = true;
	}}
	on="owner:{roomname}"
/>

<main>
	<div class="card">
		<h1>{roomname}</h1>
		{#each users as user}
			<div>- {user}</div>
		{/each}

		<div class="action {owner ? '' : 'disabled'}">
			{#each ['slow', 'medium-slow', 'medium-fast', 'fast'] as action}
				<input
					type="radio"
					id={action}
					value={action}
					bind:group={gameMode}
					name="gameMode"
					on:change={() => syncGameMode(gameMode)}
				/>

				<label for={action}>
					<button class="red-button {action}">
						<img src="/icons/game-mode/{action}.png" alt={action} />
					</button>
				</label>
			{/each}
		</div>

		<div class="action">
			<button
				class="red-button"
				on:click={() => {
					socket.emit('leaveRoom');
					goto('/rooms');
				}}
			>
				{$_('room.leave')}
			</button>

			{#if owner}
				<button class="red-button" on:click={() => socket.emit(`start:${roomname}`)}>
					{$_('room.start')}
				</button>
			{/if}
		</div>
	</div>

	{#if !owner}
		<p>{$_('room.waiting_to_start')}</p>
	{/if}
</main>

<style>
	input[type='radio'] {
		display: none;
	}

	.red-button img {
		width: 100%;
	}

	.disabled label {
		transform: none !important;
		box-shadow: 8px 8px var(--shadow) !important;
		cursor: not-allowed;
	}

	.card:hover {
		border-color: var(--theme-sapphire);
	}
	.action > .red-button:hover {
		border-color: var(--theme-sapphire);
	}
	.action > label > .slow {
		border-color: var(--theme-sapphire);
	}
</style>
