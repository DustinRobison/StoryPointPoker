<script lang="ts">
	import { defaultStoryPointValues } from '$lib/data';
	import { debounce } from '$lib/helpers.js';
	import { pb } from '$lib/pocketbase.js';
	import { toast } from '$lib/stores/toast.js';
	import { formatDistanceToNow, isAfter } from 'date-fns';
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

	interface User {
		id: string;
		name: string;
		avatar?: string;
		vote?: string;
		voteTime?: Date;
		updated?: string;
	}

	const { data } = $props();
	let isInitializing = $state(true);
	let roomDescription = $state(data.room.description || '');
	let timeElapsed = $state('');
	let roomData = $state(data.room);
	let roomBannedUsers = $derived(roomData.banned || []);
	let users = $state<User[]>(data.users);

	// Debounce function to limit the rate at which the description is updated
	const handleDebouncedInput = debounce(async (...args: unknown[]) => {
		const formData = new FormData();
		formData.append('description', args[0] as string);
		await fetch('?/' + 'description', {
			method: 'POST',
			body: formData
		});
	}, 600);

	const handleVoteClick = debounce(async (value) => {
		// Update public_users collection with the user's vote
		// call svelte action to update the user's vote in the room
		const formData = new FormData();
		formData.append('vote', value);
		await fetch('?/' + 'vote', {
			method: 'POST',
			body: formData
		});
	}, 200);

	const handleRestrictControls = debounce(async (e: unknown) => {
		// Update the room's restrictControl field based on the checkbox state
		const formData = new FormData();
		formData.append(
			'restrictControl',
			((e as Event)?.target as HTMLInputElement)?.checked?.toString()
		);
		await fetch('?/' + 'restrictControl', {
			method: 'POST',
			body: formData
		});
	}, 200);

	const handleClearVotes = debounce(async () => {
		const formData = new FormData();
		formData.append('clearVotes', 'true');
		await fetch('?/' + 'clearVotes', {
			method: 'POST',
			body: formData
		});
	}, 200);

	const handleShowVotes = debounce(async () => {
		const formData = new FormData();
		formData.append('showVotes', 'true');
		await fetch('?/' + 'showVotes', {
			method: 'POST',
			body: formData
		});
	}, 200);

	function updateTime() {
		timeElapsed = roomData?.created ? formatDistanceToNow(new Date(roomData.created)) : 'Unknown';
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
		// Get users votes
		const votes = users.map((user) => isAfter(new Date(user.voteTime), new Date(roomData.voteClear || roomData.created)) ? user.vote : "-");
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
		// Get users votes
		const abstainVotes = users.filter((user) => isNaN(parseInt(user.vote)) || isAfter(new Date(roomData.voteClear || roomData.created), new Date(user.voteTime)));
		// If no abstain votes, return 0
		if (abstainVotes.length === 0) {
			return 0;
		} 

		// const abstainVotes = Object.values(roomData?.votes || {}).filter((user) =>
		// 	isNaN(parseInt(user.vote))
		// );
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

	function hasVoted(vote: string, voteTime: string): boolean {
		return vote !== '-' && isAfter(new Date(voteTime), new Date(roomData.voteClear || roomData.created));
	}

	onMount(() => {
		let interval: ReturnType<typeof setInterval>;

		(async () => {
			// Subscribe to the room data
			pb.collection('rooms').subscribe(roomData.id, (e) => {
				if (e.action === 'update') {
					roomData = e.record;
				}
			});
			// Subscribe to all users_public where room equals roomData.id
			pb.collection('users_public').subscribe(
				'*',
				(e) => {
					if (e.action === 'create' || e.action === 'update') {
						// Update the users state with the new user data
						const updatedUser = {
							id: e.record.id,
							name: e.record.name,
							avatar: e.record.avatar || '',
							vote: e.record.vote || '-',
							voteTime: e.record.voteTime || roomData.created,
						};
						const existingUserIndex = users.findIndex((user) => user.id === updatedUser.id);
						if (existingUserIndex !== -1) {
							// Update existing user
							users[existingUserIndex] = updatedUser;
						} else {
							// Add new user and sort by name
							users = [...users, updatedUser].sort((a, b) => {
								const nameA = a.name || '';
								const nameB = b.name || '';
								return nameA.localeCompare(nameB);
							});
						}
					}
				},
				{
					filter: `room="${roomData.id}"`
				}
			);

			// Set the isInitializing state to false after the data is loaded
			isInitializing = false;

			// Update time every minute
			updateTime();
			interval = setInterval(() => {
				updateTime();
			}, 60000);
		})();

		return () => {
			pb.collection('rooms').unsubscribe('*');
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
							{#each users as user}
								<div class="flex items-center space-x-4">
									<div class="min-w-8">
										{#if roomData?.showVotes}
											{isAfter(new Date(user.voteTime), new Date(roomData.voteClear || roomData.created)) ? user.vote : '-'}
										{:else if hasVoted(user?.vote || '-', user?.voteTime)}
											<CheckCircleSolid class="h-6 w-6 text-green-500" />
										{:else}
											<ClockSolid class="h-6 w-6 text-gray-500" />
										{/if}
									</div>

									<div class="flex-1 text-sm font-medium text-gray-900 dark:text-white">
										{#if roomData?.owner === user.id}
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
									{#if roomData?.owner === data.user.id && roomData?.owner !== user.id}
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
								<Button size="sm" color="alternative" onclick={() => unbanUsers()}
									>Unban all users</Button
								>
							</div>
						{/if}
						<div></div>
					</div>
				</div>
			{/if}
		</Card>
	</div>
</div>
