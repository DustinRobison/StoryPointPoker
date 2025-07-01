import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	let room;
	// Check if the user is authenticated
	const user = locals.user;
	if (!user) {
		return error(401, 'Unauthorized');
	}

    let userPublic
	try {
		// Get user public data
		userPublic = await locals.pb.collection('users_public').getOne(user.public);
		// If the user does not exist or is missing a name redirect to the profile page
		if (!userPublic || !userPublic.name) {
			return redirect(303, `/profile?redirectTo=/room/${params.room}`);
		}
	} catch (err) {
		return redirect(303, `/profile?redirectTo=/room/${params.room}`);
	}

	//  Query pocketbase for room by name
	try {
		room = await locals.pb.collection('rooms').getFirstListItem(`name="${params.room}"`);
	} catch {
		return error(404, `Room ${params.room} not found`);
	}

	const bannedUsers = room.banned || [];
	// Check if the user is banned from the room
	if (bannedUsers.includes(userPublic.id)) {
		return error(403, 'You are banned from this room');
	}

	// Set this user's room
	await locals.pb.collection('users_public').update(userPublic.id, {
		room: room.id,
		vote: '-'
	});

	// Get all users in the room
	const users = await locals.pb.collection('users_public').getFullList({
		fields: 'id,name,avatar,vote,voteTime,updated',
		filter: `room="${room.id}"`,
		order: '-name'
	});

	return {
		userId: user.id,
		user: userPublic,
		room: room,
		users: users
	};
}) satisfies PageServerLoad;

export const actions = {
	vote: async ({ request, locals, params }) => {
		const data = await request.formData();
		const vote = data.get('vote');
		const userId = locals.user?.public;

		// Update the user's vote in PocketBase
		await locals.pb.collection('users_public').update(userId, {
			vote: vote,
			voteTime: new Date().toISOString()
		});

		return { success: true };
	},
	description: async ({ request, locals, params }) => {
		const data = await request.formData();
		const description = data.get('description');
		const userId = locals.user?.public;

		// validate user is the room owner
		const room = await locals.pb.collection('rooms').getFirstListItem(`name="${params.room}"`);
		if (room.owner !== userId) {
			return error(403, 'You are not the owner of this room');
		}

		// Update the room's description in PocketBase
		await locals.pb.collection('rooms').update(room.id, {
			description: description
		});

		return { success: true };
	},
	restrictControl: async ({ request, locals, params }) => {
		const data = await request.formData();
		const restrictControl = data.get('restrictControl') === 'true';
		const userId = locals.user?.public;

		// validate user is the room owner
		const room = await locals.pb.collection('rooms').getFirstListItem(`name="${params.room}"`);
		if (room.owner !== userId) {
			return error(403, 'You are not the owner of this room');
		}

		// Update the room's restrictControl in PocketBase
		await locals.pb.collection('rooms').update(room.id, {
			restrictControl: restrictControl
		});

		return { success: true };
	},
	showVotes: async ({ request, locals, params }) => {
		const data = await request.formData();
		const showVotes = data.get('showVotes') === 'true';
		const userId = locals.user?.public;

		// validate user is the room owner
		const room = await locals.pb.collection('rooms').getFirstListItem(`name="${params.room}"`);
		if (room.restrictControl && room.owner !== userId) {
			return error(403, 'You are not the owner of this room');
		}

		// Update the room's showVotes in PocketBase
		await locals.pb.collection('rooms').update(room.id, {
			showVotes: showVotes
		});
	},
	clearVotes: async ({ request, locals, params }) => {
		const data = await request.formData();
		const clearVotes = data.get('clearVotes') === 'true';
		const userId = locals.user?.public;

		// validate user is the room owner or room is unrestricted
		const room = await locals.pb.collection('rooms').getFirstListItem(`name="${params.room}"`);
		if (room.restrictControl && room.owner !== userId) {
			return error(403, 'You are not the owner of this room');
		}

		if (!clearVotes) {
			return error(400, 'Invalid request to clear votes');
		}
		// Clear all votes in the room by setting new voteClear datetime
		await locals.pb.collection('rooms').update(room.id, {
			voteClear: new Date().toISOString(),
			showVotes: false // Optionally hide votes after clearing
		});
		return { success: true };
	}
};
