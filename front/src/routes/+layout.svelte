<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';

	import { user, connected } from '$lib/user';
	import ThemeToggle from '../ThemeToggle.svelte';
	import ThemeContext from '../ThemeContext.svelte';
	import { setupI18n, _ } from '../services/i18n';
	import '$lib/style.css';

	async function setup() {
		console.log('setup');
		return await Promise.allSettled([setupI18n()]);
	}
	const setupResult = setup();

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

{#await setupResult}
	<img src="/icons/wait.png" alt="wait" class="wait" />
{:then}
	<slot />
	{#if !$connected}
		<div class="disconnected">{$_('layout.disconnected')}</div>
	{/if}
{:catch error}
	<p>{error}</p>
{/await}

<style lang="css">
	.wait {
		width: 10%;
	}
	.top-navigation {
		display: flex;
		position: fixed;
		background-color: var(--theme-base);
		border-bottom: 1px solid var(--theme-base);
		box-shadow: 0 0 40px 30px var(--theme-base);
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
