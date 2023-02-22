<script lang="ts">
	export let datetime: string;
	export let time = true;

	const intl = new Intl.DateTimeFormat('en', {
		// weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: time ? 'numeric' : undefined,
		minute: time ? 'numeric' : undefined
	});
</script>

<time {datetime}>
	{intl.format(Date.parse(datetime))}
</time>
