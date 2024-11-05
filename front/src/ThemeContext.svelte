<script lang="ts">
	import { setContext, onMount } from 'svelte'
	import { writable } from 'svelte/store'

	import { theme as _themes} from '$lib/themes';
	import type { Theme as ThemeType } from '$lib/themes'

	export let themes = [..._themes]
	let _current = themes[0].name

	const getCurrentTheme = (name: string) => themes.find((h: ThemeType) => h.name === name)
	const Theme = writable(getCurrentTheme(_current))
	setContext('theme', {
		theme: Theme,
		toggle: () => {
			let _currentIndex = themes.findIndex((h: ThemeType) => h.name=== _current)
			_current = themes[_currentIndex === themes.length - 1 ? 0 : _currentIndex += 1].name
			Theme.update(t => ({ ...t, ...getCurrentTheme(_current)}))
			setRootColors(getCurrentTheme(_current))
		}
	})

	onMount(() => {
		setRootColors(getCurrentTheme(_current))
	})

	const setRootColors = (theme: ThemeType | undefined): void => {
		for (let [prop, color] of Object.entries(theme?.colors || themes[0].colors)) {
			let varString = `--theme-${prop}`;
			document.documentElement.style.setProperty(varString, color)
		}
		document.documentElement.style.setProperty('--theme-name', theme?.name || themes[0].name)
	}
</script>

<slot></slot>