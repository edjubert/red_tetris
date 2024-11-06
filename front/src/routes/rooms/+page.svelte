<script lang="ts">
	import { onMount } from 'svelte';
	import { socket, user } from '$lib/user';
	import Listener from '$lib/Listener.svelte';
	import type { Room, AllScore, Score } from '$lib/types'
	import { goto } from '$app/navigation';
	import {_} from '../../services/i18n'
	import Input from '$lib/Input.svelte';

	let roominput
	let userScores: Score[] = []
	let bestScores: Score[] = []

	let roomList: {name: string, nb: number}[]= []

	onMount(() => {
		socket.emit('getRoomList')
		socket.emit('getScoresList', $user)
		roominput.focus()
		roominput.setError(history.state.roomNameError)
	})
</script>

<Listener handler={(_roomList: Room[]) => {roomList = _roomList}} on="roomList"/>
<Listener handler={(scores: AllScore) => {
	userScores = scores.userScores
	bestScores = scores.bestScores
}} on="scoresList"/>

<div class="hflex">
	<div class="card scores">
		<h2>{$_("rooms.user_scores")}</h2>
		{#if userScores.length}
			{#each userScores as score}
				<div class="score">
					<span>{score.username}</span>
					<span>{score.score}</span>
				</div>
			{/each}
		{:else}
			<p style="text-align: center">{$_('rooms.no_game_yet')}</p>
		{/if}
	</div>
	<div class="vflex">
		<form class="card" on:submit={e => {
			e.preventDefault()
			if (!roominput.ok()) return
			goto(`/room#${roominput.getvalue().toLowerCase()}`)
		}}>
			<h2>{$_('rooms.create_or_join_room')}</h2>
			<Input
				bind:this={roominput}
				maxlength="16"
				placeholder={$_('rooms.roomname_placeholder')}
				verify={value => {
					if (!value) return 'roomname required'
					if (!/^[a-z0-9_-]*$/i.test(value.trim())) return 'roomname bad format'
				}}
			/>
				<button class="red-button">{$_('rooms.join_room_button_label')}</button>
		</form>

		<div class="card">
			<h2>{$_('room_list')}</h2>
			{#if roomList.length}
				{#each roomList as room}
					<div class="room-card">
						<p class="room-list-title">{room.name}</p>
						<p class="room-number">{room.nb}</p>
						<button class="red-button room-button"
										on:click={goto(`room#${room.name}`)}>{$_('rooms.join_room_button_label')}</button>
					</div>
				{/each}
			{:else}
					<p>{$_('rooms.no_room_available')}</p>
			{/if}
		</div>
	</div>
	<div class="card scores">
		<h2>{$_('rooms.best_scores')}</h2>
		{#if bestScores.length}
			{#each bestScores as score}
				<div class="score">
					<span>{score.username}</span>
					<span>{score.score}</span>
				</div>
			{/each}
		{:else}
			<p style="text-align: center">{$_('rooms.no_game_yet')}</p>
		{/if}
	</div>
</div>
