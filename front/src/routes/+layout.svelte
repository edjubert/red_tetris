<script>
	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/room">Game</a>
</nav>

{@render children()}
