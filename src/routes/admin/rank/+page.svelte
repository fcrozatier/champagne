<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let computing = false;
</script>

<article class="layout-prose">
	<h2>Rank entries</h2>
	<h3>A. Compute the diameter</h3>
	{#if data.diameter}
		<p>
			The diameter of the graph is {data.diameter}
		</p>
	{/if}
	{#if !computing}
		<form
			method="post"
			action="?/compute_diameter"
			use:enhance={({ form }) => {
				const button = form.querySelector('button');
				button?.setAttribute('disabled', 'on');
				computing = true;
				return async ({ update }) => {
					computing = false;
					button?.removeAttribute('disabled');
					await update();
				};
			}}
		>
			<p>Compute the diameter of the graph</p>
			<button class="btn " type="submit">Compute</button>
		</form>
	{:else}
		<p>Processing... This can take a moment</p>
	{/if}

	<h3>B. Bubble-up the better entries</h3>
	<p>Applies a PageRank algorithm and returns the top 100 entries</p>
	<form
		method="post"
		action="?/rank"
		use:enhance={({ form }) => {
			const button = form.querySelector('button');
			button?.setAttribute('disabled', 'on');
			computing = true;
			return async ({ update }) => {
				computing = false;
				button?.removeAttribute('disabled');
				await update();
			};
		}}
	>
		<button class="btn" type="submit">Rank</button>
	</form>
	{#if form?.ID === 'rank'}
		<table class="table table-zebra w-full">
			<thead>
				<tr>
					<th />
					<th>Title</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{#each form?.ranking as { title, link, score }, i}
					<tr>
						<th>{i + 1}</th>
						<td><a class="capitalize" href={link}>{title}</a></td>
						<td><span>{score}</span></td>
					</tr>
				{:else}
					<p>No entries ranked</p>
				{/each}
			</tbody>
		</table>
	{/if}
</article>
