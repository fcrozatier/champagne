<script lang="ts">
	import { enhance } from '$app/forms';
	import { registrationOpen } from '$lib/utils';
	import { categories } from '$lib/categories';
	import type { ActionData, Snapshot } from './$types';
	import { PUBLIC_COMPETITION_NAME } from '$env/static/public';
	import { tick } from 'svelte';

	export let form: ActionData;

	export const snapshot: Snapshot = {
		capture: () => {
			return {
				value,
				email,
				otherContributors,
				category,
				title,
				description,
				link
			};
		},
		restore: (v) => {
			value = v.value;
			email = v.email;
			otherContributors = v.otherContributors;
			category = v.category;
			title = v.title;
			description = v.description;
			link = v.link;
		}
	};

	let value: 'creator' | 'judge';
	let email: string;
	let otherContributors: string[] = [];
	let category: string;
	let title: string;
	let description = '';
	let link: string;

	async function addContributor() {
		otherContributors = [...otherContributors, ''];
		await tick();
		const email = document.querySelector('input[type="email"]:last-of-type');
		if (email) {
			(email as HTMLInputElement).focus();
		}
	}

	$: console.log(otherContributors);
</script>

<svelte:head>
	<title>Register &middot; {PUBLIC_COMPETITION_NAME}</title>
</svelte:head>

<article class="layout-prose">
	{#if form?.success}
		<h2>Thank you for participating!</h2>
		<p>
			A confirmation email has been sent to <em>{form.email}</em> with your link for the voting phase.
		</p>
		<p>
			<strong>Do not delete this email.</strong>
		</p>
		<p>See you in the voting phase.</p>
	{:else}
		<h2>Register for the competition</h2>
		<h3>Creators</h3>
		<p>
			If you are a creator, fill the form below to register your entry for the voting phase. As a
			creator you are automatically registered as a judge for the voting phase.
		</p>
		<h3>Judges</h3>
		<p>
			If you don't want to register an entry you can still help out in the voting phase as a judge.
		</p>
		<h3>Rules</h3>
		<ul>
			<li>You can only register one entry per person/group for the competition</li>
			<li>You cannot register both as a creator and as a judge</li>
		</ul>
		<p>Read the <a href="/rules">rules</a> first</p>

		{#if !registrationOpen()}
			<p>
				<strong>Registration is now closed</strong>
			</p>
		{:else}
			<form
				method="post"
				use:enhance={({ form, data }) => {
					data.append('others', JSON.stringify(otherContributors));

					const button = form.querySelector('button');
					button?.setAttribute('disabled', 'on');

					return async ({ update }) => {
						await update();
						button?.removeAttribute('disabled');
					};
				}}
			>
				<label for="user" class="label">I want to register as a</label>
				<select
					id="user"
					name="user"
					class="select-bordered select w-full max-w-xs"
					bind:value
					required
				>
					<option disabled />
					<option value="creator">Creator</option>
					<option value="judge">Judge</option>
				</select>
				{#if form?.userInvalid}
					<span class="block text-error">invalid value</span>
				{/if}

				<label for="email" class="label"
					>{otherContributors.length === 0 ? 'Email' : 'Emails'}</label
				>
				<input
					id="email"
					type="email"
					name="email"
					placeholder="john@gmail.com"
					class="input-bordered input w-full max-w-xs"
					bind:value={email}
					required
				/>
				{#if form?.emailInvalid}
					<span class="block text-error">email is required</span>
				{:else if form?.emailExists}
					<span class="block text-error">email already registered</span>
				{/if}
				{#if value === 'creator'}
					{#each otherContributors as _, i}
						<p class="flex items-center gap-2">
							<input
								id="email_{i}"
								type="email"
								name="email_{i}"
								class="input-bordered input w-full max-w-xs"
								bind:value={otherContributors[i]}
								required
							/>
							<button
								type="button"
								class="btn-outline btn-xs btn-circle btn opacity-80"
								on:click={() => {
									otherContributors.splice(i, 1);
									otherContributors = otherContributors;
								}}>&cross;</button
							>
						</p>
					{/each}
					{#if form?.othersInvalid}
						<span class="block text-error">something is wrong with the emails</span>
					{:else if form?.duplicateEmails}
						<span class="block text-error">emails should be unique</span>
					{/if}
					<p class="text-sm text-gray-500">
						Add contributor
						<button
							type="button"
							class="btn-outline btn-sm btn-circle btn opacity-80"
							on:click={addContributor}
						>
							+</button
						>
					</p>
				{/if}

				{#if value === 'creator'}
					<label for="category" class="label">Category</label>
					<select
						id="category"
						name="category"
						class="select-bordered select w-full max-w-xs"
						bind:value={category}
						required
					>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					{#if form?.categoryInvalid}
						<span class="block text-error">invalid category</span>
					{/if}

					<label for="title" class="label">Title</label>
					<input
						id="title"
						type="text"
						name="title"
						class="input-bordered input w-full max-w-xs"
						bind:value={title}
						required
					/>
					{#if form?.titleInvalid}
						<span class="block text-error">a title is required</span>
					{/if}

					<label for="description" class="label">Short description</label>
					<textarea
						id="description"
						name="description"
						class="textarea-bordered textarea w-full max-w-xs text-base"
						maxlength="500"
						bind:value={description}
						required
					/>
					<div class="w-full max-w-xs text-right leading-none">
						<span class="label-text-alt">{description.length}/500</span>
					</div>
					{#if form?.descriptionInvalid}
						<span class="block text-error">a description is required</span>
					{:else if form?.descriptionTooLong}
						<span class="block text-error">500 characters max</span>
					{/if}

					<label for="link" class="label">Link to your entry</label>
					<input
						id="link"
						type="url"
						name="link"
						placeholder="https://"
						class="input-bordered input w-full max-w-xs"
						bind:value={link}
						required
					/>
					{#if form?.linkInvalid}
						<span class="block text-error">a link to your entry is required </span>
					{:else if form?.linkExists}
						<span class="block text-error">entry already registered</span>
					{/if}
				{/if}

				<label for="rules" class="label flex gap-2">
					<input id="rules" type="checkbox" name="rules" class="checkbox" required />
					<span class="flex-1"> I've read the <a href="/rules">rules</a> of the competition </span>
				</label>
				{#if form?.rulesInvalid}
					<span class="block text-error">you need to read the rules first </span>
				{/if}

				<p>
					{#if form?.invalid}
						<span class="block text-error">something went wrong. Please try again </span>
					{/if}
					<button class="btn block" disabled={!registrationOpen()}>Register</button>
				</p>
				<p class="text-sm">
					<a href="/gdpr">Privacy policy</a>
				</p>
			</form>
		{/if}
	{/if}
</article>

<style>
	label {
		margin-top: theme('margin.2');
	}
</style>
