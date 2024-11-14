<script lang="ts">
	import { user, socket } from '$lib/user';
	import { _ } from '../../services/i18n';
	import { goto } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import { verifyInput } from '$lib/verifyInput';
	import { onMount } from 'svelte';

	let userScores: { username: string; score: number }[] = [];
	let bestScores: { username: string; score: number }[] = [];

	let roomList: { name: string; nbPlayer: number }[] = [];

	let roominput: Input;

	onMount(() => {
		socket.emit('getRoomList');
		socket.emit('getScoresList', $user);

		roominput.focus();
		roominput.setError(history.state.roomnameError);
	});
</script>

<main class="main">
	<div class="hflex">
		<div class="card scores user-scores">
			<h2>{$_('rooms.user_scores')}</h2>
			{#each userScores as score}
				<div class="score">
					<span>{score.username}</span>
					<span>{score.score}</span>
				</div>
			{/each}

			{#if !userScores.length}
				<p style="text-align: center">{$_('rooms.no_game_yet')}</p>
			{/if}
		</div>

		<div class="vflex">
			<form
				class="card create-room"
				on:submit={(e) => {
					e.preventDefault();
					if (!roominput.ok()) return;
					goto(`/${roominput.getValue().toLowerCase()}/${$user}`, { replaceState: true });
				}}
			>
				<h2>{$_('rooms.create_or_join_room')}</h2>
				<Input
					bind:this={roominput}
					maxlength={16}
					placeholder={$_('rooms.roomname_placeholder')}
					verify={verifyInput}
				/>
				<button class="red-button">{$_('rooms.join')}</button>
			</form>

			<div class="card room-list">
				<h2>{$_('rooms.room_list')}</h2>
				{#each roomList as room}
					<div class="room-card">
						<p class="room-list-title">{room.name}</p>
						<p class="room-number">{room.nbPlayer}</p>
						<button class="red-button room-button" on:click={() => goto(`/${room.name}/${$user}`)}>
							{$_('rooms.join')}
						</button>
					</div>
				{/each}

				{#if !roomList.length}
					<p>{$_('rooms.no_room_available')}</p>
				{/if}
			</div>
		</div>

		<div class="card scores best-scores">
			<h2>{$_('rooms.best_scores')}</h2>
			{#if !bestScores.length}
				<p style="text-align: center">{$_('rooms.no_game_yet')}</p>
			{/if}
			{#each bestScores as score}
				<div class="score">
					<span>{score.username}</span>
					<span>{score.score}</span>
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	.room-list-title {
		font-size: 1.5rem;
		flex: 1;
	}
	.room-card {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.room-button {
		font-size: 1rem;
		padding: 10px;
	}
	.room-number {
		font-size: 1.3rem;
	}
	.score {
		display: flex;
		justify-content: space-between;
	}

	.vflex,
	.hflex {
		display: flex;
		gap: 40px;
	}
	.vflex {
		flex-direction: column;
	}
	.scores {
		max-width: 350px;
	}

	.user-scores:hover {
		border-color: var(--theme-flamingo);
	}
	.create-room:hover {
		border-color: var(--theme-peach);
	}
	.create-room > .red-button:hover {
		background-color: var(--theme-peach);
		border-color: var(--theme-peach);
		color: var(--theme-mantle);
	}
	.best-scores:hover {
		border-color: var(--theme-yellow);
	}
	.room-list:hover {
		border-color: var(--theme-red);
	}
</style>
