<script lang="ts">
	import { registrationOpen, resultsAvailable, competitionStarted, voteOpen } from '$lib/utils';
	import Time from '$lib/components/Time.svelte';
	import type { ActionData, PageData } from './$types';
	import { clickOutside } from '$lib/actions';
	import { enhance } from '$app/forms';
	import {
		COMPETITION_FULL_NAME,
		COMPETITION_SHORT_NAME,
		categories,
		listFormatter
	} from '$lib/config';
	import {
		PUBLIC_REGISTRATION_END,
		PUBLIC_REGISTRATION_START,
		PUBLIC_RESULTS_AVAILABLE,
		PUBLIC_VOTE_END,
		PUBLIC_VOTE_START
	} from '$env/static/public';

	const phases = [
		{
			title: 'Register as a creator or judge',
			description:
				'Participants all work on their projects. Most of the activity during this phase happens on Discord, where many people share partial progress, find collaborators, and ask questions.',
			isOpen: registrationOpen(),
			dates: [PUBLIC_REGISTRATION_START, PUBLIC_REGISTRATION_END]
		},
		{
			title: 'Vote for the best contributions',
			description:
				"Peer review! Everyone, whether or not they've submitted an entry, can participate. You'll be successively shown two entries and asked to vote on which is best and to optionally provide feedback (it's actually a ton of fun). In many ways, this is the heart of the event, and in past years this phase has been what jump-started meaningful exposure for many entries.",
			isOpen: voteOpen(),
			dates: [PUBLIC_VOTE_START, PUBLIC_VOTE_END]
		},
		{
			title: 'Results and feedback',
			description:
				'A selection of judges drawn from the math communication community will select winners and honorable mentions from among other top 100 surfaced in the peer review. Winners will be featured in a 3blue1brown video, and awarded $1,000 each, along with the coveted golden pi creature.',
			isOpen: resultsAvailable(),
			dates: [PUBLIC_RESULTS_AVAILABLE]
		}
	];

	const dateFormat = {
		month: 'short',
		day: '2-digit',
		hour: 'numeric',
		minute: 'numeric'
	} as const;

	export let data: PageData;
	export let form: ActionData;

	let personalLinkDialog: HTMLDialogElement;
	let email: string;

	function closeDialog() {
		personalLinkDialog.close();
		if (form) {
			form.emailInvalid = undefined;
			form.error = undefined;
			form.success = undefined;
		}
	}
</script>

<svelte:head>
	<title>{COMPETITION_SHORT_NAME}</title>
</svelte:head>

<article class="layout-prose">
	<p>
		The <a href="https://www.3blue1brown.com/blog/some1" target="_blank">{COMPETITION_FULL_NAME}</a>
		(SoME) is an annual competition to foster the creation of excellent math content online. On this
		page, you can sign up as either a creator or judge for the {listFormatter.format(categories)} categories.
	</p>
	<h2>Timeline</h2>
	<p>The competition has three phases:</p>
	<ul>
		{#each phases as phase, i}
			<li class="{phase.isOpen ? 'marker:text-green-500' : ''} space-y-0">
				<p>
					<span class="flex items-center gap-2 font-semibold">
						Phase {i + 1}:
						{phase.title}
						{#if phase.isOpen}
							<span class="badge badge-success">current</span>
						{/if}
					</span>
					<span class="text-sm text-gray-500"
						>{#if phase.dates.length > 1}
							From <Time datetime={phase.dates[0]} options={dateFormat} /> to
							<Time datetime={phase.dates[1]} options={dateFormat} />
						{:else}
							From <Time datetime={phase.dates[0]} options={dateFormat} />
						{/if}</span
					>
				</p>
				<p class="text-sm">{phase.description}</p>
			</li>
		{/each}
	</ul>

	{#if !competitionStarted()}
		{#if !PUBLIC_REGISTRATION_START}
			<p>The competition has not started yet.</p>
			<p>Stay tuned for the announcement of phase 1!</p>
		{:else}
			<p>
				The competition will start <Time datetime={PUBLIC_REGISTRATION_START} />
			</p>
		{/if}
	{/if}

	{#if registrationOpen()}
		<h2>Register</h2>
		<b>Phase 1 is open</b>
		<p>
			You can register until
			<Time datetime={PUBLIC_REGISTRATION_END} />
		</p>
		<p><a class="btn" href="/register">Go to registration page</a></p>
	{/if}

	{#if voteOpen()}
		<h2>Vote</h2>
		<b>Phase 2 is open</b>
		<p>
			You can vote until
			<Time datetime={PUBLIC_VOTE_END} />
		</p>
		{#if data.token}
			<p><a class="btn" href="/vote/{data.token}">Vote</a></p>
		{:else}
			<p>
				If you are registered as either an entrant or a judge, you can vote with your personal link
				you received by email or have bookmarked after the registration.
			</p>
			<p>In case you can't find your personal link we can resend it to you.</p>
			<p>
				<button
					type="button"
					class="btn-outline btn"
					on:click={() => {
						personalLinkDialog.showModal();
					}}
					>Resend me my personal link
				</button>
			</p>
		{/if}
	{/if}

	{#if resultsAvailable()}
		<h2>Get your feedback</h2>
		<p>Other people have reviewed your entry and left messages to help you improve.</p>
		<p><a class="btn" href="/feedback/{data.token}">See feedbacks</a></p>
	{/if}
</article>

<dialog class="mb-auto" bind:this={personalLinkDialog}>
	<form
		class=""
		method="post"
		action="?/resend_link"
		use:clickOutside={closeDialog}
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'on');
			return async ({ update }) => {
				await update();
				submitter?.removeAttribute('disabled');
			};
		}}
	>
		<h2 class="mt-0">Personal link</h2>
		<p>You will receive an email with your personal link.</p>
		<label for="email" class="label inline-flex gap-4"
			>Email <small class="font-light text-gray-700">(the one you registered with)</small></label
		>
		<input
			id="email"
			type="email"
			name="email"
			placeholder="john@gmail.com"
			class="input-bordered input w-full max-w-xs"
			bind:value={email}
			required
		/>

		<p class="flex gap-4">
			<button type="button" class="btn-outline btn" on:click={closeDialog}>Close</button>
			<button type="submit" class="btn">Send email</button>
		</p>
		{#if form?.error || form?.emailInvalid}
			<span class="text-error">Something went wrong.</span>
		{:else if form?.success}
			<span class="text-success">Email sent!</span>
		{/if}
	</form>
</dialog>
