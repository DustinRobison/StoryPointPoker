<script lang="ts">
	import { enhance } from '$app/forms';
	import Post from '$lib/components/Post.svelte';
	import { Avatar, Button, Card, Heading, ImagePlaceholder, Input, Span } from 'flowbite-svelte';
	import { FireSolid, HeartSolid, PaperPlaneSolid, UserEditSolid } from 'flowbite-svelte-icons';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isLoading = $state(true);
	let isSubmitting = $state(false);
	let submitted = $state(false);
	let sortBy = $state('new');

	onMount(async () => {
		isLoading = false;
		await tick(); // Ensure the DOM is fully updated
	});
</script>

<div class="" transition:fade={{ duration: 300 }}>
	<Card class="min-w-full p-4 sm:p-6 md:p-8">
		<div id="header">
			<Heading class="font-extrabold"
				>Guest<Span class="font-semibold text-gray-600">book</Span></Heading
			>
		</div>

		<div id="new-post" class="my-8">
			{#if isLoading}
				<ImagePlaceholder class="h-6" />
			{:else}
				<div class="flex space-x-2">
					<!-- User block -->
					<Avatar />

					<form
						class="flex w-full items-center space-x-2"
						action="?/new"
						method="POST"
						use:enhance={({ cancel }) => {
							if (isSubmitting) return cancel();
							isSubmitting = true;

							return async ({ result, update }) => {
								if (result.type === 'success') {
									// TODO add toast
									submitted = true;
								}
								await update();
								isSubmitting = false;
							};
						}}
					>
						<!-- Hidden input honeypot -->
						<input type="text" name="honeypot" class="hidden" tabindex="-1" />

						<!-- Input post -->
						<Input
							name="content"
							type="text"
							placeholder="Write a message..."
							class="w-full"
							aria-label="Write a message..."
							aria-describedby="message"
						/>
						<Button
							type="submit"
							color="alternative"
							pill={true}
							outline={true}
							class="p-2!"
							size="xl"
						>
							<PaperPlaneSolid class="text-primary-700 h-6 w-6" />
						</Button>
					</form>
				</div>
			{/if}
		</div>

		<div id="metadata" class="mt-4 flex items-center justify-between">
			<!-- Posts count -->
			<div class="">
				<h5 class="text-lg font-semibold text-gray-900 dark:text-white">
					Posts: {data?.posts?.length || 0}
				</h5>
			</div>

			<!-- Buttons -->
			<div class="flex space-x-2">
				<Button color="alternative" pill={true} outline={true} class="p-2!" size="xl">
					<FireSolid class={`h-6 w-6 ${sortBy === 'new' ? 'text-orange-500' : ''}`} />
				</Button>
				<Button color="alternative" pill={true} outline={true} class="p-2!" size="xl">
					<HeartSolid class={`h-6 w-6 ${sortBy === 'likes' ? 'text-orange-500' : ''}`} />
				</Button>
				<Button color="alternative" pill={true} outline={true} class="p-2!" size="xl">
					<UserEditSolid class={`h-6 w-6 ${sortBy === 'mine' ? 'text-orange-500' : ''}`} />
				</Button>
			</div>
		</div>

		<!-- hr -->
		<hr class="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />

		{#if isLoading}
			{#each Array(3) as _}
				<div class="my-4 flex items-center space-x-2">
					<ImagePlaceholder class="w-full" />
				</div>
			{/each}
		{:else}
			<!-- Posts -->
			{#if data?.posts?.length > 0}
				{#each data.posts as post}
					<Post
						id={post.id}
						userId={data.user.public}
						authorId={post.authorId}
						authorUsername={post.authorName}
						content={post.content}
						created={new Date(post.created)}
						likes={post.likes}
						replies={post.replies}
					/>
				{/each}
			{:else}
				<p>No posts yet.</p>
			{/if}
		{/if}
	</Card>
</div>
