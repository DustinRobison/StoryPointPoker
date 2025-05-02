<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button, Card, Input, Label } from 'flowbite-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex items-center justify-center">
	<!-- User login component -->
	<div class="flex w-full justify-center">
		<Card size="lg" class="flex flex-col items-center justify-between">
			<form
				action="?/name"
				method="POST"
				use:enhance
				class="my-4 flex w-full flex-col items-center justify-center px-2"
			>
				<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Please enter your name:
				</h5>
				<input type="hidden" name="roomName" value={$page.url.searchParams.get('room') || ""} />
				<div class="my-4 w-full">
					<Label for="name" class="mb-2 block">Name:</Label>
					<Input id="name" name="name" size="lg" placeholder="Dustin" required />
					<p class="ml-1 text-sm text-gray-500 dark:text-shadow-white">
						Some character restrictions apply
					</p>
				</div>

				<Button type="submit" class="mt-4 w-full">Next</Button>
			</form>
		</Card>
	</div>
</div>
