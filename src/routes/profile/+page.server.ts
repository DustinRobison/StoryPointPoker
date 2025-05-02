import { urlSafeRegex } from '$lib/form-schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	name: async ({ request, params, locals }) => {
		// extract anonymousId from cookie
		const user = locals.user;
		if (!user) {
			return fail(400, { form: { error: 'Anonymous ID not found' } });
		}

		// extract form data
		const data = await request.formData();
		const username = (data.get('name') as string) || '';
		const roomName = (data.get('roomName') as string) || '';

		// Validate username
		const valid = username.length > 1 && username.length < 20 && urlSafeRegex.test(username);
		if (!valid) {
			return fail(400, { form: { error: 'Invalid username' } });
		}

		// Update the user name in pocketbase user table
		const updatedUser = await locals.pb.collection('users').update(user.id, {
			name: username
		});
		if (roomName) {
			// Get the room data from pocketbase
			const roomData = await locals.pb
				.collection('rooms')
				.getFirstListItem(`roomName="${roomName}"`);
			if (!roomData) {
				return fail(400, { form: { error: 'Room not found' } });
			}

			const roomUsers = roomData.users;
			// Check if the user is already in the room
			const userInRoom = roomUsers[user.id];
			if (userInRoom) {
				// Update the user name in the room
				const res = await locals.pb.collection('rooms').update(roomData.id, {
					users: {
						...roomUsers,
						[user.id]: {
							name: username,
							vote: userInRoom.vote
						}
					}
				});
			} else {
				// Add the user to the room
				await locals.pb.collection('rooms').update(roomData.id, {
					users: {
						...roomUsers,
						[user.id]: {
							name: username,
							vote: '-'
						}
					}
				});
			}
			redirect(303, `/room/${roomData.roomName}`);
		}

		return {
			user: updatedUser
		}
	}
} satisfies Actions;
