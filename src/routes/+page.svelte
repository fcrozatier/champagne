<script>
	import { getContext } from 'svelte';
	import { registrationOpen, votingOpen, resultsAvailabe, competitionStarted } from '$lib/utils';
	import { PUBLIC_REGISTRATION_END, PUBLIC_REGISTRATION_START } from '$env/static/public';

	const intl = getContext('intl');

	const phases = [registrationOpen(), votingOpen(), resultsAvailabe()];

	const descriptions = [
		'Phase 1: Register as a creator or judge',
		'Phase 2: Vote for the best contributions',
		'Phase 3: Results and feedback'
	];
</script>

<svelte:head>
	<title>Champagne !</title>
</svelte:head>

<article>
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
				The competition will start <time datetime={PUBLIC_REGISTRATION_START}>
					{intl.format(Date.parse(PUBLIC_REGISTRATION_START))}
				</time>
			</p>
		{/if}
	{/if}

	{#if registrationOpen()}
		<h2>Register</h2>
		<strong>Phase 1 is open</strong>
		<p>
			You can register until
			<time datetime={PUBLIC_REGISTRATION_END}>
				{intl.format(Date.parse(PUBLIC_REGISTRATION_END))}
			</time>
		</p>
		<p><a class="btn" href="/register">Go to registration page</a></p>
	{/if}
</article>
