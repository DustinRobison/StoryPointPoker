<script lang="ts">
	import { defaultStoryPointValues } from '$lib/data';
	import { debounce } from '$lib/helpers.js';
	import { supabase } from '$lib/supabase';
	import { toast } from '$lib/stores/toast.js';
	import { formatDistanceToNow, isAfter } from 'date-fns';
	import {
		mapRoom,
		mapUserPublic,
		type MappedRoom,
		type MappedUserPublic,
		type RoomRow,
		type UserPublicRow
	} from '$lib/supabase-mappers';
	import {
		Button,
		Card,
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
	// Supabase returns snake_case + nullable fields; treat this as dynamic data.
	// The runtime logic below already guards where needed.
	let roomData = $state<MappedRoom>(data.room);
	let roomBannedUsers = $derived(roomData.banned || []);
	let users = $state<MappedUserPublic[]>(data.users);
	let lockControls = $state(data.room.restrictControl === true);
	/** While saving lock preference, ignore realtime rows that still have the old restrict_control. */
	let lockRestrictSaveInFlight = false;

	// Debounce function to limit the rate at which the description is updated
	const handleDebouncedInput = debounce(async (...args: unknown[]) => {
		const formData = new FormData();
		formData.append('description', args[0] as string);
		await fetch('?/' + 'description', {
			method: 'POST',
			body: formData,
			// Ensure Supabase auth cookies are included (Safari sometimes drops them for fetches).
			credentials: 'include'
		});
	}, 600);

	async function submitVote(value: string | number) {
		const self = users.find((u) => u.id === data.user.id);
		const snapshot = self ? { ...self } : null;
		const now = new Date().toISOString();
		const v = String(value);
		users = users.map((u) =>
			u.id === data.user.id ? { ...u, vote: v, voteTime: now, vote_time: now } : u
		);
		const formData = new FormData();
		formData.append('vote', v);
		const res = await fetch('?/' + 'vote', {
			method: 'POST',
			body: formData,
			credentials: 'include'
		});
		if (!res.ok && snapshot) {
			users = users.map((u) => (u.id === data.user.id ? snapshot : u));
		}
	}

	async function persistLockControls() {
		const checked = lockControls;
		lockRestrictSaveInFlight = true;
		roomData = { ...roomData, restrictControl: checked, restrict_control: checked };
		const formData = new FormData();
		formData.append('restrictControl', String(checked));
		try {
			const res = await fetch('?/' + 'restrictControl', {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});
			if (!res.ok) {
				lockControls = !checked;
				roomData = { ...roomData, restrictControl: !checked, restrict_control: !checked };
			}
		} finally {
			lockRestrictSaveInFlight = false;
		}
	}

	async function submitClearVotes() {
		const snapshot = { ...roomData };
		const now = new Date().toISOString();
		roomData = {
			...roomData,
			voteClear: now,
			vote_clear: now,
			showVotes: false,
			show_votes: false
		};
		const formData = new FormData();
		formData.append('clearVotes', 'true');
		const res = await fetch('?/' + 'clearVotes', {
			method: 'POST',
			body: formData,
			credentials: 'include'
		});
		if (!res.ok) {
			roomData = snapshot;
		}
	}

	async function submitShowVotes() {
		const snapshot = { ...roomData };
		roomData = { ...roomData, showVotes: true, show_votes: true };
		const formData = new FormData();
		formData.append('showVotes', 'true');
		const res = await fetch('?/' + 'showVotes', {
			method: 'POST',
			body: formData,
			credentials: 'include'
		});
		if (!res.ok) {
			roomData = snapshot;
		}
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
		const windowDate = voteWindowDate();
		const votes = users.map((user) => {
			if (!user.voteTime) return '-';
			const voted = isAfter(new Date(user.voteTime), windowDate);
			return voted ? (user.vote ?? '-') : '-';
		});
		// Filter out non-numeric votes
		const numericVotes = votes.filter((vote) => vote !== '-' && !isNaN(parseInt(vote)));
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
		const windowDate = voteWindowDate();
		const abstainVotes = users.filter((user) => {
			const vote = user.vote ?? '-';
			if (!user.voteTime) return true;
			return isNaN(parseInt(vote)) || isAfter(windowDate, new Date(user.voteTime));
		});
		// If no abstain votes, return 0
		if (abstainVotes.length === 0) {
			return 0;
		} 

		// const abstainVotes = Object.values(roomData?.votes || {}).filter((user) =>
		// 	isNaN(parseInt(user.vote))
		// );
		return abstainVotes.length;
	}

	async function kickUser(userId: string) {
		if (roomData?.owner === data.user.id && roomData?.id) {
			const nextBanned = Array.from(new Set([...(roomData.banned || []), userId]));
			// Optimistic UI update; realtime subscription should also confirm.
			roomData = { ...roomData, banned: nextBanned };
			await supabase.from('rooms').update({ banned: nextBanned }).eq('id', roomData.id);
		}
	}

	async function unbanUsers() {
		if (roomData?.owner === data.user.id && roomData?.id) {
			roomData = { ...roomData, banned: [] };
			await supabase.from('rooms').update({ banned: [] }).eq('id', roomData.id);
		}
	}

	function voteWindowDate(): Date {
		const t = roomData.voteClear ?? roomData.created;
		return t ? new Date(t) : new Date(0);
	}

	function hasVoted(vote: string, voteTime?: string | null): boolean {
		if (vote === '-' || !voteTime) return false;
		return isAfter(new Date(voteTime), voteWindowDate());
	}

	onMount(() => {
		let roomChannel: ReturnType<typeof supabase.channel> | null = null;
		let usersChannel: ReturnType<typeof supabase.channel> | null = null;

		(async () => {
			// Subscribe to room updates
			roomChannel = supabase
				.channel(`room:${roomData.id}`)
				.on(
					'postgres_changes',
					{ event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomData.id}` },
					(payload: { new: RoomRow }) => {
						if (!payload.new) return;
						const next = mapRoom(payload.new);
						if (lockRestrictSaveInFlight) {
							roomData = {
								...next,
								restrictControl: lockControls,
								restrict_control: lockControls
							};
						} else {
							roomData = next;
							if (next.owner === data.user.id) {
								lockControls = next.restrictControl === true;
							}
						}
					}
				)
				.subscribe();

			// Subscribe to user updates for the current room
			usersChannel = supabase
				.channel(`room-users:${roomData.id}`)
				.on(
					'postgres_changes',
					{
						event: '*',
						schema: 'public',
						table: 'users_public',
						filter: `room=eq.${roomData.id}`
					},
					(payload: { new: UserPublicRow }) => {
						if (!payload.new) return;
						const updatedUser = mapUserPublic(payload.new);
						const existingUserIndex = users.findIndex((u) => u.id === updatedUser.id);
						if (existingUserIndex !== -1) {
							users = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
						} else {
							users = [...users, updatedUser].sort((a, b) =>
								(a.name ?? '').localeCompare(b.name ?? '')
							);
						}
					}
				)
				.subscribe();

			// Set the isInitializing state to false after the data is loaded
			isInitializing = false;
		})();

		return () => {
			if (roomChannel) supabase.removeChannel(roomChannel);
			if (usersChannel) supabase.removeChannel(usersChannel);
		};
	});

	$effect(() => {
		// Only the owner may update description server-side; avoid 403 spam for other participants.
		if (roomData?.owner !== data.user.id) return;
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
								placeholder="Text that will update for all users in the room"
								value={roomData?.description ?? ''}
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
							{#each defaultStoryPointValues as value (value)}
								<Button size="sm" onclick={() => submitVote(value)}>{value}</Button>
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
								disabled={roomData?.restrictControl === true && data.user.id !== roomData.owner}
								onclick={() => submitClearVotes()}>Clear Votes</Button
							>
							<Button
								disabled={roomData?.restrictControl === true && data.user.id !== roomData.owner}
								onclick={() => submitShowVotes()}>Show Votes</Button
							>
						</div>
						{#if roomData?.owner === data.user.id}
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
									bind:checked={lockControls}
									onchange={() => persistLockControls()}
								/>
								<span class="text-sm text-gray-900 dark:text-white"
									>Lock controls to room creator</span
								>
							</label>
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
							{#each users as user (user.id)}
								<div class="flex items-center space-x-4">
									<div class="min-w-8">
										{#if roomData?.showVotes}
											{isAfter(new Date(user.voteTime ?? 0), voteWindowDate()) ? user.vote : '-'}
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
