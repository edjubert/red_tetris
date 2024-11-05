<script lang="ts">
	export let verify, placeholder, maxlength

	let input: HTMLInputElement
	let error: Error
	let value = '';

	const ok = (): boolean => {
		error = verify(getValue());
		if (!error) {
			return true
		}

		input.animate([], {duration: 400})
		return false
	}

	const setError = (_error: Error): void => {
		error = _error
	}

	const getValue = (): string => {
		return value
	}

	const setValue = (_value: string): void => {
		value = _value
	}

	const focus = (): void => {
		input.focus();
	}
</script>

<div>
	{#if error}
		<div class="error">{error}</div>
	{/if}
	<input
		bind:this={input}
		bind:value={value}
		class="red-input"
		{maxlength}
		on:input={async (e) => {
			if (!e.target) {
				error = new Error("no target")
			}
			const { value } = e.target as HTMLInputElement;
			error = verify(value);
		}}
		{placeholder}
	>
</div>