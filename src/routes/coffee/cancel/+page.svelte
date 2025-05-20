<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="flex gap-4" transition:fade={{ duration: 300 }}>
	<Card class="w-1/2">
		<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Donate:</h5>
		<p>It looks like your payment was cancelled. If this was a mistake, you can try again.</p>

		<div class="mt-4 flex items-center space-x-5">
			<Button href="/" size="lg" class="mt-4">Go back to the homepage</Button>

			<Button href="/coffee" size="lg" class="mt-4">Try again</Button>
		</div>
	</Card>
</div>
