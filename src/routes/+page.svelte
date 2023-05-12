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
		The <a href=https://www.3blue1brown.com/blog/some1> {COMPETITION_FULL_NAME} </a>
		(SoME) is an annual competition to foster the creation of excellent math content online. 
		If you would like to register for this competition as either an entrant or a judge, please use the registration button below and fill out the appropriate form.
		Note that you may only register as an entrant during the official registration phase, but you can register at a judge during the voting phase as well.
		If the registration phase has passed, please follow the instructions on this page for either voting or receiving feedback.
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

<article id="rules" class="layout-prose">
	<h2>Rules</h2>

	<ol>
		<li>It has to be something new you make this summer</li>
		<p>
			The spirit of this is to encourage people who've never put stuff online before. If you want to
			work on something you sort of started once before, that's probably fine, but it can't be
			something you already published before this contest. Optimally, you'd use this as a chance to
			try something new you otherwise might not have.
		</p>

		<li>It has to be about math.</li>
		<p>
			Here we mean &laquo; math &raquo; very broadly, and more applied topics like physics or
			computer science are abundantly welcome. It just has to be the case that a viewer/reader might
			come away knowing something mathematical they didn't before.
		</p>
		<p>
			The topic could be at any level, whether that's basic math for young children or higher-level
			math. If you're assuming a certain background level for the target audience, kindly mention it
			below. It's hard because we don't want to discourage topics with a very niche target audience,
			as those lessons can sometimes be the most valuable. However, if your lesson assumes
			particular expertise, e.g. a comfort with algebraic geometry, keep in mind that our judges may
			not fit into this category. So to actually win the contest, it's helpful if the topic is
			accessible to someone with, say, a background in standard undergrad math topics.
		</p>

		<li>One entry per person/group</li>
		<p>
			We hope you make more, but we only have the capacity to judge participants based on a single
			entry.
		</p>
		<li>It has to be available in English: subtitles or translation are needed</li>
		<p>
			If you want to put out an explainer in another language, wonderful! Please do! But the judges
			here will be english speakers, so to be considered for the contest the lesson has to be
			accessible to them.
		</p>
		<li>It has to be publicly visible and available for people to consume for free</li>
	</ol>

	<h2>Copyright</h2>
	<p>By registering as a creator you agree to the following copyright notice:</p>
	<p class="indent-8 italic">
		I have permission to use all material (music, video clips, images, software, etc.) within my
		entry for commercial purposes. I have not used any Creative Commons Non-Commercial or
		copyrighted work unless I have explicit permission from the copyright holder to use their
		material. If I have used Creative Commons BY work, I have provided appropriate attribution. If I
		have used Creative Commons Share-Alike, I have made sure my entry is also licensed under a
		Creative Commons license.
	</p>
	<p>
		Exception: We have a standing agreement with Desmos that you may use this software in the
		competition.
	</p>

	<h2>When is the registration deadline?</h2>
	{#if competitionStarted()}
		<p>
			You can register until
			<Time datetime={PUBLIC_REGISTRATION_END} />
		</p>
	{:else}
		<p>The competition has not started yet</p>
	{/if}

	<h2>How will winners be selected?</h2>
	<p>Here's what we're looking for:</p>
	<ul>
		<li>
			<b> Clarity: </b>
			Jargon should be explained, the goals of the lesson should be understandable with minimal background,
			and the submission should generally display empathy for people unfamiliar with the topic.
		</li>
		<li>
			<b>Motivation:</b> It should be clear to the reader/viewer within the first 30 seconds why they
			should care.
		</li>
		<li>
			<b>Novelty:</b> It doesn't necessarily have to be an original idea or original topic, but it should
			offer someone an experience they might otherwise not have by searching around online. Some of the
			greatest value comes from covering common topics in better ways. Other times there's value in surfacing
			otherwise obscure ideas which more people should know about.
		</li>
		<li>
			<b>Memorability:</b> Something should make the piece easy to remember even several months later.
			Maybe it's the beauty of the presentation, the enthusiasm of the presenter, or the mind-blowingness
			of an aha moment.
		</li>
	</ul>
	<p>
		A peer review process will help filter the better entries. Then the admins will manually select
		the best entries.
	</p>
	<strong>
		If your entry does not respect the rules or copyright notice you will not be eligible to accept
		any prize money.
	</strong>
	<p>
		For longer works, judges might not be able to consume the full video/post. Again, what's hard
		about this is that sometimes great explainers are longer, such as a full lecture and we don't
		want to discourage those. Just understand that to select winners, there is only so much time
		available for review, so the substance of your work should be clearly visible with a 5-10 minute
		view.
	</p>
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
