<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FeedbackProperties } from '$lib/server/neo4j';
	import type { PageData } from './$types';

	export let data: PageData;
	$: feedbacks = data.feedbacks as FeedbackProperties[];
</script>

<article class="mx-auto w-4/5 max-w-5xl">
	<h2>Feedbacks to review</h2>

	<table class="w-full ">
		<thead>
			<tr class="px-6">
				<th>Feedback</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each feedbacks as feedback, i}
				<tr>
					<td class="pl-8 capitalize"><p>{feedback.value}</p></td>
					<td class="pr-4">
						<form
							class="grid items-center gap-2 py-2"
							method="post"
							use:enhance={({ form }) => {
								const buttons = form.querySelectorAll('button');
								buttons.forEach((b) => b.setAttribute('disabled', 'on'));
								return async ({ update }) => {
									buttons.forEach((b) => b.removeAttribute('disabled'));
									await update();
								};
							}}
						>
							<input type="hidden" value={feedback.token} name="token" />
							<button type="submit" formaction="?/validate" class="btn-sm btn">Validate</button>
							<button type="submit" formaction="?/delete" class="btn-error btn-sm btn"
								>Delete</button
							>
						</form>
					</td>
				</tr>
			{:else}
				<p class="px-6">No feedback to review</p>
			{/each}
		</tbody>
	</table>
</article>

<style>
	tr {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
	}
	tr:nth-child(even) {
		background-color: rgb(242, 242, 242);
	}
</style>
