<script lang="ts">
	import { PUBLIC_COMPETITION_NAME } from '$env/static/public';
	import Time from '$lib/components/Time.svelte';
</script>

<svelte:head>
	<title>Privacy policy &middot; {PUBLIC_COMPETITION_NAME}</title>
</svelte:head>

<article class="layout-prose">
	<h2>Data protection</h2>
	<p>
		We respect your data. This privacy policy lists the data we collect and explains how we use it
		when you navigate on the champagne website.
	</p>

	<h3>Collected Data</h3>

	<p>We collect email information when you register as a creator or judge.</p>
	<p>
		This information is used for the voting system and to send your vote link. It is stored on our
		database for the duration of the competition. Once the competition is over we will delete your
		data.
	</p>
	<p>We do not sell any of your data nor use it for marketing campaigns.</p>
	<p>
		You can access, modify or delete any of your data by emailing us at <a
			href="mailto:3b1b.some@gmail.com"
		>
			3b1b.some@gmail.com</a
		>
	</p>
	<h3>Cookies</h3>
	<p>
		We use a cookie to keep you logged in, so that the voting system recognizes you. This is the
		only cookie we use and is required for the vote functionality.
	</p>
	<p>We do not use nor install third party cookies (e.g advertisement, tracking etc.).</p>

	<p class="text-right text-sm italic">Last update <Time datetime="2023-02-22" time={false} /></p>
</article>
