<script lang="ts">
	import { registrationOpen, resultsAvailable, competitionStarted, voteOpen } from '$lib/utils';
	import Time from '$lib/components/Time.svelte';
	import type { ActionData, PageData } from './$types';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { enhance } from '$app/forms';
	import { COMPETITION, categories, listFormatter } from '$lib/config';
	import {
		PUBLIC_REGISTRATION_END,
		PUBLIC_REGISTRATION_START,
		PUBLIC_VOTE_END
	} from '$env/static/public';

	const phases = [registrationOpen(), voteOpen(), resultsAvailable()];

	const descriptions = [
		'Phase 1: Register as a creator or judge',
		'Phase 2: Vote for the best contributions',
		'Phase 3: Results and feedback'
	];

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
	<title>{COMPETITION}</title>
</svelte:head>

<article class="layout-prose">
	<p>
		The <a href="https://www.3blue1brown.com/blog/some1">Summer of Math Exposition</a> (SoME) is an
		annual competition to foster the creation of excellent math content online. On this page, you
		can sign up as either a creator or judge for the {listFormatter.format(categories)} categories.
	</p>
	<h2>Organization</h2>
	<p>The competition has three phases:</p>
	<ul>
		{#each descriptions as description, i}
			<li class={phases[i] ? 'marker:text-green-500' : ''}>
				<p class="flex items-center gap-2">
					{description}
					{#if phases[i]}
						<span class="badge badge-success">current</span>
					{/if}
				</p>
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
					>Email me my personal link
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
			return ({ update }) => {
				update().then(() => submitter?.removeAttribute('disabled'));
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
