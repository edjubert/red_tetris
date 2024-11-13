<script>
	import { socket } from '$lib/user';
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
