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
	export let date: string;
</script>

<time datetime={date}>
	{intl.format(Date.parse(date))}
</time>
