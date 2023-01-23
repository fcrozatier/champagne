<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { PUBLIC_VOTES_DELTA } from '$env/static/public';
	import type { EntryProperties } from '$lib/server/neo4j';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: entries = data.entries as EntryProperties[];
</script>

<article>
	{#if data.userNotFound}
		<div class="layout-prose">
			<h2>Invalid token</h2>
			<p>You can use the link you received by email to vote</p>
		</div>
	{:else}
		<section class="layout-prose">
			<h2>Vote</h2>
			<h3>Guidelines</h3>
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

		{#if form?.id === 'FLAG' && form?.flagSuccess}
			<div class="layout-prose">
				<p class="text-success">Entry flagged. Thank you</p>
				<!-- Force reload to grab a new pair of entries -->
				<p><a class="btn" href="/vote" data-sveltekit-reload>New vote</a></p>
			</div>
		{:else if (form?.id === 'FLAG' && form?.flagFail) || (form?.id === 'VOTE' && form?.voteFail)}
			<div class="layout-prose">
				<p class="text-error">Something went wrong.</p>
				<p><a class="btn" href="/vote" data-sveltekit-reload>New vote</a></p>
			</div>
		{:else if form?.id === 'VOTE' && form?.voteSuccess}
			<div class="layout-prose">
				<p class="text-success">Thank you !</p>
				<!-- Force reload to grab a new pair of entries -->
				<p><a class="btn" href="/vote" data-sveltekit-reload>New vote</a></p>
			</div>
		{:else if data.stopVote}
			<div class="layout-prose">
				<p class="text-success">The vote is now closed. Thank you for participating!</p>
			</div>
		{:else}
			<form
				method="post"
				action="?/vote"
				use:enhance={() => {
					const buttons = document.querySelectorAll('button');
					buttons.forEach((b) => b.setAttribute('disabled', 'on'));
					return ({ result }) => {
						applyAction(result);
						buttons.forEach((b) => b.removeAttribute('disabled'));
					};
				}}
			>
				<div class="grid sm:grid-cols-2 justify-items-center gap-10 w-full">
					{#each entries as entry, i}
						<div class="w-3/4">
							<h3 class="capitalize">{entry.title}</h3>
							<p class="capitalize">{entry.description}</p>
							<p>Link: <a href={entry.link}>{entry.link}</a></p>
							<input type="hidden" name="entry-{i}" value={entry.number} />
							<label for="feedback-{i}" class="label">Your feedback for this entry:</label>
							<textarea
								id="feedback-{i}"
								name="feedback-{i}"
								class="textarea textarea-bordered text-base w-full max-w-md"
								placeholder={`(Motivation, Explanation, Originality, Length, Overall)`}
								maxlength="500"
								rows="10"
								required
							/>
							<form
								method="post"
								action="?/flag"
								use:enhance={() => {
									const buttons = document.querySelectorAll('button');
									buttons.forEach((b) => b.setAttribute('disabled', 'on'));
									return ({ result }) => {
										applyAction(result);
										buttons.forEach((b) => b.removeAttribute('disabled'));
									};
								}}
							>
								<input type="hidden" name="flagged" value={entry.link} />
								<button type="submit" class="btn btn-xs btn-outline btn-error"
									>Flag this entry
								</button>
							</form>
						</div>
					{/each}
				</div>
				<section class="layout-prose mt-8 space-y-4 w-full">
					<label for="choice" class="label">Which entry is the best one?</label>
					<select
						id="choice"
						name="choice"
						class="select select-bordered w-full max-w-full capitalize"
						required
					>
						<option disabled selected />
						{#each entries as entry}
							<option value={entry.number}>{entry.title}</option>
						{/each}
					</select>
					{#if form?.id === 'VOTE' && form.rateLimitError}
						<p class="text-error">
							Please wait at least {PUBLIC_VOTES_DELTA} minutes between votes.
						</p>
					{/if}
					<button type="submit" class="btn btn-md">Vote for this entry</button>
				</section>
			</form>
		{/if}
	{/if}
</article>
