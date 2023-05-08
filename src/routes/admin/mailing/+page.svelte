<script lang="ts">
	import { page } from '$app/stores';
	import { templates } from '$lib/config';

	let selected: string[] = [];
</script>

<article class="layout-prose">
	<h2>Send a message to the mailing list</h2>

	<form>
		<p>Choose a message to send</p>

		<div class="form-control">
			{#each Object.keys(templates) as template_name, i}
				<label for="template-{i}" class="label cursor-pointer justify-start gap-2">
					<input
						id="template-{i}"
						class="radio"
						type="radio"
						name="template_name"
						value={template_name}
						bind:group={selected}
						required
					/>
					<span class="label-text capitalize"> {template_name.replaceAll('_', ' ')} </span>
				</label>
			{/each}
		</div>
		<p>
			<button class="btn-error btn" disabled={!selected.length}
				>Send message to all recipients of the mailing list</button
			>
		</p>
		{#if $page.status !== 200}
			<p class="text-error">Something went wrong</p>
		{/if}
	</form>
</article>
