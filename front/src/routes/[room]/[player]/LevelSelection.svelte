<script lang="ts">
	import { socket } from '$lib/user';
	import { _ } from '../../../services/i18n';
	import { goto } from '$app/navigation';

	let {
		room,
		users,
		owner,
		gameMode,
		syncGameMode
	}: {
		room: string;
		users: string[];
		owner: boolean;
		gameMode: string;
		syncGameMode: (gameMode?: string) => void;
	} = $props();
</script>

<div class="card">
	<h1>{room}</h1>
	<p>{users}</p>
	<p>{gameMode}</p>
	{#each users as user}
		<div>- {user}</div>
	{/each}

	<div class="action {owner ? '' : 'disabled'}">
		{#each ['slow', 'medium-slow', 'medium-fast', 'fast'] as action}
			<button
				class="red-button {action} {gameMode === action && 'isActive'} {owner ? '' : 'disabled'}"
				onclick={() => {
					if (!owner) return;
					gameMode = action;
					syncGameMode(action);
				}}
			>
				<img src="/icons/game-mode/{action}.png" alt={action} />
			</button>
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
	.action > .slow:focus,
	.action > .slow.isActive,
	.action > .slow:hover {
		border-color: var(--theme-yellow);
	}
	.action > .medium-slow:hover,
	.action > .medium-slow.isActive,
	.action > .medium-slow:focus {
		border-color: var(--theme-peach);
	}
	.action > .medium-fast:focus,
	.action > .medium-fast.isActive,
	.action > .medium-fast:hover {
		border-color: var(--theme-maroon);
	}
	.action > .fast:focus,
	.action > .fast.isActive,
	.action > .fast:hover {
		border-color: var(--theme-red);
	}

	.action > .disabled {
		transform: none !important;
		box-shadow: 8px 8px var(--shadow) !important;
		cursor: not-allowed;
		border-color: var(--theme-mantle);
		opacity: 0.6;
	}
	.action > .disabled:hover {
		border-color: var(--theme-mantle);
	}
</style>
