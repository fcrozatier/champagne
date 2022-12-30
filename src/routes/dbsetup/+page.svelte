<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2>Database setup</h2>
{#if data.success}
	<p>Database contraints added successfully</p>
{:else}
	<p>Something went wrong went creating db contraints</p>
{/if}
