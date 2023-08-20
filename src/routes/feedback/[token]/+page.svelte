<script lang="ts">
	import { PUBLIC_RESULTS_AVAILABLE } from '$env/static/public';
	import { COMPETITION_SHORT_NAME } from '$lib/config';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Feedback &middot; {COMPETITION_SHORT_NAME}</title>
</svelte:head>

<article class="layout-prose">
	{#if Date.parse(PUBLIC_RESULTS_AVAILABLE) > Date.now()}
		<header class="text-green-600">
			<p>
				Hey! Good job on finding this route, it's not officially open but you can already check your
				feedback (at your own risk)
			</p>
		</header>
	{/if}
	{#if data.noFeedback}
		<h2>Looks empty</h2>
		<p>There's no feedback here yet, please try again later</p>
	{:else if data.feedbacks}
		{#each data.feedbacks as feedback, i}
			<h3>Feedback {i + 1}</h3>
			<p class="capitalize">{feedback}</p>
		{/each}
	{/if}
</article>
