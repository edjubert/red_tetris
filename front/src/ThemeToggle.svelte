<script lang="ts">
	import { getContext } from 'svelte';

	import { catppuccinThemes, DEFAULT_THEME } from '$lib/themes';
	import type { Theme } from '$lib/themes';
	import type { Writable } from 'svelte/store';

	const { setTheme } = getContext<{ theme: Writable<Theme>; setTheme: (name: string) => void }>(
		'theme'
	);

	let themeSelector = $state<Theme[]>(catppuccinThemes);
	let selected = $state<string>(DEFAULT_THEME);
	const handleSubmit = (e: Event & { currentTarget: EventTarget & HTMLSelectElement }) => {
		e.preventDefault();
		setTheme(selected);
	};
</script>

<select bind:value={selected} class="red-button" onchange={handleSubmit}>
	{#each themeSelector as t}
		<option value={t.name}>{t.name}</option>
	{/each}
</select>

<style lang="css">
	select {
		padding: 5px;
		border-radius: 5px;
		height: 50%;
		appearance: none;
		text-indent: 1px;
		text-overflow: '';
	}
	.red-button:hover {
		border-color: var(--theme-green);
		background-color: var(--theme-green);
		color: var(--theme-mantle);
	}
</style>
