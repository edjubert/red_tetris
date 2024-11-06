<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';

	import { user, connected } from '$lib/user';
	import ThemeToggle from '../ThemeToggle.svelte';
	import ThemeContext from '../ThemeContext.svelte';
	import { setupI18n, isLocaleLoaded } from '../services/i18n';

	let theme = getContext('theme');

	onMount(() => {
		if (!$isLocaleLoaded) {
			setupI18n();
		}
	});

	if (browser) {
		const checkPage = () => {
			if (location.pathname === '/') {
				return;
			}

			if ($user === '') {
				goto('/');
			}
		};

		afterNavigate(checkPage);
		user.subscribe(checkPage);
	}
</script>

<ThemeContext>
	<a href="/" id="logo">
		<img alt="logo" src="/red-tetris.png" />
	</a>
	<ThemeToggle />
</ThemeContext>

<slot />
{#if !$connected}
	<div class="disconnected">DISCONNECTED</div>
{/if}

<style lang="css">
	.disconnected {
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		background: var(--theme-base);
		color: var(--theme-text);
		text-align: center;
	}

	#logo img {
		width: 100px;
		height: 100px;
	}
</style>
