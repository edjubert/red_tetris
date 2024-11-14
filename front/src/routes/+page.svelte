<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { user } from '$lib/user';
	import Input from '$lib/Input.svelte';
	import { setupI18n, _, isLocaleLoaded } from '../services/i18n';
	import { verifyInput } from '$lib/verifyInput';

	let userinput: Input;

	onMount(() => {
		if (!$isLocaleLoaded) {
			setupI18n();
		}

		userinput?.focus?.();
		userinput?.setValue?.($user);
		userinput?.setError?.(history.state.userNameError);
	});
</script>

<main class="main">
	{#if $isLocaleLoaded}
		<form
			class="card"
			on:submit={(e) => {
				e.preventDefault();

				if (!userinput.ok?.()) {
					return;
				}

				user.set(userinput.getValue());
				goto(`/rooms`, { replaceState: true });
			}}
		>
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

	.card:hover {
		border-color: var(--theme-teal);
	}
	.card > .red-button:hover {
		border-color: var(--theme-teal);
	}
</style>
