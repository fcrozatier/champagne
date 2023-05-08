<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<article class="layout-prose">
	<h2>Send a message to the mailing list</h2>

	<form
		use:enhance={({ submitter }) => {
			submitter?.setAttribute('disabled', 'on');

			return async ({ update }) => {
				await update();
			};
		}}
	>
		<div class="form-control">
			<label for="message" class="label">
				<span class="label-text">Choose a message to send</span>
			</label>
		</div>
		<button class="btn-error btn">Send message to all recipients of the mailing list</button>
		{#if $page.status !== 200}
			<p class="text-error">Something went wrong</p>
		{/if}
	</form>
</article>
