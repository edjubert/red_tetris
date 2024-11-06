<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { user, room } from '$lib/user';
	import Input from '$lib/Input.svelte';
	import { setupI18n, _, isLocaleLoaded } from '../services/i18n';

	let userinput: any;
	let roomname: any;

	onMount(() => {
		if (!$isLocaleLoaded) {
			setupI18n();
		}

		userinput?.focus?.();
		userinput?.setValue?.($user);
		userinput?.setError?.(history.state.userNameError);

		roomname?.focus?.();
		roomname?.setValue?.($room);
		roomname?.setError?.(history.state.roomNameError);
	});

	const verifyInput = (value: string) => {
		if (!value.trim()) {
			return 'field required';
		}

		if (!/^[a-z0-9_-]*$/i.test(value.trim())) {
			return 'bad format';
		}
	};
</script>

<main class="main">
	{#if $isLocaleLoaded}
		<form
			class="card"
			on:submit={(e) => {
				e.preventDefault();

				if (!userinput.ok?.() || !roomname.ok?.()) {
					return;
				}

				user.set(userinput.getValue());
				room.set(roomname.getValue());
				goto(`/${roomname.getValue()}/${userinput.getValue()}`, { replaceState: true });
			}}
		>
			<Input
				bind:this={userinput}
				maxlength="16"
				placeholder={$_('home.username')}
				verify={verifyInput}
			/>

			<Input
				bind:this={roomname}
				maxlength="16"
				placeholder={$_('home.roomname')}
				verify={verifyInput}
			/>

			<button class="button">{$_('home.play')}</button>
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

	.button {
		padding: 10px;
		width: 200px;
		border: none;
		background-color: var(--theme-teal);
		border-radius: 5px;
	}
</style>
