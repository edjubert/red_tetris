<script lang="ts">
	export let verify, placeholder, maxlength;

	let input: HTMLInputElement;
	let error: Error;
	let value = '';

	export const ok = (): boolean => {
		const { valid, err } = verify(getValue());
		if (!valid) {
			error = err;
		}
		if (!error) {
			return true;
		}

		input.animate([], { duration: 400 });
		return false;
	};

	export const setError = (_error: Error): void => {
		error = _error;
	};

	export const getValue = (): string => {
		return value;
	};

	export const setValue = (_value: string): void => {
		value = _value;
	};

	export const focus = (): void => {
		input.focus();
	};
</script>

<div>
	{#if error}
		<div class="error">{error}</div>
	{/if}
	<input
		bind:this={input}
		bind:value
		class="red-input"
		{maxlength}
		on:input={async (e) => {
			if (!e.target) {
				error = new Error('no target');
			}
			const { value } = e.target as HTMLInputElement;
			const { valid, err } = verify(value);
			if (!valid) {
				error = err;
			}
		}}
		{placeholder}
	/>
</div>

<style lang="css">
</style>
