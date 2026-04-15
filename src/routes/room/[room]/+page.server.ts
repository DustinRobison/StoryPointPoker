import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	mapRoom,
	mapUserPublic,
	type RoomRow,
	type UserPublicRow
} from '$lib/supabase-mappers';

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
	const userPublic = mapUserPublic(userPublicRow as UserPublicRow);

	// Query room by name
	const { data: roomRow } = await locals.supabase
		.from('rooms')
		.select('*')
		.eq('name', roomName)
		.maybeSingle();

	if (!roomRow) return error(404, `Room ${roomName} not found`);
	const room = mapRoom(roomRow as RoomRow);

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

	const users = (usersRows ?? []).map((u) => mapUserPublic(u as UserPublicRow));

	return {
		userId,
		user: userPublic,
		room,
		users
	};
}) satisfies PageServerLoad;

function mapVoteControlRpcError(
	roomName: string,
	rpcError: { message?: string; details?: string; hint?: string; code?: string }
) {
	const msg = [rpcError.message, rpcError.details, rpcError.hint].filter(Boolean).join(' ');
	// PostgREST: function not in schema cache or not created
	if (rpcError.code === '42883' || /function .* does not exist/i.test(msg)) {
		return error(
			500,
			'Vote action failed: run the room_clear_votes / room_show_votes SQL in Supabase, then in Dashboard → Settings → API click "Reload schema" (or restart the project).'
		);
	}
	if (msg.includes('Room not found')) return error(404, `Room ${roomName} not found`);
	if (msg.includes('Unauthorized')) return error(401, 'Unauthorized');
	if (msg.includes('controls are locked')) {
		return error(403, 'You are not the owner of this room');
	}
	return error(500, msg || 'Failed to update room');
}

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
			.select('id')
			.eq('name', roomName)
			.maybeSingle();

		if (!roomRow) return error(404, `Room ${roomName} not found`);

		const { error: rpcError } = await locals.supabase.rpc('room_show_votes', {
			p_room_id: roomRow.id,
			p_show: showVotes
		});
		if (rpcError) return mapVoteControlRpcError(roomName, rpcError);

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
			.select('id')
			.eq('name', roomName)
			.maybeSingle();

		if (!roomRow) return error(404, `Room ${roomName} not found`);
		if (!clearVotes) return error(400, 'Invalid request to clear votes');

		const { error: rpcError } = await locals.supabase.rpc('room_clear_votes', {
			p_room_id: roomRow.id
		});
		if (rpcError) return mapVoteControlRpcError(roomName, rpcError);

		return { success: true };
	}
};
