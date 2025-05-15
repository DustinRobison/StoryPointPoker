<!-- src/routes/+page.svelte -->
<script lang="ts">
	import LandingFeed from '$lib/components/LandingFeed.svelte';
	import { urlSafeRegex } from '$lib/form-schema.js';
	import { debounce } from '$lib/helpers.js';
	import { Button, Card, Input, Label } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();

	let roomName = $state<string>('');
	let buttonText = $state('Create Room');
	let loading = $state(false);
	let valid = $state(false);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value.toLowerCase();
		if (urlSafeRegex.test(value)) {
			roomName = value;
		} else {
			// Revert to last valid searchTerm if invalid
			target.value = roomName;
		}
	}

	const handleDebouncedInput = debounce(async (inputName) => {
		valid =
			typeof inputName === 'string' &&
			urlSafeRegex.test(inputName) &&
			inputName.length > 3 &&
			inputName.length < 20;
		if (!valid) {
			return;
		}
		loading = true;
		let roomExists = false;
		// Make an api call to check if the room exists
		try {
			const response = await fetch(`/api/room/${roomName}`);
			if (response.ok) {
				const data = await response.json();
				roomExists = data.exists;
			} else {
				console.error('Error fetching room data:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching room data:', error);
		} finally {
			if (roomExists) {
				buttonText = 'Join Room';
			} else {
				buttonText = 'Create Room';
			}
			loading = false;
		}
	}, 300);

	$effect(() => {
		handleDebouncedInput(roomName);
	});
</script>

<div transition:fade={{ duration: 300 }} class="my-12">
	<!-- Fade-in Card to center of the screen -->
	<div class="flex w-full justify-center">
		<Card size="lg" class="flex flex-col items-center justify-between">
			<h5
				class="w-full text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
			>
				Create or join a room:
			</h5>
			<form action="?/room" method="POST" class="w-full">
				<!-- Hidden honeypot field -->
				<input
					type="text"
					name="honeypot"
					class="hidden"
					autocomplete="off"
					tabindex="-2"
					aria-hidden="true"
				/>
				<!-- Hidden bound field for "create" or "join" -->
				<input
					name="action"
					type="text"
					class="hidden"
					autocomplete="off"
					tabindex="-1"
					aria-hidden="true"
					value={buttonText === 'Join Room' ? 'join' : 'create'}
				/>

				<div class="mb-6 w-full">
					<Label for="roomName" class="mb-2 block">Room name:</Label>
					<Input
						id="roomName"
						size="lg"
						name="roomName"
						placeholder="my_team_name"
						oninput={handleInput}
						required
						autocomplete="off"
					/>
					<p class="text-sm">Room name can only contain letters, numbers, and -._~</p>
				</div>

				<Button class="mt-6 w-full" type="submit" disabled={loading || !valid}
					>{loading ? 'Loading...' : buttonText}</Button
				>
			</form>
		</Card>
	</div>

	<div class="my-8">
		<LandingFeed announcements={data.announcements} guestbook={data.posts} />
	</div>
</div>
