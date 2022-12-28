<script>
	import {
		PUBLIC_CURRENT_PHASE,
		PUBLIC_VOTING_OPEN,
		PUBLIC_RESULTS_OPEN,
		PUBLIC_REGISTRATION_DEADLINE
	} from '$env/static/public';
	import { getContext } from 'svelte';

	const intl = getContext('intl');
	const registrationOpen = getContext('registrationOpen');

	const phase = parseInt(PUBLIC_CURRENT_PHASE);

	const descriptions = [
		'Phase 1: Register as a creator or judge',
		'Phase 2: Vote for the best contributions',
		'Phase 3: Results'
	];
</script>

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
			<li class={phase === i + 1 ? 'marker:text-green-500' : ''}>
				<p class="flex items-center gap-2">
					{description}
					{#if phase === i + 1}
						<span class="badge badge-success">current</span>
					{/if}
				</p>
			</li>
		{/each}
	</ul>

	{#if phase === 0}
		<p>The competition is closed, stay tuned for the next edition !</p>
	{/if}

	{#if registrationOpen}
		<h2>Participate</h2>
		<strong>Phase 1 is open</strong>
		<p>
			You can register until
			<time datetime={PUBLIC_REGISTRATION_DEADLINE}>
				{intl.format(Date.parse(PUBLIC_REGISTRATION_DEADLINE))}
			</time>
		</p>
		<p><a class="btn" href="/register">Go to registration page</a></p>
	{/if}
</article>
