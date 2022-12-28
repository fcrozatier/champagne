<script>
	import '../app.css';
	import { setContext } from 'svelte';
	import { PUBLIC_REGISTRATION_DEADLINE } from '$env/static/public';

	const now = new Date();
	const deadline = new Date(PUBLIC_REGISTRATION_DEADLINE);
	const registrationOpen = now < deadline;

	setContext('registrationOpen', registrationOpen);

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

<main class="prose mx-auto mt-20 mb-40">
	<h1 class="text-center">Champagne x SOME 2.5</h1>
	<slot />
</main>
