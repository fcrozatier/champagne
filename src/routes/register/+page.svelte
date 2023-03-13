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
		const email = document.querySelector('input[type="email"]:last-of-type');
		if (email) {
			(email as HTMLInputElement).focus();
		}
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
				{#if form?.userType?._errors}
					<span class="block text-error">{form.userType._errors.join(', ')}</span>
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
				{#if form?.email?._errors}
					<span class="block text-error">{form.email._errors.join(', ')}</span>
				{/if}
				{#if value === 'creator'}
					{#each otherContributors as _, i}
						<p class="flex items-center gap-2">
							<input
								id="email_{i}"
								type="email"
								name="email_{i}"
								placeholder={i === 0 ? 'john@gmail.com' : ''}
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
					{#if form?.others?._errors}
						<span class="block text-error">{form.others._errors.join(', ')}</span>
					{/if}
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
					{#if form?.category?._errors}
						<span class="block text-error">{form.category._errors.join(', ')}</span>
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
					{#if form?.title?._errors}
						<span class="block text-error">{form.title._errors.join(', ')}</span>
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
					{#if form?.description?._errors}
						<span class="block text-error">{form.description._errors.join(', ')}</span>
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
					{#if form?.link?._errors}
						<span class="block text-error">{form.link._errors.join(', ')} </span>
					{:else if form?.linkExists}
						<span class="block text-error">entry already registered</span>
					{/if}
				{/if}

				<label for="rules" class="label flex gap-2">
					<input id="rules" type="checkbox" name="rules" class="checkbox" required />
					<span class="flex-1"> I've read the <a href="/rules">rules</a> of the competition </span>
				</label>
				{#if form?.rules?._errors}
					<span class="block text-error">{form.rules._errors.join(', ')} </span>
				{/if}

				{#if form?._errors || $page.status !== 200}
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
