<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FeedbackProperties } from '$lib/server/neo4j';
	import type { PageData } from './$types';

	export let data: PageData;
	$: feedbacks = data.feedbacks as FeedbackProperties[];
</script>

<article class="mx-auto w-4/5 max-w-5xl">
	<h2>Feedbacks to review</h2>

	<table class="table-zebra table w-full">
		<thead>
			<tr class="flex">
				<th />
				<th class="flex-1">Feedback</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each feedbacks as feedback, i}
				<tr class="flex">
					<th>{i + 1}</th>
					<td class="flex flex-1 capitalize"
						><textarea class="flex-1 overflow-auto" rows="5" readonly>{feedback.value}</textarea
						></td
					>
					<td>
						<form
							class="flex items-center gap-2"
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
				<p>No feedback to review</p>
			{/each}
		</tbody>
	</table>
</article>
