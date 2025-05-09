<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDistanceToNow } from 'date-fns';
	import { Avatar, Button, Card, Heading, Input, Span } from 'flowbite-svelte';
	import {
		FireSolid,
		HeartSolid,
		MessagesSolid,
		PaperPlaneSolid,
		UserEditSolid
	} from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let isSubmitting = $state(false);
	let submitted = $state(false);
	let sortBy = $state('new');
</script>

<div class="" transition:fade={{ duration: 300 }}>
	<Card class="min-w-full p-4 sm:p-6 md:p-8">
		<div id="header">
			<Heading class="font-extrabold"
				>Guest<Span class="font-semibold text-gray-600">book</Span></Heading
			>
		</div>

		<div id="new-post" class="my-8">
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

		<!-- Posts -->
		{#if data?.posts?.length > 0}
			{#each data.posts as post}
				<div class="flex items-center space-x-2">
					<Avatar />
					<div class="ml-2">
						<div class="flex items-center space-x-2">
							<h5 class="text-lg font-semibold text-gray-900 dark:text-white">
								{post?.expand?.author?.name}
							</h5>
							<span class="text-sm text-gray-500 dark:text-gray-400">
								{formatDistanceToNow(new Date(post.created))}
							</span>
						</div>
						<p class="py-2 font-thin">{post.content}</p>
						<div class="flex items-center space-x-2">
							<Button size="xs" color="alternative" outline={true} pill={true}>
								<HeartSolid
									class={`h-4 w-4 
									${post.expand.likes?.some(like => like.id === data?.user?.id) ? 'text-orange-500' : ''}`}
								/>
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{post.expand.likes?.length || 0}
								</span></Button
							>

							<Button size="xs" color="alternative" outline={true} pill={true}>
								<MessagesSolid class="h-4 w-4" />
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{post.replies?.length || 0}
								</span></Button
							>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<p>No posts yet.</p>
		{/if}
	</Card>
</div>
