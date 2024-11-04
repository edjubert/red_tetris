<script lang="ts">
	let playerName = $state();
</script>

<input bind:value={playerName}>
<a href="/room/{playerName}">Begin</a>