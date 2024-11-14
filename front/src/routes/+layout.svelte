<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';

	import { user, connected } from '$lib/user';
	import ThemeToggle from '../ThemeToggle.svelte';
	import ThemeContext from '../ThemeContext.svelte';
	import { setupI18n, isLocaleLoaded, _ } from '../services/i18n';
	import '$lib/style.css';

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
	<div class="top-navigation">
		<a href="/" id="logo">
			<img alt="logo" src="/icons/tetris.png" />
		</a>
		<ThemeToggle />
	</div>
</ThemeContext>

<slot />
{#if !$connected}
	<div class="disconnected">{$_('layout.disconnected')}</div>
{/if}

<style lang="css">
	.top-navigation {
		display: flex;
		position: absolute;
		top: 0;
		padding: 10px;
		width: 100%;
		justify-content: space-between;
	}

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
		width: 50px;
		height: 50px;
	}
</style>
