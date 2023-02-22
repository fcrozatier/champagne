<script lang="ts">
	import '../app.css';
	import { voteOpen } from '$lib/utils';
	import type { LayoutData } from './$types';
	import { PUBLIC_COMPETITION_NAME } from '$env/static/public';
	import Icon from '$lib/components/Icon.svelte';

	export let data: LayoutData;
</script>

<div class="flex min-h-[100vh] flex-col">
	<header class="navbar px-8">
		<nav class="flex gap-8">
			<a href="/">Home</a>
			{#if voteOpen() && data.token}
				<a href="/vote">Vote</a>
			{/if}
		</nav>

		<div class="flex-1 " />
	</header>

	<main class="prose mt-10 mb-40 max-w-full">
		<h1 class="text-center">{PUBLIC_COMPETITION_NAME}</h1>
		<slot />
	</main>

	<footer class="mt-auto flex flex-wrap justify-center gap-8 p-4">
		<a href="https://github.com/fcrozatier/champagne" class="inline-flex items-center gap-2"
			><Icon name="github" /> Champagne
		</a>
		<a href="/gdpr"> GDPR </a>
		<a href="/rules"> Rules </a>
		<a href="/contact"> Contact </a>
	</footer>
</div>
