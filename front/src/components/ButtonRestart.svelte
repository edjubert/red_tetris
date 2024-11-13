<script>
	import { socket } from '$lib/user';
	import { _ } from '../services/i18n';

	let roomname = $props();
</script>

<button
	class="red-button"
	onclick={() => {
		socket.emit(`restart:${roomname}`);
	}}
>
	{$_('game.restart')}
</button>
