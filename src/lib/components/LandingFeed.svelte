<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';
	import { Button } from 'flowbite-svelte';
	import Marquee from './Marquee.svelte';
	import NoteCard from './NoteCard.svelte';

	const { announcements, guestbook } = $props();
</script>

<div
	class="bg-background relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border py-12 md:shadow-xl border-gray-200"
>
	<h3 class=" my-4 text-lg font-bold dark:text-white">Announcements</h3>
	<Marquee pauseOnHover class="[--duration:20s]">
		{#each announcements as announcement}
			<NoteCard
				title={announcement.name}
				subtitle={formatDistanceToNow(announcement.created)}
				avatar="/images/avatar.jpg"
				body={announcement.content}
			/>
		{/each}
	</Marquee>

	<h3 class="my-4 text-lg font-bold dark:text-white">
		<Button href="/guestbook" color="alternative" outline>Guestbook</Button>
	</h3>
	<Marquee reverse pauseOnHover class="[--duration:20s]">
		{#each guestbook as post}
			<NoteCard
				title={post.author}
				subtitle={formatDistanceToNow(post.created)}
				avatar={post.avatar}
				body={post.content}
			/>
		{/each}
	</Marquee>
</div>
