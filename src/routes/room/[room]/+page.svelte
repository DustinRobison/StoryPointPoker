<script lang="ts">
	import { defaultStoryPointValues } from '$lib/data';
	import { debounce } from '$lib/helpers.js';
	import { pb } from '$lib/pocketbase.js';
	import { toast } from '$lib/stores/toast.js';
	import { formatDistanceToNow } from 'date-fns';
	import {
		Button,
		Card,
		Checkbox,
		ListPlaceholder,
		Skeleton,
		Textarea,
		TextPlaceholder,
		Tooltip
	} from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		ClockSolid,
		FileCopySolid,
		StarSolid,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let isInitializing = $state(true);
	let roomDescription = $state(data.room.description || '');
	let timeElapsed = $state('');
	let roomData = $state(data.room);
	let roomBannedUsers = $derived(roomData.banned || []);
	let userList = $derived(getUserList(roomData.votes, roomData?.owner || ''));

	// Debounce function to limit the rate at which the description is updated
	const handleDebouncedInput = debounce(async (...args: unknown[]) => {
		const inputDescription = args[0] as string;
		if (roomData?.owner === data.user.id) {
			roomDescription = inputDescription;
			await pb.collection('rooms').update(roomData.id, { description: roomDescription });
		}
	}, 600);

	const handleVoteClick = debounce(async (value) => {
		// Update the vote in db for user by id
		if (roomData?.id)
			await pb.collection('rooms').update(roomData.id, {
				votes: {
					...roomData?.votes,
					[data.user.id]: {
						...roomData?.votes[data.user.id],
						vote: value
					}
				}
			});
	}, 200);

	const handleRestrictControls = debounce(async (e: unknown) => {
		const target = (e as Event).target as HTMLInputElement;
		if (roomData?.id) {
			await pb.collection('rooms').update(roomData.id, {
				restrictControl: target.checked
			});
		}
	}, 200);

	const handleClearVotes = debounce(async () => {
		if (roomData?.id) {
			const newUsers: Record<string, { name: string; avatar: string; vote: string }> = {};
			for (const userId in roomData?.votes) {
				newUsers[userId] = {
					name: roomData?.votes[userId].name,
					avatar: roomData?.votes[userId].avatar,
					vote: '-'
				};
			}
			await pb.collection('rooms').update(roomData.id, {
				votes: newUsers,
				showVotes: false
			});
		}
	}, 200);

	const handleShowVotes = debounce(async () => {
		if (roomData?.id) {
			await pb.collection('rooms').update(roomData.id, {
				showVotes: true
			});
		}
	}, 200);

	function updateTime() {
		timeElapsed = roomData?.created ? formatDistanceToNow(new Date(roomData.created)) : 'Unknown';
	}

	// Transform the votes object into a list of users
	// with their names and votes
	// The first user is the host, the second user is the current user (if they are not the host)
	function getUserList(users: Record<string, { name: string; vote: string }>, owner: string) {
		let tempUserList: { name: string; vote: string; id: string }[] = [];

		// check if users is empty
		if (!users || Object.keys(users).length === 0) {
			return tempUserList;
		}

		// The first user is the host
		const roomHost = users[owner];
		tempUserList.push({
			name: roomHost?.name || '',
			vote: roomHost?.vote || '-',
			id: owner || ''
		});

		// The second user is the current user (if they are not the host)
		if (data.user.id !== roomData?.owner) {
			const currentRoomUser = users[data.user.id];
			tempUserList.push({
				name: currentRoomUser?.name,
				vote: currentRoomUser?.vote,
				id: data.user.id
			});
		}

		// The rest of the users are the other users
		for (const publicUserId in users) {
			if (
				(publicUserId !== roomData?.owner && publicUserId !== data.user.id) ||
				roomBannedUsers.includes(publicUserId)
			) {
				const user = users[publicUserId];
				if (!user || !user.name) continue;
				tempUserList.push({
					name: user.name,
					vote: user.vote,
					id: publicUserId
				});
			}
		}
		return tempUserList;
	}

	function copyRoomLink() {
		const roomLink = `${window.location.origin}/room/${data.room.name}`;
		navigator.clipboard.writeText(roomLink);
		toast.set({
			show: true,
			message: 'Room link copied to clipboard',
			type: 'success',
			icon: 'check'
		});
		setTimeout(() => {
			toast.set({
				show: false,
				message: '',
				type: '',
				icon: ''
			});
		}, 2000);
	}

	function calculateAverageVotes() {
		const votes = Object.values(roomData?.votes || {}).map((user) => user.vote);
		// Filter out non-numeric votes
		const numericVotes = votes.filter((vote) => !isNaN(parseInt(vote)));
		if (numericVotes.length === 0) {
			return '--';
		}
		// Calculate the average of numeric votes
		const totalVotes = numericVotes.reduce((acc, vote) => acc + parseInt(vote), 0);
		const average = totalVotes / numericVotes.length;
		return average.toFixed(2);
	}

	function calculateAbstainVotes() {
		const abstainVotes = Object.values(roomData?.votes || {}).filter((user) =>
			isNaN(parseInt(user.vote))
		);
		return abstainVotes.length;
	}

	function kickUser(userId: string) {
		if (roomData?.owner === data.user.id && roomData?.id) {
			const updatedVotes = { ...roomData.votes };
			delete updatedVotes[userId];
			pb.collection('rooms').update(roomData.id, {
				votes: updatedVotes,
				banned: [...roomData.banned, userId]
			});
		}
	}

	function unbanUsers() {
		if (roomData?.owner === data.user.id && roomData?.id) {
			pb.collection('rooms').update(roomData.id, {
				banned: []
			});
			roomBannedUsers = [];
		}
	}

	onMount(() => {
		let interval: ReturnType<typeof setInterval>;

		(async () => {
			// Create room subscription
			pb.collection('rooms').subscribe(roomData.id, (e) => {
				if (e.action === 'update') {
					roomData = e.record;
				}
			});

			// Set the isInitializing state to false after the data is loaded
			isInitializing = false;
			userList = getUserList(roomData.votes, roomData.owner);

			// Update time every minute
			updateTime();
			interval = setInterval(() => {
				updateTime();
			}, 60000);
		})();

		return () => {
			if (roomData?.id) {
				// Unsubscribe from the room data when the component is destroyed
				pb.collection('rooms').unsubscribe(roomData.id);
			}
			clearInterval(interval);
		};
	});

	$effect(() => {
		handleDebouncedInput(roomDescription);
	});

	$effect(() => {
		if (roomBannedUsers.includes(data.user.id)) {
			throw new Error('You have been banned from this room');
		}
	});
</script>

<div class="flex items-center justify-center">
	<!-- Fade-in Card to center of the screen -->
	<div transition:fade={{ duration: 300 }} class="flex w-full justify-center">
		<Card size="lg" class="flex min-h-80 flex-col items-center justify-between">
			{#if isInitializing}
				<!-- LOADING SKELETON -->
				<Skeleton size="lg" class="my-8 w-full text-center" />
				<div class="grid w-full grid-cols-1 py-4 md:grid-cols-2">
					<!-- COLUMN 1 LEFT LOADING SKELETON -->
					<div class="flex flex-col p-4">
						<TextPlaceholder size="md" class="mb-4" />
					</div>

					<!-- COLUMN 2 RIGHT LOADING SKELETON -->
					<div class="p-4">
						<ListPlaceholder class="mb-4 w-full" />
					</div>
				</div>
			{:else}
				<div class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Welcome {data.user.name} to room <Button
						color="alternative"
						class="mx-2 text-xl font-bold"
						onclick={copyRoomLink}><FileCopySolid class="mr-2" /> {roomData?.name}</Button
					>
				</div>

				<div class="grid w-full grid-cols-1 py-4 md:grid-cols-2">
					<!-- COLUMN 1 LEFT -->
					<div class="flex flex-col p-4">
						<!-- TODO if host text area otherwise <p> -->
						{#if roomData?.owner === data.user.id}
							<Textarea
								id="description"
								placeholder={`Text that will update for all users in the room`}
								value={roomData?.description}
								oninput={(e) => (roomDescription = (e.target as HTMLTextAreaElement).value)}
								rows={4}
								class="mb-4"
							/>
						{:else}
							<p class="mb-4 min-h-12">
								{roomData?.description}
							</p>
						{/if}

						<!-- Create rows of estimate buttons -->
						<div class="grid grid-cols-3 gap-4 py-4">
							{#each defaultStoryPointValues as value}
								<Button size="sm" onclick={() => handleVoteClick(value)}>{value}</Button>
							{/each}
						</div>
					</div>

					<!-- COLUMN 2 RIGHT -->
					<div class="flex flex-col p-4">
						<div class="grid grid-cols-2 justify-between">
							<p>Session:</p>
							<p>
								{roomData?.created ? formatDistanceToNow(new Date(roomData.created)) : 'Unknown'}
							</p>
							<!-- TODO -->
							<!-- <p>Current:</p>
							<p>0 Minutes</p> -->
						</div>

						<div class="my-4 flex space-x-2">
							<Button
								disabled={roomData?.restrictControl && data.user.id !== roomData.owner}
								onclick={() => handleClearVotes()}>Clear Votes</Button
							>
							<Button
								disabled={roomData?.restrictControl && data.user.id !== roomData.owner}
								onclick={() => handleShowVotes()}>Show Votes</Button
							>
						</div>
						{#if roomData?.owner === data.user.id}
							<div class="flex space-x-2">
								<Checkbox onchange={(e) => handleRestrictControls(e)} />
								<p>Lock controls to room creator</p>
							</div>
						{/if}

						<hr class="" />

						<div class="my-4 flex justify-between">
							<div class="flex space-x-4">
								<span class="mr-4">Average:</span>
								{#if roomData?.showVotes}
									<span class="h-6 w-6 font-bold text-black dark:text-white"
										>{calculateAverageVotes()}</span
									>
								{:else}
									<ClockSolid class="h-6 w-6 text-gray-500" />
								{/if}
							</div>

							<div class="flex space-x-4">
								<span class="mr-4">Abstain:</span>
								{#if roomData?.showVotes}
									<span class="h-6 w-6 font-bold text-black dark:text-white"
										>{calculateAbstainVotes()}</span
									>
								{:else}
									<ClockSolid class="h-6 w-6 text-gray-500" />
								{/if}
							</div>
						</div>

						<div class="my-4">
							{#each userList as user, idx}
								<div class="flex items-center space-x-4">
									<div class="min-w-8">
										{#if roomData?.showVotes}
											{user.vote}
										{:else if user.vote === '-'}
											<ClockSolid class="h-6 w-6 text-gray-500" />
										{:else}
											<CheckCircleSolid class="h-6 w-6 text-green-500" />
										{/if}
									</div>

									<div class="flex-1 text-sm font-medium text-gray-900 dark:text-white">
										{#if idx === 0}
											<!-- User is host, show a star -->
											<span class="flex space-x-1 align-middle"
												>{user.name}<StarSolid id="host-star" /><Tooltip triggeredBy="#host-star"
													>Room Creator</Tooltip
												></span
											>
										{:else}
											{user.name}
										{/if}
									</div>

									<!-- Show kick icon if is host -->
									{#if roomData?.owner === data.user.id && idx !== 0}
										<div class="flex items-center">
											<TrashBinSolid
												class="h-6 w-6 hover:text-red-500"
												onclick={() => kickUser(user.id)}
											/>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						{#if roomBannedUsers.length > 0}
							<hr class="my-4" />
							<div class="text-red-500">
								<p class="font-bold">Banned Users: {roomBannedUsers.length}</p>
								<Button size="sm" onclick={() => unbanUsers()}>Unban all users</Button>
							</div>
						{/if}
						<div></div>
					</div>
				</div>
			{/if}
		</Card>
	</div>
</div>
