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

<select bind:value={selected} onchange={handleSubmit}>
	{#each themeSelector as t}
		<option value={t.name}>{t.name}</option>
	{/each}
</select>
