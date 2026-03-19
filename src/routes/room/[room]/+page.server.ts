import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { mapRoom, mapUserPublic } from '$lib/supabase-mappers';

export const load = (async ({ locals, params }) => {
	const userId = locals.user?.id;
	if (!userId) return error(401, 'Unauthorized');

	const roomName = (params.room ?? '').toLowerCase().trim();

	// Get user public data
	const { data: userPublicRow } = await locals.supabase
		.from('users_public')
		.select('id,name,avatar,vote,vote_time,room,created,updated')
		.eq('id', userId)
		.single();

	if (!userPublicRow || !userPublicRow.name) {
		return redirect(303, `/profile?redirectTo=/room/${roomName}`);
	}
	const userPublic = mapUserPublic(userPublicRow as any);

	// Query room by name
	const { data: roomRow } = await locals.supabase
		.from('rooms')
		.select('*')
		.eq('name', roomName)
		.maybeSingle();

	if (!roomRow) return error(404, `Room ${roomName} not found`);
	const room = mapRoom(roomRow as any);

	// Check if the user is banned from the room
	const bannedUsers = room.banned ?? [];
	if (bannedUsers.includes(userPublic.id)) {
		return error(403, 'You are banned from this room');
	}

	// Set this user's room and reset vote window
	await locals.supabase
		.from('users_public')
		.update({ room: room.id, vote: '-' })
		.eq('id', userPublic.id);

	// Get all users in the room
	const { data: usersRows } = await locals.supabase
		.from('users_public')
		.select('id,name,avatar,vote,vote_time,updated')
		.eq('room', room.id)
		.order('name', { ascending: false });

	const users = (usersRows ?? []).map((u) => mapUserPublic(u as any));

	return {
		userId,
		user: userPublic,
		room,
		users
	};
}) satisfies PageServerLoad;

export const actions = {
	vote: async ({ request, locals }) => {
		const data = await request.formData();
		const vote = data.get('vote');
		const userId = locals.user?.id;
		if (!userId) return error(401, 'Unauthorized');

		await locals.supabase
			.from('users_public')
			.update({ vote: String(vote), vote_time: new Date().toISOString() })
			.eq('id', userId);

		return { success: true };
	},
	description: async ({ request, locals, params }) => {
		const data = await request.formData();
		const description = data.get('description');
		const userId = locals.user?.id;
		if (!userId) return error(401, 'Unauthorized');

		const roomName = (params.room ?? '').toLowerCase().trim();
		const { data: roomRow } = await locals.supabase
			.from('rooms')
			.select('id,owner')
			.eq('name', roomName)
			.maybeSingle();

		if (!roomRow) return error(404, `Room ${roomName} not found`);
		if (roomRow.owner !== userId) return error(403, 'You are not the owner of this room');

		await locals.supabase.from('rooms').update({ description }).eq('id', roomRow.id);
		return { success: true };
	},
	restrictControl: async ({ request, locals, params }) => {
		const data = await request.formData();
		const restrictControl = data.get('restrictControl') === 'true';
		const userId = locals.user?.id;
		if (!userId) return error(401, 'Unauthorized');

		const roomName = (params.room ?? '').toLowerCase().trim();
		const { data: roomRow } = await locals.supabase
			.from('rooms')
			.select('id,owner')
			.eq('name', roomName)
			.maybeSingle();

		if (!roomRow) return error(404, `Room ${roomName} not found`);
		if (roomRow.owner !== userId) return error(403, 'You are not the owner of this room');

		await locals.supabase
			.from('rooms')
			.update({ restrict_control: restrictControl })
			.eq('id', roomRow.id);

		return { success: true };
	},
	showVotes: async ({ request, locals, params }) => {
		const data = await request.formData();
		const showVotes = data.get('showVotes') === 'true';
		const userId = locals.user?.id;
		if (!userId) return error(401, 'Unauthorized');

		const roomName = (params.room ?? '').toLowerCase().trim();
		const { data: roomRow } = await locals.supabase
			.from('rooms')
			.select('id,owner,restrict_control')
			.eq('name', roomName)
			.maybeSingle();

		if (!roomRow) return error(404, `Room ${roomName} not found`);
		if (roomRow.restrict_control && roomRow.owner !== userId) {
			return error(403, 'You are not the owner of this room');
		}

		await locals.supabase.from('rooms').update({ show_votes: showVotes }).eq('id', roomRow.id);
		return { success: true };
	},
	clearVotes: async ({ request, locals, params }) => {
		const data = await request.formData();
		const clearVotes = data.get('clearVotes') === 'true';
		const userId = locals.user?.id;
		if (!userId) return error(401, 'Unauthorized');

		const roomName = (params.room ?? '').toLowerCase().trim();
		const { data: roomRow } = await locals.supabase
			.from('rooms')
			.select('id,owner,restrict_control')
			.eq('name', roomName)
			.maybeSingle();

		if (!roomRow) return error(404, `Room ${roomName} not found`);
		if (roomRow.restrict_control && roomRow.owner !== userId) {
			return error(403, 'You are not the owner of this room');
		}

		if (!clearVotes) return error(400, 'Invalid request to clear votes');

		await locals.supabase.from('rooms').update({
			vote_clear: new Date().toISOString(),
			show_votes: false
		}).eq('id', roomRow.id);

		return { success: true };
	}
};
