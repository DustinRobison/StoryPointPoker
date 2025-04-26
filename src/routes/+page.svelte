<!-- src/routes/+page.svelte -->
<script>
	import { Button, Card, Input, Label } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	let buttonText = $state('Create Room');
	let buttonDisabled = $state(true);
</script>

<div class="flex my-12 items-center justify-center">
	<!-- Fade-in Card to center of the screen -->
	<div transition:fade={{ duration: 600 }} class="flex w-full justify-center">
		<Card size="lg" class="flex flex-col items-center justify-between">
			<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Create or join a room:
			</h5>

			<form class="mt-8 w-full px-2">
				<div class="mb-6">
					<Label for="large-input" class="mb-2 block">Room name:</Label>
					<Input id="large-input" size="lg" placeholder="secret_room_12" />
					<p class="text-sm text-gray-500 dark:text-shadow-white">
						Some character restrictions apply
					</p>
				</div>

				<Button class="mt-6 w-full" disabled={buttonDisabled}>{buttonText}</Button>
			</form>
		</Card>
	</div>
</div>

<!-- Sponsors TODO -->
<div>
	<h6>Big thanks to the following Sponsors:</h6>
	<p>https://github.com/codyaverett</p>
</div>
