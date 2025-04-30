import { defaultRoomValues } from '$lib/data.js';
import { roomNameSchema, urlSafeRegex } from '$lib/form-schema';
import { getAnonymousIdFromCookie } from '$lib/helpers.js';
import { pb } from '$lib/server/pocketbase.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(roomNameSchema));
	return { form };
};

export const actions = {
	room: async ({ request }) => {
		// extract anonymousId from cookie
		const anonymousId = getAnonymousIdFromCookie(request.headers.get('cookie'));
		if (!anonymousId) {
			return fail(400, { form: { error: 'Anonymous ID not found' } });
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
			console.log(`Creating room: ${roomName}`);
			const res = await pb.collection('rooms').create({
				...defaultRoomValues,
				roomName,
				ownerId: anonymousId,
				users: [
					{
						id: anonymousId,
						name: '',
						vote: ''
					}
				]
			});
			console.log(res);
		} else if (action === 'join') {
			// Join room logic here
			console.log(`Joining room: ${roomName}`);
		} else {
			// Invalid action
			return fail(400, { form: { error: 'Invalid action' } });
		}

		return redirect(303, `/room/${roomName}`);
	}
};
