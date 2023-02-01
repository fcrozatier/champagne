<script>
	import '../app.css';
</script>

<div class="flex h-full flex-col">
	<header class="navbar px-4">
		<nav class="">
			<a href="/">Home</a>
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
