import { createGuestBookPostSchema, likeGuestBookPostSchema } from '$lib/form-schema';
import { validateData } from '$lib/utils';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define the custom error type
interface CustomError {
	status: number;
	message: string;
}

export const load = (async ({ locals }) => {
	const user = locals.user;

	const { data: posts } = await locals.supabase
		.from('posts')
		.select('id,content,created,author,likes,tags,replies')
		.order('created', { ascending: false });

	const authorIds = Array.from(
		new Set((posts ?? []).map((p) => p.author).filter((id): id is string => Boolean(id)))
	);

	const { data: usersPublic } = authorIds.length
		? await locals.supabase.from('users_public').select('id,name').in('id', authorIds)
		: { data: [] };

	const nameMap = new Map((usersPublic ?? []).map((u) => [u.id, u.name]));

	// Limit data sent to client via transformation
	const transformedPosts = (posts ?? []).map((post) => ({
		authorId: post.author,
		content: post.content,
		created: post.created,
		id: post.id,
		authorName: post.author ? nameMap.get(post.author) || 'Anonymous' : 'Anonymous',
		likes: post.likes ?? [],
		tags: post.tags,
		replies: post.replies
	}));

	return { user, posts: transformedPosts };
}) satisfies PageServerLoad;

export const actions = {
	new: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) return fail(401, { message: 'Unauthorized' });

		const { formData, errors } = await validateData(await request.formData(), createGuestBookPostSchema);
		if (errors) {
			return fail(400, { data: formData, errors: errors.fieldErrors });
		}

		try {
			await locals.supabase.from('posts').insert({
				author: user.id,
				content: formData.content,
				tags: [],
				replies: []
			});
		} catch (err) {
			const customError = err as CustomError;
			console.error('Error: error creating post:', customError.message);
			throw error(customError.status, customError.message);
		}

		return { success: true };
	},

	likePost: async ({ request, locals }) => {
		try {
			const { formData } = await validateData(await request.formData(), likeGuestBookPostSchema);

			const { data: post } = await locals.supabase
				.from('posts')
				.select('id,content,created,author,likes,tags,replies')
				.eq('id', formData.postId)
				.single();

			if (!post) return fail(404, { message: 'Post not found' });

			const likes = (post.likes ?? []) as string[];
			const userId = formData.currentUserId;
			const hasLiked = likes.includes(userId);
			const nextLikes = hasLiked
				? likes.filter((id: string) => id !== userId)
				: [...likes, userId];

			await locals.supabase.from('posts').update({ likes: nextLikes }).eq('id', formData.postId);

			const { data: updatedPost } = await locals.supabase
				.from('posts')
				.select('id,content,created,author,likes,tags,replies')
				.eq('id', formData.postId)
				.single();

			return { success: true, post: updatedPost };
		} catch (err) {
			console.error('Error processing likePost:', err);
			throw error(500, 'An unknown error occurred');
		}
	}
};
