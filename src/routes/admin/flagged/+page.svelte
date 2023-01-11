<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EntryProperties } from '$lib/server/neo4j';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	$: flagged = data.flagged as EntryProperties[];

	export let form: ActionData;
	$: unflag = form?.unflag;
	$: unflagError = form?.unflagError;
</script>

<article class="overflow-x-auto max-w-xl">
	<h2>Flagged entries</h2>

	<table class="table table-zebra w-full">
		<thead>
			<tr>
				<th />
				<th>Title</th>
				<th>Flagged by</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each flagged as entry, i}
				<tr>
					<th>{i + 1}</th>
					<td><a class="capitalize" href={entry.link}>{entry.title}</a></td>
					<td><span class="capitalize">{entry.flaggedBy}</span></td>
					<td>
						<form
							method="post"
							use:enhance={() => {
								const buttons = document.querySelectorAll('button');
								buttons.forEach((b) => b.setAttribute('disabled', 'on'));
								return async ({ update }) => {
									buttons.forEach((b) => b.removeAttribute('disabled'));
									await update();
									setTimeout(() => {
										unflag = false;
										unflagError = false;
									}, 3000);
								};
							}}
						>
							<input type="hidden" value={entry.link} name="link" />
							<button type="submit" class="btn btn-sm">Unflag</button>
						</form>
					</td>
				</tr>
			{:else}
				<p>No entries flagged</p>
			{/each}
		</tbody>
	</table>
</article>

{#if unflag}
	<div transition:fade class="toast toast-bottom toast-center">
		<span class="alert alert-success whitespace-nowrap"> Entry unflagged successfully. </span>
	</div>
{/if}
{#if unflagError}
	<div transition:fade class="toast toast-bottom toast-center">
		<span class="alert alert-error whitespace-nowrap"> Couldn't unflag entry. </span>
	</div>
{/if}
