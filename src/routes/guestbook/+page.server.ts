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
	const posts = await locals.pb.collection('posts').getFullList({
		sort: '-created',
		fields: 'id,content,created,author,likes,tags,replies'
	});
	const usersPublic = await locals.pb.collection('users_public').getFullList()



	// Limit data sent to client via transformation
	const transformedPosts = posts.map((post) => ({
		authorId: post.author,
		content: post.content,
		created: post.created,
		id: post.id,
		authorName: usersPublic?.find(usr => usr.id === post.author).name || "Anonymous",
		likes: post.likes || [],
		tags: post.tags,
		replies: post.replies,
	}));
	
	return {
		user,
		posts: transformedPosts
	};
}) satisfies PageServerLoad;

export const actions = {
	new: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { formData, errors } = await validateData(
			await request.formData(),
			createGuestBookPostSchema
		);
		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		try {
			await locals.pb.collection('posts').create({
				author: user.public,
				content: formData.content,
				tags: [],
				replies: []
			});
		} catch (err) {
			const customError = err as CustomError;
			console.error('Error: ', 'error creating post: ' + customError.message);
			throw error(customError.status, customError.message);
		}
		return { success: true };
	},

    
    likePost: async ({ request, locals }) => {
        const { user } = locals;
        if (!user) {
            return fail(401, { message: 'Unauthorized' });
        }
		try {
			const { formData } = await validateData(await request.formData(), likeGuestBookPostSchema);
			const post = await locals.pb.collection('posts').getOne(formData.postId, { expand: 'likes' });

			const userIndex = post.likes.indexOf(user.public);
			if (userIndex !== -1) {
				post.likes.splice(userIndex, 1);
			} else {
				post.likes.push(user.public);
			}

			try {
				await locals.pb.collection('posts').update(post.id, { likes: post.likes });
			} catch (err) {
				const customError = err as CustomError;
				console.error('Error: ', 'error liking/unliking post: ' + customError.message);
				throw error(customError.status, customError.message);
			}
			// Fetch the updated post
			const updatedPost = await locals.pb
				.collection('posts')
				.getOne(formData.postId, { expand: 'likes' });

			return {
				success: true,
				post: updatedPost
			};
		} catch (err) {
			console.error('Error processing likePost:', err);
			throw error(500, 'An unknown error occurred');
		}
	},
};
