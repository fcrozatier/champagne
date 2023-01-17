<script lang="ts">
	import { registrationOpen, resultsAvailable, competitionStarted, voteOpen } from '$lib/utils';
	import {
		PUBLIC_REGISTRATION_END,
		PUBLIC_REGISTRATION_START,
		PUBLIC_VOTE_END
	} from '$env/static/public';
	import Time from '$lib/components/Time.svelte';
	import type { PageData } from './$types';

	const phases = [registrationOpen(), voteOpen(), resultsAvailable()];

	const descriptions = [
		'Phase 1: Register as a creator or judge',
		'Phase 2: Vote for the best contributions',
		'Phase 3: Results and feedback'
	];

	export let data: PageData;
</script>

<svelte:head>
	<title>Champagne !</title>
</svelte:head>

<article class="layout-prose">
	<p>
		The SOME <small>(Summer Of Math Exposition)</small> is an annual competition to foster the creation
		of excellent math content. You can contribute as a creator or judge in different categories, video
		or non video.
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
			<p>Stay tuned for the announcement of phase 1.</p>
		{:else}
			<p>
				The competition will start <Time datetime={PUBLIC_REGISTRATION_START} />
			</p>
		{/if}
	{/if}

	{#if registrationOpen()}
		<h2>Register</h2>
		<strong>Phase 1 is open</strong>
		<p>
			You can register until
			<Time datetime={PUBLIC_REGISTRATION_END} />
		</p>
		<p><a class="btn" href="/register">Go to registration page</a></p>
	{/if}

	{#if voteOpen()}
		<h2>Vote</h2>
		<strong>Phase 2 is open</strong>
		<p>
			You can vote until
			<Time datetime={PUBLIC_VOTE_END} />
		</p>
		{#if data.token}
			<p><a class="btn" href="/vote/{data.token}">Vote</a></p>
		{:else}
			<p class="">If you are registered you can vote with the link you received by email</p>
		{/if}
	{/if}
</article>
