<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EntryProperties } from '$lib/server/neo4j';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

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
		<h3>Guidelines</h3>
		<section class="max-w-prose">
			<p>
				Choose the best entry between the following two. Here are some principles to help you
				evaluate entries:
			</p>
			<ul>
				<li>
					<strong>Motivation</strong>: is the notion well motivated?
				</li>
				<li>
					<strong>Explanation</strong>: is the explanation clear?
				</li>
				<li>
					<strong>Originality</strong>: does the entry bring a new way to approach a notion or a
					personal touch etc.?
				</li>
				<li>
					<strong>Length</strong>: is the time to read/watch appropriate for the underlying concept?
				</li>
			</ul>
			<p>
				You can give a feedback to each creator. Please be considerate to the time taken by the
				creator to make his entry, by being as constructive as possible in your comments.
			</p>
			<p>
				If an entry is inappropriate or does not follow the <a href="/rules">rules</a> you can flag it
			</p>
		</section>
		<div class="grid grid-cols-2 gap-40 max-w-full">
			{#if form?.flagSuccess}
				<p class="text-success">Entry flagged. Thank you</p>
				<!-- TODO BLOCK Assignment /click next/call invalidate all  -->
			{:else if form?.flagFail}
				<p class="text-error">Something went wrong.</p>
			{:else}
				{#each entries as entry}
					<div>
						<h3 class="capitalize">{entry.title}</h3>
						<p class="capitalize">{entry.description}</p>
						<p>Link: <a href={entry.link}>{entry.link}</a></p>
						<form method="post" action="?/flag" use:enhance>
							<input type="hidden" name="flagged" value={entry.link} />
							<button type="submit" class="btn btn-sm btn-outline btn-error"
								>Flag this entry
							</button>
						</form>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</article>
