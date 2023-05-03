<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
	$: flagged = data.flagged as {
		link: string;
		title: string;
		reason: string;
		email: string;
	}[];
</script>

<article class="mx-auto w-4/5 max-w-5xl overflow-x-auto">
	<h2>Reported entries to review</h2>

	<table class="table-zebra table w-full">
		<thead>
			<tr>
				<th />
				<th>Entry</th>
				<th>Reason</th>
				<th>Reported by</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each flagged as entry, i}
				<tr>
					<th>{i + 1}</th>
					<td><a class="capitalize" href={entry.link} target="_blank">{entry.title}</a></td>
					<td><span class="">{entry.reason}</span></td>
					<td><span class="">{entry.email}</span></td>
					<td>
						<form
							class="flex gap-2"
							method="post"
							use:enhance={() => {
								const buttons = document.querySelectorAll('button');
								buttons.forEach((b) => b.setAttribute('disabled', 'on'));
								return async ({ update }) => {
									buttons.forEach((b) => b.removeAttribute('disabled'));
									await update();
								};
							}}
						>
							<input type="hidden" value={entry.link} name="link" />
							<input type="hidden" value={entry.email} name="email" />
							<button type="submit" formaction="?/ignore" class="btn-sm btn">Ignore</button>
							<button type="submit" formaction="?/remove" class="btn-error btn-sm btn"
								>Remove</button
							>
						</form>
					</td>
				</tr>
			{:else}
				<p>No entries to review</p>
			{/each}
		</tbody>
	</table>
</article>
