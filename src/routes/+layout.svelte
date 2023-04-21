<script lang="ts">
	import '../app.css';
	import { voteOpen } from '$lib/utils';
	import type { LayoutData } from './$types';
	import Icon from '$lib/components/Icon.svelte';
	import { page } from '$app/stores';
	import { COMPETITION } from '$lib/config';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	export let data: LayoutData;

	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="flex min-h-[100vh] flex-col">
	<header class="navbar p-4">
		<nav class="flex gap-8">
			<a class="inline-flex items-center gap-4" href="/">
				<img src="/images/logo.png" width="64" height="64" alt="Logo" />
				<span>Home</span></a
			>
			{#if voteOpen() && data.token}
				<a href="/vote">Vote</a>
			{/if}
			{#if $page.data.isAdmin}
				<a href="/admin">Admin</a>
			{/if}
		</nav>
	</header>
	<div class="alert alert-error mx-auto max-w-2xl text-sm">
		The Peer Review website is currently undergoing a beta test. If you would like to help with the
		test, please submit your favorite 3blue1brown video or blog post as an entry and participate in
		each phase of the competition!
	</div>

	<main class="prose mb-40 mt-8 max-w-full">
		<h1 class="text-center">{COMPETITION}</h1>
		<slot />
	</main>

	<footer class="mt-auto flex flex-wrap justify-center gap-20 p-4">
		<a href="https://github.com/fcrozatier/champagne" class="inline-flex items-center gap-3"
			><Icon name="github" /> Champagne
		</a>
		<a href="/gdpr"> GDPR </a>
		<a href="/rules"> Rules </a>
		<a href="/contact"> Contact </a>
	</footer>
</div>
