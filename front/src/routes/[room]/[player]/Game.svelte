<script lang="ts">
	import { _ } from '../../../services/i18n';
	import { muted, user } from '$lib/user';
	import { socket } from '$lib/user_browser';
	import ButtonLeave from '../../../components/ButtonLeave.svelte';
	import ButtonRestart from '../../../components/ButtonRestart.svelte';
	import Listener from '$lib/Listener.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { GameInfo, ListenerHandler, Score } from '$lib/types';

	export let roomname: string;
	export let restart: () => void;
	let usersBoard = new Map();
	let gameover = false;

	let board = new Array(20).fill(0).map(() => new Array(10).fill(0));

	let score = 0;
	let lines = 0;

	let owner = false;

	let indestructibleLines = 0;

	let nextShape: { shape: never[][]; colorid?: number } = {
		shape: []
	};

	let endPlayerList: Score[] = [];
	let isEndGame = false;

	function handleConnect() {
		socket.emit('initgame', roomname);
	}

	const handleEndgame = (playerList: ListenerHandler) => {
		endPlayerList = playerList as Score[];
		isEndGame = true;
	};

	const handleOwner = () => (owner = true);
	const handleNotAuthorized = () => {
		goto('/rooms');
	};
	const handleRestart = (playerList: ListenerHandler) => {
		handleEndgame(playerList);
		restart();
	};

	const handleGameInfo = (data: ListenerHandler) => {
		const gameInfo = data as GameInfo;
		if (gameInfo.clientId === socket.id) {
			if (gameInfo.gameover) gameover = true;
			else {
				indestructibleLines = gameInfo.indestrutibleLines;
				board = gameInfo.board;
				score = gameInfo.scores.score;
				lines = gameInfo.scores.lines;
				nextShape = gameInfo.nextShape;
			}
		} else {
			if (gameInfo.gameover) {
				usersBoard.set(gameInfo.clientId, {
					...usersBoard.get(gameInfo.clientId),
					gameover: true
				});
			} else {
				usersBoard.set(gameInfo.clientId, {
					username: gameInfo.username,
					heights: gameInfo.heights,
					scores: gameInfo.scores
				});
			}
			usersBoard = usersBoard;
		}
	};

	const handleSound = (track: ListenerHandler) => {
		if (browser && !$muted) {
			new window.Audio(`/sound/${track}.wav`).play();
		}
	};

	onMount(() => {
		if (!roomname) goto('/rooms');
		handleConnect();
	});
</script>

<svelte:window onkeydown={(e) => socket.emit(`event:${roomname}`, e.key)} />

<Listener handler={handleOwner} on="owner:{roomname}" />
<Listener handler={handleNotAuthorized} on="notauthorized:{roomname}" />
<Listener handler={handleConnect} on="connect" />
<Listener handler={handleEndgame} on="endgame:{roomname}" />
<Listener handler={handleRestart} on="restart:{roomname}" />
<Listener handler={handleGameInfo} on="gameInfo:{roomname}" />
<Listener handler={handleSound} on="sound:{roomname}" />

<main>
	<button class="mute-button" on:click={() => muted.set(!$muted)}>
		<img src={`/icons/${$muted ? 'no-sound.png' : 'sound.png'}`} alt="sound" />
	</button>

	<aside class="others">
		{#each [...usersBoard.entries()] as [_, { username, heights, scores, gameover }]}
			<div class="card">
				{username}<br />
				{scores.score}
				<div class="small-board {gameover ? 'small-gameover' : ''}">
					{#each heights as height}
						<div style="height: {(height / 20) * 100}%"></div>
					{/each}
				</div>
			</div>
		{/each}
	</aside>

	<div class="container">
		{#if gameover}
			<div class="gameover">
				<h2>{$_('game.gameover')}</h2>
				<div class="gameover-score">
					{$_('game.score')}<br />
					{score}
				</div>
			</div>
		{/if}

		<div class="board">
			{#each board as row}
				<div class="row">
					{#each row as cell}
						<div class="cell cell-{cell}"></div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<aside class="self card">
		<h3>{roomname}</h3>
		<h3>{$user}</h3>
		<div>
			<div class="score">
				{$_('game.high_score')}<br />
				0<br />
			</div>
			<div class="score">
				{$_('game.score')}<br />
				{score}<br />
			</div>
			<div class="score">
				{$_('game.lines')}<br />
				{lines}<br />
			</div>
			<div class="score">
				{$_('game.incoming_lines')}<br />
				{indestructibleLines}<br />
			</div>
			<br />

			<div class="board next-piece">
				{#each nextShape.shape as row}
					<div class="row">
						{#each row as cell}
							<div class="cell cell-{cell ? nextShape.colorid : 0}"></div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		{#if !isEndGame}
			<ButtonLeave />
		{/if}
	</aside>

	{#if isEndGame}
		<div class="card card-endgame">
			<h2>{$_('game.scores_label')}</h2>
			<div class="score-div">
				<p>{$_('game.scores_top')}</p>
				<p>{$_('game.scores_name')}</p>
				<p>{$_('game.scores_score')}</p>
			</div>

			{#each endPlayerList as player, i}
				<div class="score-div">
					<p>{i + 1}</p>
					<p>{player.username}</p>
					<p>{player.score}</p>
				</div>
				<hr />
			{/each}

			<div class="action">
				<ButtonLeave />

				{#if owner}
					<ButtonRestart {roomname} />
				{/if}
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		overflow: hidden;
		width: 100vw;
		height: 80%;
		background: var(--theme-base);
		display: flex;
		gap: 20px;
		justify-content: center;
	}
	.mute-button {
		position: fixed;
		top: 2%;
		left: 75%;
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
	}
	.mute-button img {
		height: 50px;
	}
	.others {
		max-width: 15vw;
		overflow-y: auto;
		padding-right: 10px;
	}
	.others > div {
		width: 100%;
	}

	.small-board {
		display: flex;
		aspect-ratio: 1/2;
		background: var(--theme-overlay2);
	}
	.small-board > div {
		background: var(--theme-overlay0);
		flex: 1;
	}
	.small-gameover {
		filter: brightness(0.3) saturate(0.6);
	}

	.container {
		width: 100%;
		max-width: calc(90vh / 2);
		position: relative;
		height: fit-content;
	}
	.board {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 4px;
		overflow: hidden;
		transition: 0.4s;
	}
	.gameover + .board {
		filter: brightness(0.5) saturate(0.8);
	}

	.row {
		display: flex;
		gap: 4px;
	}
	.cell {
		flex: 1;
		aspect-ratio: 1/1;
		border-radius: 1px;
		transition: 0.04s;
		background: var(--theme-surface0);
		--shadow: inset 0 0 0 5px var(--theme-surface1), inset -5px -5px var(--theme-surface1);
		box-shadow:
			var(--shadow),
			0 0 6px var(--theme-surface2);
	}
	.score-div {
		display: flex;
		justify-content: space-between;
	}
	.cell-9 {
		background: radial-gradient(
			circle at 5px 4px,
			var(--theme-overlay0) 0%,
			var(--theme-overlay1) 49%
		);
		color: var(--theme-base);
	}
	.cell-1 {
		background-color: var(--theme-rosewater);
		border-color: var(--theme-rosewater);
		box-shadow: var(--theme-rosewater);
	}
	.cell-2 {
		background-color: var(--theme-flamingo);
		border-color: var(--theme-flamingo);
		box-shadow: var(--theme-flamingo);
	}
	.cell-3 {
		background-color: var(--theme-pink);
		border-color: var(--theme-pink);
		box-shadow: var(--theme-pink);
	}
	.cell-4 {
		background-color: var(--theme-mauve);
		border-color: var(--theme-mauve);
		box-shadow: var(--theme-mauve);
	}
	.cell-5 {
		background-color: var(--theme-red);
		border-color: var(--theme-red);
		box-shadow: var(--theme-red);
	}
	.cell-6 {
		background-color: var(--theme-maroon);
		border-color: var(--theme-maroon);
		box-shadow: var(--theme-maroon);
	}
	.cell-7 {
		background-color: var(--theme-peach);
		border-color: var(--theme-peach);
		box-shadow: var(--theme-peach);
	}
	.cell-8 {
		background-color: var(--theme-lavender);
		border-color: var(--theme-lavender);
		box-shadow: var(--theme-lavender);
		opacity: 0.3;
	}
	.cell-0,
	.cell-8 {
		--shadow-color: var(--theme-mantle);
		box-shadow: var(--theme-subtext2);
	}
	.cell-0 {
		--color: var(--theme-overlay0);
	}
	@keyframes popin {
		0% {
			transform: scale(0);
		}
	}
	.gameover {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
		gap: 20px;
		z-index: 999;
		animation: 0.5s popin forwards;
	}
	@keyframes grow {
		to {
			height: 2.5em;
			opacity: 1;
		}
	}
	.gameover-score {
		overflow: hidden;
		height: 0;
		opacity: 0;
		animation: 0.3s 0.5s grow ease-out forwards;
	}
	@keyframes fade {
		to {
			opacity: 1;
		}
	}
	aside {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.score {
		margin-top: 20px;
		background-color: var(--theme-surface1);
		border-radius: 5px;
		padding: 5px;
		width: 100%;
		box-shadow: 0 0 40px 0 var(--theme-base);
	}

	.small-board {
		display: flex;
		aspect-ratio: 1/2;
		background: var(--back-1);
	}
	.small-board > div {
		background: var(--grey-back-1);
		flex: 1;
	}
	.small-gameover {
		filter: brightness(0.3) saturate(0.6);
	}

	.others {
		max-width: 15vw;
		overflow-y: auto;
		padding-right: 10px;
	}
	.others > div {
		width: 100%;
	}
	.self {
		max-width: 20vw;
	}
	.next-piece {
		width: 4rem;
	}

	@keyframes endgame-anim {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		75% {
			transform: translate(-50%, -50%) scale(1.1);
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
	.mute-button {
		position: fixed;
		top: 2%;
		left: 75%;
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
	}
	.card-endgame {
		box-shadow: 0 0 50px -15px var(--grey-back-0);
		position: fixed;
		z-index: 9999;
		overflow: auto;
		top: 50%;
		left: 50%;
		animation: 0.5s endgame-anim cubic-bezier(0.42, 0, 0.21, 1.4) forwards;
	}
</style>
