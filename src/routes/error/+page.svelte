<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let roomName: string | null = null;
	let countdown = 5; // Countdown timer in seconds

	// Extract the roomName from the query parameters
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		roomName = urlParams.get('roomName');

		// Start the countdown timer
		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(interval);
				goto('/'); // Redirect to the homepage
			}
		}, 1000);

		return () => clearInterval(interval); // Cleanup interval on component destroy
	});
</script>

<div class="flex items-center justify-center">
	<!-- Fade-in Card to center of the screen -->
	<div transition:fade={{ duration: 600 }} class="flex w-full justify-center">
		<Card
			class="flex min-h-screen flex-col items-center justify-center text-gray-900 dark:text-white"
		>
			<h1 class="mb-4 text-4xl font-bold">404: Room Not Found</h1>
			<p class="mb-4 text-lg">
				{#if roomName}
					The room "<span class="font-semibold">{roomName}</span>" does not exist.
				{:else}
					The requested room could not be found.
				{/if}
			</p>
			<p class="mb-8 text-sm">You will be redirected to the homepage in {countdown} seconds...</p>
			<Button size="lg" onclick={() => goto('/')}>Go to Homepage Now</Button>
		</Card>
	</div>
</div>
