<script lang="ts">
	import { dev } from '$app/environment';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<article class="layout-prose">
	<h2>Admin area</h2>
	<ul class="space-y-4">
		<li><a href="/admin/testdb">Test db connection</a></li>
		<li><a href="/admin/db-setup">Add db constraints and background job</a></li>
		{#if dev}
			<li><a href="/admin/fixtures">Add db fixtures (dev mode)</a></li>
		{/if}
		<li><a href="/admin/flagged">View flagged entries</a></li>
		<li><a href="/admin/feedbacks">Review feedbacks</a></li>
		{#if data.isAdmin}
			<li><a href="/admin/rank">Rank entries</a></li>
		{/if}
	</ul>
</article>
