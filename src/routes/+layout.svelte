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
				<!-- <Icon height="3rem" width="3rem" name="logo" /> -->
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

		<div class="flex-1" />
	</header>

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
