<script lang="ts">
	import type { EntryProperties } from '$lib/server/neo4j';
	import type { PageData } from './$types';

	export let data: PageData;

	$: entries = data.entries as EntryProperties[];
</script>

<article>
	{#if data.userNotFound}
		<div class="max-w-prose">
			<h2>Invalid token</h2>
			<p>You can use the link you received by email to vote</p>
		</div>
	{:else}
		<h2>Vote</h2>
		<div class="grid grid-cols-2 gap-40 max-w-full">
			{#each entries as entry}
				<div>
					<h3>{entry.title}</h3>
					<p>{entry.description}</p>
					<p>Link: <a href={entry.link}>{entry.link}</a></p>
				</div>
			{/each}
		</div>
	{/if}
</article>
