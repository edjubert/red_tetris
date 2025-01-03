<script lang="ts">
	import { user } from '$lib/user';
	import { socket } from '$lib/user_browser';
	import { _ } from '../../services/i18n';
	import { goto } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import { verifyInput } from '$lib/verifyInput';
	import { onMount } from 'svelte';
	import Listener from '$lib/Listener.svelte';
	import type { ListenerHandler, RoomList, Score, ScoreList } from '$lib/types';

	let userScores = $state<Score[]>([]);
	let bestScores = $state<Score[]>([]);

	let roomList = $state<{ name: string; nbOfPlayers: number }[]>([]);

	let roominput: Input;

	const handleScoresList = (scores: ListenerHandler) => {
		userScores = (scores as ScoreList).userScores;
		bestScores = (scores as ScoreList).bestScores;
	};

	const handleRoomList = (_roomList: ListenerHandler) => {
		roomList = _roomList as RoomList[];
	};

	onMount(() => {
		if (!verifyInput($user).valid) {
			goto('/');
		}
		socket.emit('getRoomList');
		socket.emit('getScoresList', $user);

		roominput.focus();
		roominput.setError(history.state?.roomnameError);
	});
</script>

<Listener handler={handleScoresList} on="scoresList" />
<Listener handler={handleRoomList} on="roomList" />

<main>
	<div class="greetings">
		<h1>{$_('rooms.hello') + ' ' + $user}</h1>
	</div>
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
				<p style="text-align: center">{$_('rooms.no_user_score')}</p>
			{/if}
		</div>

		<div class="vflex">
			<form
				class="card create-room"
				onsubmit={(e) => {
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
				<button class="red-button">{$_('rooms.create_or_join_button')}</button>
			</form>

			<div class="card room-list">
				<h2>{$_('rooms.room_list')}</h2>
				{#each roomList as room}
					<div class="room-card">
						<p class="room-list-title">{room.name}</p>
						<p class="room-number">{room.nbOfPlayers}</p>
						<button class="red-button room-button" onclick={() => goto(`/${room.name}/${$user}`)}>
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
				<p style="text-align: center">{$_('rooms.no_best_score')}</p>
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
	.greetings {
		width: 100%;
		text-align: center;
	}
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
