<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { EntryProperties } from '$lib/server/neo4j';
	import { clickOutside } from '$lib/actions';
	import type { ActionData, PageData } from './$types';
	import { PUBLIC_RATE_LIMIT, PUBLIC_S3_BUCKET } from '$env/static/public';
	import { YOUTUBE_EMBEDDABLE, shuffleTuple } from '$lib/utils';
	import { PUBLIC_S3_ENDPOINT } from '$env/static/public';
	import NewVote from '$lib/components/NewVote.svelte';

	export let data: PageData;
	export let form: ActionData;

	let flagDialog: HTMLDialogElement;
	let flagEntry: EntryProperties | null = null;

	$: entries = shuffleTuple(data.entries) as [EntryProperties, EntryProperties];
</script>

<article>
	{#if data.userNotFound}
		<div class="layout-prose">
			<h2>Invalid token</h2>
			<p>You can use the link you received by email to vote</p>
		</div>
	{:else if form?.id === 'FLAG' && form?.flagSuccess}
		<div class="layout-prose">
			<p class="text-success">Entry flagged. Thank you</p>

			<NewVote {page} />
		</div>
	{:else if form?.id === 'VOTE' && form?.voteFail}
		<div class="layout-prose">
			<p class="text-error">Something went wrong.</p>

			<NewVote {page} />
		</div>
	{:else if form?.id === 'VOTE' && form?.voteSuccess}
		<div class="layout-prose">
			<p class="text-success">Thank you !</p>

			<NewVote {page} />
		</div>
	{:else if data.stopVote}
		<div class="layout-prose">
			<p class="text-success">Thank you for participating!</p>

			<NewVote {page} displayCategories="others-only" />
		</div>
	{:else}
		<form
			method="post"
			action="?/vote"
			use:enhance={() => {
				const buttons = document.querySelectorAll('button');
				buttons.forEach((b) => b.setAttribute('disabled', 'on'));
				return async ({ result }) => {
					// Do not force a page update here to prevent assigning a new pair in case the user doesn't want to keep voting.
					await applyAction(result);
					buttons.forEach((b) => b.removeAttribute('disabled'));
				};
			}}
		>
			<div class="grid w-full justify-items-center gap-20 px-16 lg:grid-cols-[47%_47%]">
				{#each entries as entry, i}
					<div>
						<h3 class="capitalize">{entry.title}</h3>
						{#if YOUTUBE_EMBEDDABLE.test(entry.link)}
							{@const youtubeLink = entry.link.match(YOUTUBE_EMBEDDABLE)?.[1]}
							<iframe
								class="mx-auto max-w-full rounded-lg"
								width="560"
								height="315"
								src={`https://www.youtube.com/embed/${youtubeLink}`}
								title="YouTube video player"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
							/>
						{:else}
							<a href={entry.link} target="_blank">
								<img
									class="mx-auto my-0 max-w-full rounded-lg"
									src={`https://${PUBLIC_S3_BUCKET}.${PUBLIC_S3_ENDPOINT.replace('https://', '')}/${
										entry.thumbnail
									}`}
									alt="thumbnail"
									width="560"
									height="315"
								/>
							</a>
						{/if}
						<p>{entry.description}</p>
						<p>Link: <a href={entry.link} target="_blank">{entry.link}</a></p>
						<input type="hidden" name="entry-{i}" value={entry.number} />
						<label for="feedback-{i}" class="label">Your feedback for this entry:</label>
						<textarea
							id="feedback-{i}"
							name="feedback-{i}"
							class="textarea-bordered textarea w-full text-base"
							placeholder={`(Motivation, Explanation, Originality, Length, Overall)`}
							maxlength="2000"
							rows="8"
						/>

						<button
							type="button"
							class="btn-error btn-outline btn-xs btn"
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
				<div class="form-control max-w-md">
					<span class="mb-2 block">Which entry is the better one?</span>
					{#each entries as entry, i}
						<label for="choice-{i}" class="label cursor-pointer justify-start gap-2">
							<input
								id="choice-{i}"
								class="radio"
								type="radio"
								name="choice"
								value={entry.number}
								required
							/>
							<span class="label-text"> {entry.title} </span>
						</label>
					{/each}
				</div>
				<p>
					<button type="submit" class="btn-primary btn-md btn">Vote for this entry</button>
				</p>
				{#if form?.id === 'VOTE' && form.rateLimitError}
					<p class="text-error">
						Please wait at least {PUBLIC_RATE_LIMIT} minutes between votes.
					</p>
				{/if}
			</section>
		</form>

		<section class="layout-prose">
			<h3>Guidelines</h3>
			<p>
				Choose your preferred entry between the following two. It is ultimately up to you how you
				make this decision, but you might consider the following principles:
			</p>
			<ul>
				<li>
					<b>Motivation</b>: is the notion well motivated?
				</li>
				<li>
					<b>Explanation</b>: is the explanation clear?
				</li>
				<li>
					<b>Originality</b>: does the entry bring a new way to approach a notion or else a personal
					touch etc.?
				</li>
				<li>
					<b>Length</b>: is the time to read/watch appropriate for the underlying concept?
				</li>
			</ul>
			<p>
				Please feedback to each creator. Remember to be as constructive as possible in your
				comments.
			</p>
			<p>
				If an entry is inappropriate or does not follow the <a href="/#rules">rules</a> you can flag
				it and we will review it manually.
			</p>
		</section>
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
			return async ({ result }) => {
				// Do not force a page update here to prevent assigning a new pair in case the user doesn't want to keep voting.
				await applyAction(result);
				buttons.forEach((b) => b.removeAttribute('disabled'));
				flagDialog.close();
			};
		}}
	>
		<h2 class="mt-0">You're about to flag an entry</h2>
		<p class="text-gray-700">
			Please provide a reason why this entry is inappropriate and should be flagged. This will be
			reviewed by admins.
		</p>
		<span class="capitalize">{flagEntry?.title}</span>
		<label for="reason" class="label">Reason</label>
		<input
			id="reason"
			type="text"
			name="reason"
			maxlength="100"
			class="input-bordered input w-full"
			required
		/>
		<input type="hidden" name="link" value={flagEntry?.link} />
		<p class="mb-0 flex items-center gap-2">
			<button type="button" class="btn-outline btn" on:click={() => flagDialog.close()}
				>Cancel</button
			>
			<button type="submit" class="btn-error btn-outline btn">Flag </button>
			{#if form?.id === 'FLAG' && form?.flagFail}
				<p class="text-error">Something went wrong.</p>
			{/if}
		</p>
	</form>
</dialog>
