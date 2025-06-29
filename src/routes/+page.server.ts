import { defaultRoomValues } from '$lib/data.js';
import { urlSafeRegex } from '$lib/form-schema';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// Load posts
	const userPublic = await locals.pb.collection('users_public').getOne(locals.user?.public);
	const posts = await locals.pb.collection('posts').getList(1, 20, {
		expand: 'author',
		sort: '-created',
		fields: 'id,expand.author.name,expand.author.avatar,created,updated,likes,content'
	});
	const announcements = await locals.pb.collection('announcements').getList(1, 20)

	const userPublicTransformed = {
		id: userPublic?.id || '',
		avatar: userPublic?.avatar || '',
		name: userPublic?.name || '',
		email: locals.user?.email || '',
	}

	const transformedPosts = posts.items.map((post) => ({
		id: post.id,
		created: post.created,
		updated: post.updated,
		content: post.content,
		likes: post.likes.length,
		author: post?.expand?.author?.name,
		avatar: post?.expand?.author?.avatar,
	}));

	return { userPublic: userPublicTransformed, posts: transformedPosts, announcements: announcements.items };
};

export const actions = {
	room: async ({ request, locals }) => {
		const pb = locals.pb;
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
		const roomName = (data.get('roomName') as string).toLowerCase().trim();

		// Validate roomName
		const valid = roomName.length >= 4 && roomName.length <= 20 && urlSafeRegex.test(roomName);

		// Throw error if invalid
		if (!valid) {
			return fail(400, { form: { error: 'Invalid room name' } });
		}
		if (action === 'create') {
			// Check if room already exists
			try {
				await pb.collection('rooms').getOne(`name="${roomName}"`);
				return redirect(303, `/room/${roomName}`);
			} catch (error) {
				if ((error as { status?: number }).status === 404) {
					// Room does not exist, proceed to create
				}
			}

			// Create room logic here
			await pb.collection('rooms').create({
				...defaultRoomValues,
				name: roomName,
				owner: user.public,
				votes: {}
			});
		}

		// Get name from users_public collection
		try {
			const userPublic = await pb.collection('users_public').getOne(user.public);
			if (!userPublic.name) {
				return redirect(303, `/profile?redirectTo=/room/${roomName}`);
			}
		} catch (error) {
			if ((error as { status?: number }).status === 404) {
				console.warn('user public not found');
			}
		}

		return redirect(303, `/room/${roomName}`);
	}
};
