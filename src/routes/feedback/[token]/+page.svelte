<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<article class="layout-prose">
	{#if data.invalidToken}
		<h2>Invalid token</h2>
		<p>You can use the link you received by email to access your feedback</p>
	{:else if data.feedbacks}
		{#each data.feedbacks as feedback, i}
			<h3>Feedback {i + 1}</h3>
			<p class="capitalize">{feedback}</p>
		{/each}
	{/if}
</article>