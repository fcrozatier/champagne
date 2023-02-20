<script lang="ts">
	import { categories } from '$lib/categories';
	import { page } from '$app/stores';
</script>

<article class="layout-prose">
	<h2>Vote</h2>
	<p>Choose a category:</p>
	<p class="flex gap-4">
		{#each categories as category}
			<a class="btn" href={`/vote/${$page.params.token}/${category}`}>{category} entries</a>
		{/each}
	</p>
</article>
