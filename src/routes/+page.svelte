<script>
	import {
		PUBLIC_CURRENT_PHASE,
		PUBLIC_REGISTRATION_OPEN,
		PUBLIC_VOTING_OPEN,
		PUBLIC_RESULTS_OPEN
	} from '$env/static/public';

	const phase = parseInt(PUBLIC_CURRENT_PHASE);

	const descriptions = [
		'Phase 1: Send your contribution',
		'Phase 2: Vote for the best contributions',
		'Phase 3: Results'
	];
</script>

<article>
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
	{:else}
		<p>We are currently in phase {phase} of the competition</p>
	{/if}

	{#if parseInt(PUBLIC_REGISTRATION_OPEN)}
		<p>You can register your entry for the competition</p>
		<p><a class="btn" href="/register">Go to registration page</a></p>
	{/if}
</article>
