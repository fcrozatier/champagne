<script lang="ts">
	import { page } from '$app/stores';
</script>

<article class="layout-prose min-h-[100vh]">
	<h2>{$page.status}</h2>
	<p>
		{$page.error?.message}
	</p>
</article>
