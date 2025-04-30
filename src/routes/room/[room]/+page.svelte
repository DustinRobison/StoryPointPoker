<script lang="ts">
	import { enhance } from '$app/forms';
	import { defaultStoryPointValues } from '$lib/data';
	import { Button, Card, Checkbox, Input, Label, Textarea } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
</script>

<div class="flex items-center justify-center">
	{#if !data.user?.name}
		<!-- User login component -->
		<div class="flex w-full justify-center">
			<Card size="lg" class="flex flex-col items-center justify-between">
				<form action="?/name" method="POST" use:enhance class="my-4 flex w-full flex-col items-center justify-center px-2">
					<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Please enter your name:
					</h5>
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
	{:else}
		<!-- Fade-in Card to center of the screen -->
		<div transition:fade={{ duration: 600 }} class="flex w-full justify-center">
			<Card size="lg" class="flex flex-col items-center justify-between">
				<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Welcome {data?.userName} to room {data?.roomName}:
				</h5>

				<div class="grid w-full grid-cols-1 py-4 md:grid-cols-2">
					<!-- COLUMN 1 LEFT -->
					<div class="flex flex-col p-4">
						<!-- TODO if host text area otherwise <p> -->
						<Textarea
							id="description"
							placeholder={`Description set by host ${data?.room?.host}`}
							rows={4}
							class="mb-4"
						/>

						<!-- Create rows of estimate buttons -->
						<div class="grid grid-cols-3 gap-4 py-4">
							{#each defaultStoryPointValues as value}
								<Button size="sm">{value}</Button>
							{/each}
						</div>
					</div>

					<!-- COLUMN 2 RIGHT -->
					<div class="flex flex-col p-4">
						<div class="grid grid-cols-2 justify-between">
							<p>Session:</p>
							<!-- TODO -->
							<p>0 Minutes</p>
							<p>Current:</p>
							<!-- TODO -->
							<p>0 Minutes</p>
						</div>

						<div class="my-4 flex space-x-2">
							<Button>Clear Votes</Button>
							<Button>Show Votes</Button>
						</div>
						<div class="flex space-x-2">
							<Checkbox />
							<p>Lock controls to room creator</p>
						</div>

						<hr class="" />

						<div class="flex justify-between">
							<!-- TODO -->
							<p>Average: ICON</p>

							<!-- TODO -->
							<p>Abstain: ICON</p>
						</div>

						<div class="my-4">
							<div class="grid grid-cols-2 gap-2">
								<!-- TODO -->
								<div class="flex space-x-1">
									<span>Ic</span>
									<span>NAME</span>
								</div>
								<span class="text-right">ACTION</span>

								<div class="flex space-x-1">
									<span>Ic</span>
									<span>NAME</span>
								</div>
								<span class="text-right">ACTION</span>

								<div class="flex space-x-1">
									<span>Ic</span>
									<span>NAME</span>
								</div>
								<span class="text-right">ACTION</span>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	{/if}
</div>
