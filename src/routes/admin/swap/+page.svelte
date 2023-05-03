<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EntryProperties } from '$lib/server/neo4j';
	import { categories } from '$lib/config.js';
	import { page } from '$app/stores';
	import { YOUTUBE_EMBEDDABLE } from '$lib/utils.js';
	import { afterUpdate } from 'svelte';

	export let form;

	let email = '';

	$: entry = form?.entry as EntryProperties;

	let link = '';

	afterUpdate(() => {
		if (entry?.link && !link) {
			link = entry.link;
		}
	});
</script>

<article class="layout-prose">
	<h2>Swap entries</h2>
	<form
		class="space-y-4"
		action="?/find"
		method="post"
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'on');

			return async ({ update }) => {
				await update({ reset: false });
				submitter?.removeAttribute('disabled');
			};
		}}
	>
		<div class="form-control max-w-xs">
			<label for="email"><span class="label-text">Creator email</span></label>
			<input id="email" type="email" class="input-bordered input" name="email" bind:value={email} />
		</div>
		<div>
			<button class="btn">Find</button>
			{#if form?.creatorNotFound}
				<p class="text-error">Creator not found</p>
			{/if}
		</div>
	</form>

	{#if entry}
		<h3>Entry data</h3>
		<form
			method="post"
			action="?/swap"
			enctype="multipart/form-data"
			use:enhance={({ submitter }) => {
				submitter?.setAttribute('disabled', 'on');

				return async ({ update }) => {
					await update();
					submitter?.removeAttribute('disabled');
				};
			}}
		>
			<div class="form-control max-w-xs">
				<label for="category" class="label">
					<span class="label-text"> Category </span>
				</label>
				<select
					id="category"
					name="category"
					class="select-bordered select w-full"
					value={entry.category}
					required
				>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
				{#if form?.ID === 'swap' && form?.fieldErrors?.category}
					<span class="block text-error">{form.fieldErrors.category.join(', ')}</span>
				{/if}
			</div>

			<div class="form-control max-w-xs">
				<label for="title" class="label">
					<span class="label-text">Title</span>
				</label>
				<input
					id="title"
					type="text"
					name="title"
					class="input-bordered input w-full"
					value={entry.title}
					required
				/>
				{#if form?.ID === 'swap' && form?.fieldErrors?.title}
					<span class="block text-error">{form.fieldErrors.title.join(', ')}</span>
				{/if}
			</div>

			<div class="form-control max-w-xs">
				<label for="description" class="label">
					<span class="label-text">Short description</span>
				</label>
				<textarea
					id="description"
					name="description"
					class="textarea-bordered textarea text-base"
					maxlength="500"
					value={entry.description}
					required
				/>
				{#if form?.ID === 'swap' && form?.fieldErrors?.description}
					<span class="block text-error">{form.fieldErrors.description.join(', ')}</span>
				{/if}
			</div>

			<div class="form-control max-w-xs">
				<label for="link" class="label">
					<span class="label-text"> Link </span>
				</label>
				<input
					id="link"
					type="url"
					name="link"
					placeholder="https://"
					class="input-bordered input w-full"
					bind:value={link}
				/>
				{#if form?.ID === 'swap' && form?.fieldErrors?.link}
					<span class="block text-error">{form.fieldErrors.link.join(', ')} </span>
				{:else if form?.ID === 'swap' && form?.linkExists}
					<span class="block text-error">entry already registered</span>
				{/if}
			</div>

			{#if link && !YOUTUBE_EMBEDDABLE.test(link)}
				<div class="form-control max-w-xs">
					<label for="thumbnail" class="label">
						<span class="label-text">Thumbnail</span>
						<span class="label-text-alt">Recommended ratio 16:9</span>
					</label>
					<input
						id="thumbnail"
						type="file"
						accept="image/*"
						name="thumbnail"
						class="file-input input-bordered"
						required
					/>
					{#if form?.ID === 'swap' && form?.fieldErrors?.thumbnail}
						<span class="block text-error">{form.fieldErrors.thumbnail.join(', ')} </span>
					{:else if form?.thumbnailRequired}
						<span class="block text-error">A thumbnail is required</span>
					{/if}
				</div>
			{/if}

			<input type="hidden" name="email" value={email} />

			{#if form?.fieldErrors || $page.status !== 200}
				<p class="block text-error">Something went wrong. Please try again</p>
			{/if}
			<div>
				<p>
					<strong>
						Swapping will create a new entry replacing the old one, and will remove all current
						votes for this entry.
					</strong>
				</p>
				<button class="btn-error btn block">Swap entries</button>
			</div>
		</form>
	{/if}
</article>
