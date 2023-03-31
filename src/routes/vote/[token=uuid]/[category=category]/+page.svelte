<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { PUBLIC_RATE_LIMIT } from '$env/static/public';
	import type { EntryProperties } from '$lib/server/neo4j';
	import { clickOutside } from '$lib/actions/clickOutside';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let flagDialog: HTMLDialogElement;
	let flagEntry: EntryProperties | null = null;

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
				<p>
					<a
						class="btn"
						href={`/vote/${$page.params.token}/${$page.params.category}`}
						data-sveltekit-reload>New vote</a
					>
				</p>
			</div>
		{:else if form?.id === 'VOTE' && form?.voteFail}
			<div class="layout-prose">
				<p class="text-error">Something went wrong.</p>
				<!-- Force reload to grab a new pair of entries -->
				<p>
					<a
						class="btn"
						href={`/vote/${$page.params.token}/${$page.params.category}`}
						data-sveltekit-reload>New vote</a
					>
				</p>
			</div>
		{:else if form?.id === 'VOTE' && form?.voteSuccess}
			<div class="layout-prose">
				<p class="text-success">Thank you !</p>
				<!-- Force reload to grab a new pair of entries -->
				<p>
					<a
						class="btn"
						href={`/vote/${$page.params.token}/${$page.params.category}`}
						data-sveltekit-reload>New vote</a
					>
				</p>
			</div>
		{:else if data.stopVote}
			<div class="layout-prose">
				<p class="text-success">Thank you for participating!</p>
			</div>
		{:else}
			<form
				method="post"
				action="?/vote"
				use:enhance={() => {
					const buttons = document.querySelectorAll('button');
					buttons.forEach((b) => b.setAttribute('disabled', 'on'));
					return ({ result }) => {
						// Do not force a page update here to prevent assigning a new pair in case the user doesn't want to keep voting.
						applyAction(result);
						buttons.forEach((b) => b.removeAttribute('disabled'));
					};
				}}
			>
				<div class="grid w-full justify-items-center gap-10 sm:grid-cols-2">
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
								class="textarea-bordered textarea w-full max-w-md text-base"
								placeholder={`(Motivation, Explanation, Originality, Length, Overall)`}
								maxlength="500"
								rows="10"
								required
							/>

							<button
								type="button"
								class="btn-outline btn-error btn-xs btn"
								on:click={() => {
									flagEntry = entry;
									flagDialog.showModal();
								}}
								>Flag this entry
							</button>
						</div>
					{/each}
				</div>
				<section class="layout-prose mt-8 w-full space-y-4">
					<label for="choice" class="label">Which entry is the best one?</label>
					<select
						id="choice"
						name="choice"
						class="select-bordered select w-full max-w-full capitalize"
						required
					>
						<option disabled selected />
						{#each entries as entry}
							<option value={entry.number}>{entry.title}</option>
						{/each}
					</select>
					{#if form?.id === 'VOTE' && form.rateLimitError}
						<p class="text-error">
							Please wait at least {PUBLIC_RATE_LIMIT} minutes between votes.
						</p>
					{/if}
					<button type="submit" class="btn-md btn">Vote for this entry</button>
				</section>
			</form>
		{/if}
	{/if}
</article>

<dialog class="mb-auto" bind:this={flagDialog}>
	<form
		method="post"
		action="?/flag"
		use:clickOutside={() => flagDialog.close()}
		use:enhance={() => {
			const buttons = document.querySelectorAll('button');
			buttons.forEach((b) => b.setAttribute('disabled', 'on'));
			return ({ result }) => {
				// Do not force a page update here to prevent assigning a new pair in case the user doesn't want to keep voting.
				applyAction(result);
				buttons.forEach((b) => b.removeAttribute('disabled'));
				flagDialog.close();
			};
		}}
	>
		<h2 class="mt-0">You're about to flag an entry</h2>
		<p class="text-gray-700">
			Please provide a short reason why this entry is inappropriate and should be flagged. This will
			be reviewed by admins.
		</p>
		<span class="capitalize">{flagEntry?.title}</span>
		<label for="reason" class="label">Reason</label>
		<input
			id="reason"
			type="text"
			name="reason"
			maxlength="140"
			class="input-bordered input w-full"
			required
		/>
		<input type="hidden" name="link" value={flagEntry?.link} />
		<p class="mb-0 flex items-center gap-2">
			<button type="button" class="btn-outline btn" on:click={() => flagDialog.close()}
				>Cancel</button
			>
			<button type="submit" class="btn-outline btn-error btn">Flag this entry </button>
			{#if form?.id === 'FLAG' && form?.flagFail}
				<p class="text-error">Something went wrong.</p>
			{/if}
		</p>
	</form>
</dialog>
