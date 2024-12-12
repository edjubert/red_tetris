<script>
	import { socket } from '$lib/user_browser';
	import { _ } from '../services/i18n';
	import { goto } from '$app/navigation';
</script>

<button
	class="red-button"
	on:click={() => {
		socket.emit('leaveRoom');
		goto(`/`);
	}}
>
	{$_('game.leave')}
</button>

<style>
	.red-button:hover {
		border-color: var(--theme-red);
		background-color: var(--theme-red);
		color: var(--theme-mantle);
	}
</style>
