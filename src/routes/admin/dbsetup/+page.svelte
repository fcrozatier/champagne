<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<article class="max-w-prose">
	<h2>Database setup</h2>
	{#if data.success}
		<p>Database contraints added successfully</p>
	{:else}
		<p>Something went wrong when creating db contraints</p>
	{/if}
</article>
