<script lang="ts">
	import { socket } from '$lib/user';
	import { _ } from '../../../services/i18n';
	import { goto } from '$app/navigation';

	export let room: string;
	export let users: string[];
	export let owner: boolean;
	export let gameMode: string;
	export let syncGameMode: (gameMode: string) => void;
</script>

<div class="card">
	<h1>{room}</h1>
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
				onchange={() => {
					console.log({ newGameMode: gameMode, action });
					syncGameMode(gameMode);
				}}
			/>

			<label for={action}>
				<button disabled={!owner} class="red-button {action} {owner ? '' : 'disabled'}">
					<img src="/icons/game-mode/{action}.png" alt={action} />
				</button>
			</label>
		{/each}
	</div>

	<div class="action">
		<button
			class="red-button leave"
			onclick={() => {
				socket.emit('leaveRoom');
				goto('/rooms');
			}}
		>
			{$_('room.leave')}
		</button>

		{#if owner}
			<button class="red-button start" onclick={() => socket.emit(`start:${room}`)}>
				{$_('room.start')}
			</button>
		{/if}
	</div>
</div>

{#if !owner}
	<p>{$_('room.waiting_to_start')}</p>
{/if}

<style>
	input[type='radio'] {
		display: none;
	}

	.red-button img {
		width: 100%;
	}

	.card:hover,
	.action > .red-button:hover {
		border-color: var(--theme-rosewater);
	}
	.action > .red-button.start:hover {
		background-color: var(--theme-green);
		border-color: var(--theme-green);
		color: var(--theme-mantle);
	}
	.action > .red-button.leave:hover {
		background-color: var(--theme-red);
		border-color: var(--theme-red);
		color: var(--theme-mantle);
	}
	.action > label > .slow:focus,
	.action > label > .slow:hover {
		border-color: var(--theme-yellow);
	}
	.action > label > .medium-slow:hover,
	.action > label > .medium-slow:focus {
		border-color: var(--theme-peach);
	}
	.action > label > .medium-fast:focus,
	.action > label > .medium-fast:hover {
		border-color: var(--theme-maroon);
	}
	.action > label > .fast:focus,
	.action > label > .fast:hover {
		border-color: var(--theme-red);
	}

	.action > label > .disabled {
		transform: none !important;
		box-shadow: 8px 8px var(--shadow) !important;
		cursor: not-allowed;
		border-color: var(--theme-mantle);
		opacity: 0.6;
	}
	.action > label > .disabled:hover {
		border-color: var(--theme-mantle);
	}
</style>
