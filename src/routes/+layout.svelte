<script>
	import '../app.css';
</script>

<div class="h-full flex flex-col">
	<header class="navbar px-4">
		<nav class="">
			<a href="/">Home</a>
		</nav>

		<div class="flex-1 " />
	</header>

	<main class="prose max-w-full mt-10 mb-40">
		<h1 class="text-center">SOME 2.5</h1>
		<slot />
	</main>

	<footer class="mt-auto">
		<a href="https://github.com/fcrozatier/champagne"> Champagne </a>
	</footer>
</div>
