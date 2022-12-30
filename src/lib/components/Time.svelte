<script context="module">
	const intl = new Intl.DateTimeFormat('en', {
		// weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	});
</script>

<script lang="ts">
	export let datetime: string;
</script>

<time {datetime}>
	{intl.format(Date.parse(datetime))}
</time>
