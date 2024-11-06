<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import { catppuccinThemes as _themes, DEFAULT_THEME } from '$lib/themes';
	import type { Theme as ThemeType } from '$lib/themes';

	export let themes = [..._themes];
	let _current = themes[themes.length - 1].name;

	const getCurrentTheme = (name: string) => themes.find((h: ThemeType) => h.name === name);
	const Theme = writable(getCurrentTheme(_current));
	setContext('theme', {
		theme: Theme,
		setTheme: (name: string) => {
			const _current: string = getCurrentTheme(name) ? name : DEFAULT_THEME;
			const newTheme = getCurrentTheme(_current);

			Theme.update((t) => ({ ...t, ...newTheme }));
			setRootColors(newTheme);
		}
	});

	onMount(() => {
		setRootColors(getCurrentTheme(_current));
	});

	const setRootColors = (theme: ThemeType | undefined): void => {
		for (let [prop, color] of Object.entries(theme?.colors || themes[0].colors)) {
			let varString = `--theme-${prop}`;
			document.documentElement.style.setProperty(varString, color);
		}
		document.documentElement.style.setProperty('--theme-name', theme?.name || themes[0].name);
	};
</script>

<slot></slot>
