<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="flex gap-4" transition:fade={{ duration: 300 }}>
	<Card class="w-1/2">
		<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Thank you!</h5>
		<p>Thank you for your donation! Your support means a lot to me.</p>

		<div class="mt-4 flex items-center space-x-5">
			<Button href="/" size="lg" class="mt-4">Go back to the homepage</Button>
			<Button href="/coffee" size="lg" class="mt-4">Make another donation</Button>
		</div>
	</Card>
</div>
