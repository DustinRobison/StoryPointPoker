<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button, Card, Input, Label, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let isSubmitting = $state(false)

	const redirectTo = page.url.searchParams.get('redirectTo');

	onMount(() => {
		// Focus the input field when the component mounts
		const input = document.getElementById('name') as HTMLInputElement;
		if (input) {
			input.focus();
		}
	})
</script>

<div class="flex items-center justify-center">
	<!-- User login component -->
	<div class="flex w-full justify-center">
		<Card size="lg" class="flex flex-col items-center justify-between">
			<form
				action='?/name&redirectTo={redirectTo}'
				method="POST"
				class="my-4 flex w-full flex-col items-center justify-center px-2"
				use:enhance={({ cancel }) => {
					if (isSubmitting) return cancel();
					isSubmitting = true;

					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
				
			>
				<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Please enter your name:
				</h5>
				
				<div class="my-4 w-full">
					<Label for="name" class="mb-2 block">Name:</Label>
					<Input id="name" name="name" size="lg" placeholder="Dustin" required tabindex={0}/>
					<p class="ml-1 text-sm text-gray-500 dark:text-shadow-white">
						Some character restrictions apply
					</p>
				</div>

				<Button type="submit" class="mt-4 w-full" disabled={isSubmitting}>
					{#if isSubmitting}
						<Spinner class="mr-2" />
						{:else}
						<span>Submit</span>
					{/if}
				</Button>
			</form>
		</Card>
	</div>
</div>
