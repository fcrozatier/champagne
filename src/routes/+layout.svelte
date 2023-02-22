<script>
	import '../app.css';
	import { voteOpen } from '$lib/utils';
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[100vh] flex-col">
	<header class="navbar px-4">
		<nav class="flex gap-4">
			<a href="/">Home</a>
			{#if voteOpen() && $page.url.pathname.includes('/vote')}
				<a href="/vote">Vote</a>
			{/if}
		</nav>

		<div class="flex-1 " />
	</header>

	<main class="prose mt-10 mb-40 max-w-full">
		<h1 class="text-center">SOME 2.5</h1>
		<slot />
	</main>

	<footer class="mt-auto p-4">
		<a href="https://github.com/fcrozatier/champagne"> Champagne </a>
	</footer>
</div>
