<script lang="ts">
	import { resultsAvailable, competitionStarted, voteOpen, phaseOpen } from '$lib/utils';
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
	import Icon from '../lib/components/Icon.svelte';

	const phases = [
		{
			title: 'Join the competition as a participant or judge',
			description:
				'Participants all work on their projects. Most of the activity during this phase happens on <a href="https://discord.gg/WZvZMVsXXR" target="_blank">Discord</a>, where many people share partial progress, find collaborators, and ask questions.',
			isOpen: phaseOpen(PUBLIC_REGISTRATION_START, PUBLIC_VOTE_END),
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
		{
			title: 'Title can become very very very long, and that is just an example! ',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi laudantium odit numquam cum consequuntur quis nihil quod in alias quas vel porro, nemo voluptatum illo unde? Reiciendis corporis necessitatibus cupiditate. Eveniet, dicta iste? Aut suscipit maxime ut vero ad explicabo voluptate, architecto repellat ab. Atque quia neque commodi magnam perspiciatis possimus, quaerat minima optio deserunt quisquam, fuga recusandae quos pariatur illum necessitatibus qui quod velit quasi modi eligendi. Aperiam ad neque voluptas nam nihil ipsa tempora fugiat, soluta, aliquam exercitationem aspernatur ullam deserunt minima non! Possimus nisi quam, explicabo, nam numquam, culpa ad a temporibus amet praesentium quas? Deleniti ab saepe debitis rerum quis, vel distinctio, fuga necessitatibus quisquam iste vero, corporis modi ut nam assumenda cum dolore dolorum esse dicta quasi tempore rem. Esse ea modi commodi animi, eligendi, voluptate, dolorem eaque et iure suscipit eos veniam fugit necessitatibus harum voluptas.',
			link: 'https://www.youtube.com/embed/5M2RWtD4EzI',
			video: true
		},
		{
			title: 'Title',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi laudantium odit numquam cum consequuntur quis nihil quod in alias quas vel porro, nemo voluptatum illo unde? Reiciendis corporis necessitatibus cupiditate. Eveniet, dicta iste? Aut suscipit maxime ut vero ad explicabo voluptate, architecto repellat ab. Atque quia neque commodi magnam perspiciatis possimus, quaerat minima optio deserunt quisquam, fuga recusandae quos pariatur illum necessitatibus qui quod velit quasi modi eligendi. Aperiam ad neque voluptas nam nihil ipsa tempora fugiat, soluta, aliquam exercitationem aspernatur ullam deserunt minima non! Possimus nisi quam, explicabo, nam numquam, culpa ad a temporibus amet praesentium quas? Deleniti ab saepe debitis rerum quis, vel distinctio, fuga necessitatibus quisquam iste vero, corporis modi ut nam assumenda cum dolore dolorum esse dicta quasi tempore rem. Esse ea modi commodi animi, eligendi, voluptate, dolorem eaque et iure suscipit eos veniam fugit necessitatibus harum voluptas.',
			link: 'https://www.youtube.com/embed/gsZiJeaMO48',
			video: true
		},
		{
			title: 'Title',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi laudantium odit numquam cum consequuntur quis nihil quod in alias quas vel porro, nemo voluptatum illo unde? Reiciendis corporis necessitatibus cupiditate. Eveniet, dicta iste? Aut suscipit maxime ut vero ad explicabo voluptate, architecto repellat ab. Atque quia neque commodi magnam perspiciatis possimus, quaerat minima optio deserunt quisquam, fuga recusandae quos pariatur illum necessitatibus qui quod velit quasi modi eligendi. Aperiam ad neque voluptas nam nihil ipsa tempora fugiat, soluta, aliquam exercitationem aspernatur ullam deserunt minima non! Possimus nisi quam, explicabo, nam numquam, culpa ad a temporibus amet praesentium quas? Deleniti ab saepe debitis rerum quis, vel distinctio, fuga necessitatibus quisquam iste vero, corporis modi ut nam assumenda cum dolore dolorum esse dicta quasi tempore rem. Esse ea modi commodi animi, eligendi, voluptate, dolorem eaque et iure suscipit eos veniam fugit necessitatibus harum voluptas.',
			link: 'https://www.youtube.com/embed/a-767WnbaCQ',
			video: true
		},
		{
			title: 'Title',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi laudantium odit numquam cum consequuntur quis nihil quod in alias quas vel porro, nemo voluptatum illo unde? Reiciendis corporis necessitatibus cupiditate. Eveniet, dicta iste? Aut suscipit maxime ut vero ad explicabo voluptate, architecto repellat ab. Atque quia neque commodi magnam perspiciatis possimus, quaerat minima optio deserunt quisquam, fuga recusandae quos pariatur illum necessitatibus qui quod velit quasi modi eligendi. Aperiam ad neque voluptas nam nihil ipsa tempora fugiat, soluta, aliquam exercitationem aspernatur ullam deserunt minima non! Possimus nisi quam, explicabo, nam numquam, culpa ad a temporibus amet praesentium quas? Deleniti ab saepe debitis rerum quis, vel distinctio, fuga necessitatibus quisquam iste vero, corporis modi ut nam assumenda cum dolore dolorum esse dicta quasi tempore rem. Esse ea modi commodi animi, eligendi, voluptate, dolorem eaque et iure suscipit eos veniam fugit necessitatibus harum voluptas.',
			link: 'https://www.youtube.com/embed/6hVPNONm7xw',
			video: true
		},
		{
			title: 'Title',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi laudantium odit numquam cum consequuntur quis nihil quod in alias quas vel porro, nemo voluptatum illo unde? Reiciendis corporis necessitatibus cupiditate. Eveniet, dicta iste? Aut suscipit maxime ut vero ad explicabo voluptate, architecto repellat ab. Atque quia neque commodi magnam perspiciatis possimus, quaerat minima optio deserunt quisquam, fuga recusandae quos pariatur illum necessitatibus qui quod velit quasi modi eligendi. Aperiam ad neque voluptas nam nihil ipsa tempora fugiat, soluta, aliquam exercitationem aspernatur ullam deserunt minima non! Possimus nisi quam, explicabo, nam numquam, culpa ad a temporibus amet praesentium quas? Deleniti ab saepe debitis rerum quis, vel distinctio, fuga necessitatibus quisquam iste vero, corporis modi ut nam assumenda cum dolore dolorum esse dicta quasi tempore rem. Esse ea modi commodi animi, eligendi, voluptate, dolorem eaque et iure suscipit eos veniam fugit necessitatibus harum voluptas.',
			link: 'https://explanaria.github.io/crystalgroups/',
			video: false,
			thumbnail: '/img/winner.webp'
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

<section class="layout-prose pb-10">
	<p class=" mb-16 text-center text-3xl font-light">Discover and create new math content.</p>
	<p>
		The {COMPETITION_FULL_NAME} ({COMPETITION_SHORT_NAME}) is an annual competition to foster the
		creation of excellent math content online. You can participate as either a creator or judge.
		Five winners will be selected to receive $1,000 and a golden pi creature, and twenty honorable
		mentions will receive $500 each. <a href="#rules">Learn more</a>
	</p>
</section>

<section class="pb-28">
	<h2 class="mb-20 text-5xl font-black text-center">The 5 winners are</h2>

	<div class="grid gap-16">
		{#each winners as winner}
			<div class="flex flex-wrap items-start justify-center gap-6 lg:gap-10">
				<div class="px-4">
					{#if winner.video}
						<iframe
							width="420"
							class="aspect-video rounded-lg max-w-full"
							src={winner.link}
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
							loading="lazy"
						/>
					{:else}
						<a href={winner.link} target="_blank" class="w-[420px]">
							<img
								src={winner.thumbnail}
								alt="Winner thumbnail"
								width="420"
								class="aspect-video rounded-lg max-w-full m-0"
								loading="lazy"
							/>
						</a>
					{/if}
				</div>
				<div class="max-w-sm mx-4">
					<h3 class="mt-0 mb-3">{winner.title}</h3>
					<p class="line-clamp-6 leading-snug">{winner.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="text-ligh bg-black/95 pb-32 pt-24 text-center" style:color="var(--light-gold)">
	<div class="mx-auto max-w-prose">
		<h2 class="my-0 text-5xl font-black" style:color="var(--light-gold)">
			The 20 honorable mentions
		</h2>
		<p class="mt-8 font-light tracking-wider">
			Discover the 5 winners of the last edition. <br />

			The 20 honorable mentions as well as the full list of entries is available
			<a
				class="font-light"
				style:color="var(--light-gold)"
				href="https://www.3blue1brown.com/blog/some2">here</a
			>
		</p>
	</div>
	<div class="custom-grid px-4">
		{#each Array.from({ length: 16 }) as _, i}
			<div class="flex flex-col gap-3">
				<div class="">
					<iframe
						width="360"
						class="aspect-video rounded-lg max-w-full"
						src={winners[0].link}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
						loading="lazy"
					/>
				</div>
				<div class="px-2">
					<h4 class="mt-0" style:color="var(--light-gold)">{winners[0].title}</h4>
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="mt-10 pt-10">
	<h2 class="text-center text-2xl font-light">
		Prizes and operations for this contest have been generously funded by
	</h2>
	<div class="flex justify-center">
		<a href="https://www.janestreet.com/" target="_blank">
			<Icon class="opacity-10" name="janeStreet" width="18rem" height="5rem" />
		</a>
	</div>
</section>

<style>
	.custom-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 320px));
		justify-content: center;
		gap: theme(space.12) theme(space.16);
	}

	* {
		/* outline: 1px solid red; */
	}
</style>
