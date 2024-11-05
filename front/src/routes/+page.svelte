<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation'

	import { user } from "$lib/user";
	import Input from '$lib/Input.svelte';
	import ThemeContext from '../ThemeContext.svelte';
	import ThemeToggle from '../ThemeToggle.svelte';

	let userinput: Input

	onMount(() => {
		userinput.focus();
		userinput.setValue($user);
		userinput.setError(history.state.userNameError);
	})
</script>

<main class="main">

	<form class="card" on:submit={e => {
	e.preventDefault();

	if (!userinput.ok()) {
		return
	}

	user.set(userinput.getValue());
	goto('/rooms');
}}>
		<h2>username</h2>

		<Input
			bind:this={userinput}
			maxlength="16"
			placeholder="Username"
			verify={(value) => {
			if (!value.trim()) {
				return 'username required'
			}

			if (!/^[a-z0-9_-]*$/i.test(value.trim())) {
				return 'username bad format'
				}
		}}
		/>

		<button class="red-button">PLAY</button>
	</form>
</main>

<style lang="css">
		:global(html) {
				background-color: var(--theme-base);
				color: var(--theme-text);
		}

		main {
				font-family: sans-serif;
				text-align: center;
		}
</style>