import { defaultRoomValues } from '$lib/data.js';
import { urlSafeRegex } from '$lib/form-schema';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) return { userPublic: null, posts: [], announcements: [] };

	// Load current user's public profile
	const { data: userPublic } = await locals.supabase
		.from('users_public')
		.select('id,name,avatar')
		.eq('id', userId)
		.single();

	// Load posts (then resolve author display info with a second query)
	const { data: posts } = await locals.supabase
		.from('posts')
		.select('id,created,updated,content,likes,author')
		.order('created', { ascending: false })
		.limit(20);

	const authorIds = Array.from(
		new Set((posts ?? []).map((p) => p.author).filter((id): id is string => Boolean(id)))
	);

	const { data: authors } = authorIds.length
		? await locals.supabase.from('users_public').select('id,name,avatar').in('id', authorIds)
		: { data: [] };

	const authorMap = new Map((authors ?? []).map((a) => [a.id, a]));

	const transformedPosts = (posts ?? []).map((post) => ({
		id: post.id,
		created: post.created,
		updated: post.updated,
		content: post.content,
		likes: post.likes?.length ?? 0,
		author: post.author ? authorMap.get(post.author)?.name : null,
		avatar: post.author ? authorMap.get(post.author)?.avatar : null
	}));

	// Load announcements (optional in UI, but kept for compatibility)
	const { data: announcements } = await locals.supabase
		.from('announcements')
		.select('id,author,content,created,updated')
		.order('created', { ascending: false })
		.limit(20);

	return {
		userPublic: {
			id: userPublic?.id || '',
			avatar: userPublic?.avatar || '',
			name: userPublic?.name || ''
		},
		posts: transformedPosts,
		announcements: announcements ?? []
	};
};

export const actions = {
	room: async ({ request, locals }) => {
		let userId = locals.user?.id;

		// If the SSR session didn't initialize (common during local testing),
		// create an anonymous Supabase session on-demand so the action can proceed.
		if (!userId) {
			try {
				const { data, error } = await locals.supabase.auth.signInAnonymously();
				if (error) {
					console.error('Supabase anon signIn (action) error:', error);
				}
				userId = data.user?.id ?? data.session?.user?.id ?? undefined;
				if (!userId) {
					console.warn('Supabase anon signIn (action) returned no user/session userId');
					console.warn('Supabase anon signIn (action) payload:', {
						hasUser: Boolean(data.user),
						hasSession: Boolean(data.session),
						userId: data.user?.id ?? data.session?.user?.id,
						error: error ? String((error as any).message ?? error) : null
					});
				}
			} catch (e) {
				console.error('Supabase anon sign-in failed in homepage action:', e);
				// Fall through to unauthorized below.
			}
		}

		if (!userId) return fail(401, { form: { error: 'Unauthorized' } });

		// extract form data
		const data = await request.formData();

		// Check honeypot
		const honeypot = data.get('honeypot');
		if (honeypot) {
			return fail(400, { form: { error: 'Honeypot triggered' } });
		}

		// Validate form data
		const action = data.get('action') as string;
		const roomName = (data.get('roomName') as string).toLowerCase().trim();

		// Validate roomName
		const valid = roomName.length >= 4 && roomName.length <= 20 && urlSafeRegex.test(roomName);
		if (!valid) return fail(400, { form: { error: 'Invalid room name' } });

		if (action === 'create') {
			// Check if room already exists
			const { data: existingRoom } = await locals.supabase
				.from('rooms')
				.select('id')
				.eq('name', roomName)
				.maybeSingle();

			if (existingRoom) return redirect(303, `/room/${roomName}`);

			// Create room logic here
			await locals.supabase.from('rooms').insert({
				name: roomName,
				description: defaultRoomValues.description,
				restrict_control: defaultRoomValues.restrictControl,
				show_votes: defaultRoomValues.showVotes,
				owner: userId,
				vote_clear: new Date().toISOString()
			});
		}

		// Get name from users_public collection
		const { data: userPublic } = await locals.supabase
			.from('users_public')
			.select('id,name')
			.eq('id', userId)
			.single();

		if (!userPublic?.name) {
			return redirect(303, `/profile?redirectTo=/room/${roomName}`);
		}

		return redirect(303, `/room/${roomName}`);
	}
};
