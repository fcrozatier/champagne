<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EntryProperties } from '$lib/server/neo4j';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	$: flagged = data.flagged as EntryProperties[];

	export let form: ActionData;
	$: flag = form?.flag;
	$: flagError = form?.flagError;
	$: unflag = form?.unflag;
	$: unflagError = form?.unflagError;
</script>

<article class="mx-auto w-4/5 max-w-5xl overflow-x-auto">
	<h2>Reported entries to review</h2>

	<table class="table-zebra table w-full">
		<thead>
			<tr>
				<th />
				<th>Title</th>
				<th>Reported by</th>
				<th>Reason</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each flagged as entry, i}
				<tr>
					<th>{i + 1}</th>
					<td><a class="capitalize" href={entry.link}>{entry.title}</a></td>
					<td><span class="capitalize">{entry.flaggedBy}</span></td>
					<td><span class="capitalize">{entry.flagReason}</span></td>
					<td>
						<form
							class="flex gap-2"
							method="post"
							use:enhance={({ action }) => {
								const buttons = document.querySelectorAll('button');
								buttons.forEach((b) => b.setAttribute('disabled', 'on'));
								return async ({ update }) => {
									buttons.forEach((b) => b.removeAttribute('disabled'));
									await update();
									setTimeout(() => {
										if (action.pathname.includes('unflag')) {
											unflag = false;
											unflagError = false;
										} else {
											flag = false;
											flagError = false;
										}
									}, 3000);
								};
							}}
						>
							<input type="hidden" value={entry.link} name="link" />
							<button type="submit" formaction="?/unflag" class="btn-sm btn">Unflag</button>
							<button type="submit" formaction="?/flag" class="btn-error btn-sm btn">Flag</button>
						</form>
					</td>
				</tr>
			{:else}
				<p>No entries to review</p>
			{/each}
		</tbody>
	</table>
</article>

{#if flag || unflag}
	<div transition:fade class="toast-center toast-bottom toast">
		<span class="alert alert-success whitespace-nowrap">
			Entry {form?.unflag ? 'un' : ''}flagged successfully.
		</span>
	</div>
{/if}
{#if unflagError || flagError}
	<div transition:fade class="toast-center toast-bottom toast">
		<span class="alert alert-error whitespace-nowrap">
			Couldn't {form?.unflag ? 'un' : ''}flag entry.
		</span>
	</div>
{/if}
