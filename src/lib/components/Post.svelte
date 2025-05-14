<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDistanceToNow } from 'date-fns';
	import { Avatar, Button } from 'flowbite-svelte';
	import { HeartSolid } from 'flowbite-svelte-icons';
	import { tick } from 'svelte';

	let { id, userId, authorId, authorUsername, content, created, likes, replies } = $props();

	let isLiked = $state<boolean>(false);
	let optimisticLikes: number = $state(0);
	let hasOptimisticallyUpdated = $state(false); // Track if the user has clicked the like button
	let isLocked = $state(false); // Lock to prevent premature syncing

  $effect(() => {
		isLiked = likes.includes(userId); // Check if the user has liked the post
		optimisticLikes = likes.length; // Set the actual number of likes on mount
	});

  // Sync with parent data only if not locked and no optimistic update
	$effect(() => {
		if (!hasOptimisticallyUpdated && !isLocked && likes.length !== optimisticLikes) {
			optimisticLikes = likes.length; // Sync with actual likes only if no optimistic update and not locked
		}
	});

	// Toggle liked state and update the number of likes optimistically
	const toggleLiked = () => {
		isLiked = !isLiked;
		if (isLiked) {
			optimisticLikes += 1;
		} else {
			optimisticLikes = Math.max(optimisticLikes - 1, 0); // Ensure optimisticLikes doesn't go below 0
		}
		hasOptimisticallyUpdated = true; // Mark as updated optimistically
		isLocked = true; // Lock to prevent syncing with parent during submission
	};
</script>

<div class="flex items-center space-x-2">
	<Avatar />
	<div class="ml-2">
		<div class="flex items-center space-x-2">
			<h5 class="text-lg font-semibold text-gray-900 dark:text-white">
				{authorUsername}
			</h5>
			<span class="text-sm text-gray-500 dark:text-gray-400">
				{formatDistanceToNow(created)}
			</span>
		</div>
		<p class="py-2 font-thin">{content}</p>
		<div class="flex items-center space-x-2">
			<form
				action={`/guestbook?/likePost`}
				method="POST"
				use:enhance={() => {
					// Optimistically update the like count and liked state on click
					toggleLiked();

					// Return the function for form submission
					return async ({ result, update }) => {
						// Wait for the DOM and state to settle
						await update();

						if (result.type === 'failure') {
							// Roll back the optimistic update if the server response fails
							// toast.error('Failed to like the post.');
							toggleLiked(); // Roll back optimistic update
							hasOptimisticallyUpdated = false;
							isLocked = false; // Unlock after failure
						} else {
							// Wait for the DOM and reactivity system to fully update
							await tick();

							// Success: check if likes.length matches optimisticLikes
							if (likes.length !== optimisticLikes) {
								// Rollback if they don't match
								optimisticLikes = likes.length;
								// toast.error('Server count mismatch, rolling back.');
							} else {
								// toast.success(`${isLiked ? 'Liked' : 'Unliked'} post by @${postAuthor}`);
							}

							// Reset flags after handling the server response
							hasOptimisticallyUpdated = false; // Reset the optimistic update state
							isLocked = false; // Unlock after success
						}
					};
				}}
			>
        <input type="hidden" name="postId" value={id} />
        <input type="hidden" name="userId" value={userId} />
				<Button type="submit" size="xs" color="alternative" outline={true} pill={true}>
					<HeartSolid
						class={`h-4 w-4 
          ${isLiked ? 'text-orange-500' : ''}`}
						type="submit"
					/>
					<span class="text-sm text-gray-500 dark:text-gray-400">
						{optimisticLikes ?? 0}
					</span></Button
				>
			</form>

			<!-- <Button size="xs" color="alternative" outline={true} pill={true}>
        <MessagesSolid class="h-4 w-4" />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {replies.length}
        </span></Button
      > -->
		</div>
	</div>
</div>
