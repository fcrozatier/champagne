<article>
	<h2>Register for the competition</h2>
	<p>
		We need some details about your entry to register your participation. When your are successfully
		registered we will send you a confirmation email with your link for the voting phase.
	</p>
	<form method="post">
		<label for="email" class="label">Email</label>
		<input
			id="email"
			type="email"
			name="email"
			placeholder="john@gmail.com"
			class="input input-bordered w-full max-w-xs"
			required
		/>

		<label for="type" class="label"> Type of entry </label>
		<select id="type" name="type" class="select select-bordered w-full max-w-xs" required>
			<option>Video</option>
			<option>Non video</option>
		</select>

		<label for="link" class="label">Link to your entry</label>
		<input
			id="link"
			type="url"
			name="link"
			placeholder="https://"
			class="input input-bordered w-full max-w-xs"
			required
		/>

		<label for="rules" class="label flex gap-2">
			<input id="rules" type="checkbox" name="rules" class="checkbox" required />
			<span class="flex-1"> I've read the <a href="/rules">rules</a> of the competition </span>
		</label>

		<p>
			<button class="btn block">Register</button>
			<a href="/">Back to main page</a>
		</p>
	</form>
</article>
