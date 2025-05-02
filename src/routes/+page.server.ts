import { defaultRoomValues } from '$lib/data.js';
import { urlSafeRegex } from '$lib/form-schema';
import { pb } from '$lib/pocketbase.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	return { user: locals.user };
};

export const actions = {
	room: async ({ request, locals }) => {
		// get user
		const user = locals.user;
		if (!user) {
			return fail(401, { form: { error: 'Unauthorized' } });
		}
		// extract form data
		const data = await request.formData();

		// Check honeypot
		const honeypot = data.get('honeypot');
		if (honeypot) {
			return fail(400, { form: { error: 'Honeypot triggered' } });
		}
		// Validate form data
		const action = data.get('action') as string;
		const roomName = data.get('roomName') as string;

		// Validate roomName
		const valid = roomName.length >= 4 && roomName.length <= 20 && urlSafeRegex.test(roomName);

		// Throw error if invalid
		if (!valid) {
			return fail(400, { form: { error: 'Invalid room name' } });
		}
		if (action === 'create') {
			// Create room logic here
			await pb.collection('rooms').create({
				...defaultRoomValues,
				roomName,
				ownerId: user.id,
				users: {
					[user.id]: {
						name: user.name || '',
						vote: '-'
					}
				}
			});
		}

		if (!user.name) {
			return redirect(303, `/profile?room=${roomName}`);
		}
		return redirect(303, `/room/${roomName}`);
	}
};
