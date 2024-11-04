<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Hello {data.player}</h1>

<form method="POST" action="?/start">
	<button>Start</button>
</form>