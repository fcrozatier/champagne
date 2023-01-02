<script lang="ts">
	import type { EntryProperties } from '$lib/server/neo4j';
	import type { PageData } from './$types';

	export let data: PageData;

	$: entries = data.entries as EntryProperties[];
</script>

{#if data.userNotFound}
	<h2>Invalid token</h2>
	<p>Use your link to vote</p>
{:else}
	<h2>Vote</h2>

	{#each entries as entry}
		<h3>entry</h3>
		<p>Link: <a href={entry.link}>{entry.link}</a></p>
	{/each}
{/if}
