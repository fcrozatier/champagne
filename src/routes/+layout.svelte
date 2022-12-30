<script>
	import '../app.css';
	import { setContext } from 'svelte';

	setContext(
		'intl',
		new Intl.DateTimeFormat('en', {
			// weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		})
	);
</script>

<header class="navbar px-4">
	<nav class="">
		<a href="/">Home</a>
	</nav>

	<div class="flex-1 " />
</header>

<main class="prose mx-auto mt-10 mb-40">
	<h1 class="text-center">Champagne x SOME 2.5</h1>
	<slot />
</main>
