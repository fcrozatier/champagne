<script lang="ts">
	import {
		registrationOpen,
		resultsAvailable,
		competitionStarted,
		voteOpen,
		YOUTUBE_EMBEDDABLE
	} from '$lib/utils';
	import Time from '$lib/components/Time.svelte';
	import type { ActionData, PageData } from './$types';
	import { clickOutside } from '$lib/actions';
	import { enhance } from '$app/forms';
	import { COMPETITION_FULL_NAME, COMPETITION_SHORT_NAME } from '$lib/config';
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

	const winners = [
		'https://explanaria.github.io/crystalgroups/',
		'https://www.youtube.com/embed/5M2RWtD4EzI',
		'https://www.youtube.com/embed/gsZiJeaMO48',
		'https://www.youtube.com/embed/a-767WnbaCQ',
		'https://www.youtube.com/embed/6hVPNONm7xw'
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

<article class="layout-prose pb-20">
	<p class=" mb-16 text-center text-3xl font-light">
		A fun way to discover excellent math content, and for creators a means to be discovered.
	</p>
	<p>
		The {COMPETITION_FULL_NAME} ({COMPETITION_SHORT_NAME}) is an annual competition to foster the
		creation of excellent math content online.
	</p>
	<p>
		If you would like to register for this competition as either an entrant or a judge, please use
		the registration button below and fill out the appropriate form. Note that you may only register
		as an entrant during the official registration phase, but you can register at a judge during the
		voting phase as well. If the registration phase has passed, please follow the instructions on
		this page for either voting or receiving feedback.
	</p>
	<h2 class="mb-6 text-4xl font-black">Timeline</h2>
	<p>The competition has three phases:</p>
	<ul class="-ml-7 list-outside">
		{#each phases as phase, i}
			<li class={phase.isOpen ? 'marker:text-green-500' : ''}>
				<div class="mb-4 mt-8">
					<span class="flex items-center gap-2 text-xl font-semibold">
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
				</div>
				<p class="text-sm">{phase.description}</p>
				{#if phase.isOpen}
					<p class="mt-6">
						{#if i === 0}
							<a class="btn" href="/register"
								>Go to registration page <span class="ml-4 inline-block">&rarr;</span></a
							>
						{:else if i === 1}
							{#if data.token}
								<a class="btn" href="/vote/{data.token}">Vote</a>
							{:else}
								<button
									type="button"
									class="btn-outline btn"
									on:click={() => {
										personalLinkDialog.showModal();
									}}
									>Resend me my personal link
								</button>
							{/if}
						{:else if i === 2}
							<a class="btn" href="/feedback/{data.token}">See feedbacks</a>
						{/if}
					</p>
				{/if}
			</li>
		{/each}
	</ul>

	{#if !competitionStarted()}
		{#if !PUBLIC_REGISTRATION_START}
			<p>The competition has not started yet.</p>
			<p>Stay tuned for the announcement of phase 1!</p>
		{/if}
	{/if}
</article>

<section class="text-ligh bg-black pb-32 pt-20 text-center" style="color: var(--light-gold);">
	<div class="mx-auto max-w-prose">
		<h2 class="my-0 text-5xl font-black" style="color: var(--light-gold);">Last year's edition</h2>
		<p class="mt-8 font-thin tracking-wide">
			Discover the 5 winners of the last edition. <br />

			The 20 honorable mentions as well as the full list of entries is available
			<a class="font-thin text-white" href="https://www.3blue1brown.com/blog/some2">here</a>
		</p>
	</div>
	<div class="mx-4">
		<div
			class="scrollbar rounded-box mx-auto mt-20 flex max-w-prose snap-x snap-proximity snap-always gap-10 overflow-auto pb-4"
		>
			{#each winners as winner, i}
				<div id="item-{i + 1}" class="snap-center">
					{#if YOUTUBE_EMBEDDABLE.test(winner)}
						<iframe
							width="420"
							class="aspect-video rounded-lg"
							src={winner}
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						/>
					{:else}
						<a href={winner} target="_blank" class="cursor-pointer">
							<iframe
								width="420"
								class="aspect-video rounded-lg"
								src={winner}
								title="Winner website"
								frameborder="0"
								allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
							/>
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="rules" class="layout-prose">
	<h2 class="mb-16 text-4xl font-black">How it works</h2>

	<details>
		<summary>
			<div class="text-xl font-medium">Is there a topic constraint?</div>
		</summary>
		<p>It has to be about math.</p>
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
	</details>
	<details>
		<summary>
			<div class="text-xl font-medium">How many entries can I submit?</div>
		</summary>
		<p>One entry per person / group</p>
		<p>
			We hope you make more, but we only have the capacity to judge participants based on a single
			entry.
		</p>
	</details>
	<details>
		<summary>
			<div class="text-xl font-medium">Can I use an old entry?</div>
		</summary>
		<p>It has to be something new you make this summer</p>
		<p>
			The spirit of this is to encourage people who've never put stuff online before. If you want to
			work on something you sort of started once before, that's probably fine, but it can't be
			something you already published before this contest. Optimally, you'd use this as a chance to
			try something new you otherwise might not have.
		</p>
	</details>
	<details>
		<summary>
			<div class="text-xl font-medium">Does it has to be in english?</div>
		</summary>
		<p>It has to be available in English: subtitles or translation are needed.</p>
		<p>
			If you want to put out an explainer in another language, wonderful! Please do! But the judges
			here will be english speakers, so to be considered for the contest the lesson has to be
			accessible to them.
		</p>
	</details>
	<details>
		<summary>
			<div class="text-xl font-medium">Can I use copyrighted material?</div>
		</summary>
		<p>By registering as a creator you agree to the following copyright notice:</p>
		<p class="indent-8 italic">
			I have permission to use all material (music, video clips, images, software, etc.) within my
			entry for commercial purposes. I have not used any Creative Commons Non-Commercial or
			copyrighted work unless I have explicit permission from the copyright holder to use their
			material. If I have used Creative Commons BY work, I have provided appropriate attribution. If
			I have used Creative Commons Share-Alike, I have made sure my entry is also licensed under a
			Creative Commons license.
		</p>
		<p>
			Exception: We have a standing agreement with Desmos that you may use this software in the
			competition.
		</p>
	</details>
	<details>
		<summary>
			<div class="text-xl font-medium">How will winners be selected?</div>
		</summary>
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
				<b>Novelty:</b> It doesn't necessarily have to be an original idea or original topic, but it
				should offer someone an experience they might otherwise not have by searching around online.
				Some of the greatest value comes from covering common topics in better ways. Other times there's
				value in surfacing otherwise obscure ideas which more people should know about.
			</li>
			<li>
				<b>Memorability:</b> Something should make the piece easy to remember even several months later.
				Maybe it's the beauty of the presentation, the enthusiasm of the presenter, or the mind-blowingness
				of an aha moment.
			</li>
		</ul>
		<p>
			A peer review process will help filter the better entries. Then the admins will manually
			select the best entries.
		</p>
		<strong>
			If your entry does not respect the rules or copyright notice you will not be eligible to
			accept any prize money.
		</strong>
		<p>
			For longer works, judges might not be able to consume the full video/post. Again, what's hard
			about this is that sometimes great explainers are longer, such as a full lecture and we don't
			want to discourage those. Just understand that to select winners, there is only so much time
			available for review, so the substance of your work should be clearly visible with a 5-10
			minute view.
		</p>
	</details>
</section>

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
