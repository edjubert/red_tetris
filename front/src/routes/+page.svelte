<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { user } from '$lib/user';
	import Input from '$lib/Input.svelte';
	import { setupI18n, _, isLocaleLoaded } from '../services/i18n';

	let userinput: any;

	onMount(() => {
		if (!$isLocaleLoaded) {
			setupI18n();
		}

		userinput.focus?.();
		userinput.setValue?.($user);
		userinput.setError?.(history.state.userNameError);
	});

	const verifyInput = (value: string) => {
		if (!value.trim()) {
			return 'username required';
		}

		if (!/^[a-z0-9_-]*$/i.test(value.trim())) {
			return 'username bad format';
		}
	};
</script>

<main class="main">
	{#if $isLocaleLoaded}
		<form
			class="card"
			on:submit={(e) => {
				e.preventDefault();

				console.log({ userinput, isOk: userinput.ok?.() });
				if (!userinput.ok?.()) {
					return;
				}

				user.set(userinput.getValue());
				goto('/rooms');
			}}
		>
			<h2>{$_('home.username')}</h2>

			<Input
				bind:this={userinput}
				maxlength="16"
				placeholder={$_('home.username')}
				verify={verifyInput}
			/>

			<button class="red-button">{$_('home.play')}</button>
		</form>
	{/if}
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
