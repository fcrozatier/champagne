<script lang="ts">
	import { dev } from '$app/environment';
</script>

<article class="layout-prose">
	<h2>Admin area</h2>
	<ul>
		<li><a href="/admin/testdb">Test db connection</a></li>
		<li><a href="/admin/db-setup">Add db constraints and background job</a></li>
		{#if dev}
			<li><a href="/admin/fixtures">Add db fixtures (dev mode)</a></li>
		{/if}
		<li><a href="/admin/flagged">View flagged entries</a></li>
		<li><a href="/admin/rank">Rank entries</a></li>
	</ul>
</article>
