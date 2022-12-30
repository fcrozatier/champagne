<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2>Vote</h2>
{#if data.userNotFound}
	<p>Invalid token</p>
{/if}
