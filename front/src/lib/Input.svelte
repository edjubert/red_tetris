<script lang="ts">
	export let verify, placeholder, maxlength;

	let input: HTMLInputElement;
	let error: Error | undefined;
	let value = '';

	export const ok = (): boolean => {
		const { valid, err } = verify(getValue());
		if (valid) {
			error = undefined;
			return true;
		}

		if (!valid) {
			error = err;
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

	const onInput = async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (!e.target) {
			error = new Error('no target');
		}
		const { value: eValue } = e.target as HTMLInputElement;
		const { valid, err } = verify(eValue);
		if (!valid) {
			error = err;
		}
		value = eValue;
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
		on:input={onInput}
		{placeholder}
	/>
</div>
