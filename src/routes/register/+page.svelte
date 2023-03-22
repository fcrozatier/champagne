<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { registrationOpen } from '$lib/utils';
	import { categories } from '$lib/categories';
	import type { Snapshot } from './$types';
	import { PUBLIC_COMPETITION_NAME } from '$env/static/public';
	import { tick } from 'svelte';

	export let form;

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
		const lastEmail = document.getElementById(`email_${otherContributors.length - 1}`);
		(lastEmail as HTMLInputElement)?.focus();
	}
</script>

<svelte:head>
	<title>Register &middot; {PUBLIC_COMPETITION_NAME}</title>
</svelte:head>

<article class="layout-prose">
	{#if form?.success}
		<h2>Thank you for participating!</h2>
		{#if otherContributors.length === 0}
			<p>
				A confirmation email has been sent to <em>{form.user.email}</em> with your link for the
				voting phase. <strong>Please do not delete this email.</strong>
			</p>
			<p>The vote is not open yet but you can bookmark your link now:</p>
			<p>
				<a href="/vote/{form.user.token}">your personal link</a>
			</p>
		{:else}
			<p>
				Every member of the team will receive shortly a confirmation email with his link for the
				voting phase. <strong>Please do not delete this email.</strong>
			</p>
		{/if}
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
				use:enhance={({ submitter, data }) => {
					data.append('others', JSON.stringify(otherContributors));
					submitter?.setAttribute('disabled', 'on');

					return ({ update }) => {
						update().then(() => submitter?.removeAttribute('disabled'));
					};
				}}
			>
				<label for="user-type" class="label">I want to register as a</label>
				<select
					id="user-type"
					name="userType"
					class="select-bordered select w-full max-w-xs"
					bind:value
					required
				>
					<option disabled selected />
					<option value="creator">Creator</option>
					<option value="judge">Judge</option>
				</select>
				{#if form?.fieldErrors?.userType}
					<span class="block text-error">{form.fieldErrors.userType.join(', ')}</span>
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
				{#if form?.fieldErrors?.email}
					<span class="block text-error">{form.fieldErrors.email.join(', ')}</span>
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
					<p class="flex items-center gap-2 text-sm text-gray-500">
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
				{#if form?.emailExists}
					<span class="block text-error">email already registered : {form.emailExists}</span>
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
					{#if form?.fieldErrors?.category}
						<span class="block text-error">{form.fieldErrors.category.join(', ')}</span>
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
					{#if form?.fieldErrors?.title}
						<span class="block text-error">{form.fieldErrors.title.join(', ')}</span>
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
					{#if form?.fieldErrors?.description}
						<span class="block text-error">{form.fieldErrors.description.join(', ')}</span>
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
					{#if form?.fieldErrors?.link}
						<span class="block text-error">{form.fieldErrors.link.join(', ')} </span>
					{:else if form?.linkExists}
						<span class="block text-error">entry already registered</span>
					{/if}
				{/if}

				<label for="rules" class="label flex gap-2">
					<input id="rules" type="checkbox" name="rules" class="checkbox" required />
					<span class="flex-1"> I've read the <a href="/rules">rules</a> of the competition </span>
				</label>
				{#if form?.fieldErrors?.rules}
					<span class="block text-error">{form.fieldErrors.rules.join(', ')} </span>
				{/if}

				{#if form?.fieldErrors || $page.status !== 200}
					<p class="block text-error">Something went wrong. Please try again</p>
				{/if}
				<p>
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
