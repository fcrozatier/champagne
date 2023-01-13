<script lang="ts">
	import { enhance } from '$app/forms';
	import { registrationOpen } from '$lib/utils';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let value: 'creator' | 'judge';
	let description = '';
</script>

<svelte:head>
	<title>Register</title>
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
				use:enhance={({ form }) => {
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
					bind:value
					class="select select-bordered w-full max-w-xs"
					required
				>
					<option disabled />
					<option value="creator">Creator</option>
					<option value="judge">Judge</option>
				</select>
				{#if form?.userInvalid}
					<span class="block text-error">invalid value</span>
				{/if}

				<label for="email" class="label">Email</label>
				<input
					id="email"
					type="email"
					name="email"
					placeholder="john@gmail.com"
					class="input input-bordered w-full max-w-xs"
					required
				/>
				{#if form?.emailInvalid}
					<span class="block text-error">email is required</span>
				{:else if form?.emailExists}
					<span class="block text-error">email already registered</span>
				{/if}

				{#if value === 'creator'}
					<label for="entry" class="label">Type of entry </label>
					<select id="entry" name="entry" class="select select-bordered w-full max-w-xs" required>
						<option value="video">Video</option>
						<option value="non-video">Non video</option>
					</select>
					{#if form?.entryInvalid}
						<span class="block text-error">entry is invalid</span>
					{/if}

					<label for="title" class="label">Title of your entry</label>
					<input
						id="title"
						type="text"
						name="title"
						class="input input-bordered w-full max-w-xs"
						required
					/>
					{#if form?.titleInvalid}
						<span class="block text-error">a title is required</span>
					{/if}

					<label for="description" class="label">Short description of your entry</label>
					<textarea
						id="description"
						name="description"
						class="textarea textarea-bordered text-base w-full max-w-xs"
						maxlength="500"
						required
						bind:value={description}
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
						class="input input-bordered w-full max-w-xs"
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
			</form>
		{/if}
	{/if}
</article>

<style>
	label {
		margin-top: theme('margin.2');
	}
</style>
