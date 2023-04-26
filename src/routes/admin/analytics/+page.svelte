<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { loadPyodide } from 'pyodide';
	import { page } from '$app/stores';
	import { registrationOpen } from '$lib/utils';

	export let data: PageData;

	let computing = false;
	let message = 'Computing... this can take a moment';

	async function createGraph() {
		message = 'Loading Pyodide, Numpy and utilities...';
		const pyodide = await loadPyodide({
			indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.1/full'
		});
		await pyodide.loadPackage('numpy');
		const utilities = import.meta.glob('/graph/utilities.py', { eager: true, as: 'raw' });
		pyodide.runPython(utilities['/graph/utilities.py']);

		message = 'Computing graph edges...';
		const edges = [];
		for (const item of data.analytics) {
			const N = item.count;
			const k = Math.ceil(Math.log(N));
			const pairs = await pyodide.runPythonAsync(`expander_from_cycles(${k},${N})`);
			edges.push({ category: item.category, edges: pairs.toJs() });
		}

		return edges;
	}
</script>

<article class="layout-prose">
	<h2>Graph analytics</h2>
	<h3>Users</h3>

	<ul>
		<li><b>Creators:</b> {data.analytics.reduce((prev, x) => prev + x.count, 0)}</li>
		<li><b>Judges:</b> {data.judges}</li>
	</ul>

	<h3>Entries</h3>
	<table class="w-full">
		<thead>
			<tr>
				<th class="pl-8">Category</th>
				<th>Number</th>
			</tr>
		</thead>
		<tbody>
			{#each data.analytics as item, _}
				<tr>
					<td class="pl-8">{item.category}</td>
					<td class="pr-4">{item.count} </td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if !data.pairings && registrationOpen()}
		<p>To create the comparison graphs you need to close the registration first</p>
	{/if}
	{#if !data.pairings && !registrationOpen()}
		<p>Create the comparison graphs</p>
		{#if computing}
			<p>{message}</p>
		{:else}
			<form
				method="post"
				action="?/pairing"
				use:enhance={async ({ data }) => {
					computing = true;
					const edges = await createGraph();
					data.append('edges', JSON.stringify(edges));
					message = 'Creating relations in database...';

					return async ({ update }) => {
						await update();
						computing = false;
					};
				}}
			>
				<button class="btn" disabled={computing}>Create pairings</button>
				{#if $page.status !== 200}
					<p class="text-error">Something went wrong</p>
				{/if}
			</form>
		{/if}
	{/if}
</article>
