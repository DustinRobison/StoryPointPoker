<script lang="ts">
  import { page } from '$app/state';
  import { Button, Card } from 'flowbite-svelte';
  import { fade } from 'svelte/transition';
</script>



<div class="flex gap-4" transition:fade={{ duration: 300 }}>
	<Card class="w-1/2">
		<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Error:</h5>
		<p>{page.error.message}</p>

		<div class="mt-4 flex items-center space-x-5">
			<Button href="/" size="lg" class="mt-4">Go back to the homepage</Button>
		</div>
	</Card>
</div>