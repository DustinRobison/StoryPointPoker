import { createGuestBookPostSchema } from '$lib/form-schema';
import { validateData } from '$lib/utils';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define the custom error type
interface CustomError {
	status: number;
	message: string;
}

export const load = (async ({locals}) => {
    const user = locals.user;
    const posts = await locals.pb.collection('posts').getFullList({
        sort: "-created",
        expand: "author, likes",
        fields: 'content,created,expand.author.name,expand.likes.id,tags,replies'
    })
    
	return {
        user,
        posts
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
        )
        if (errors) {
            return fail(400, {
                data: formData,
                errors: errors.fieldErrors
            })
        }
        try {
            await locals.pb.collection('posts').create({
                author: user.id,
                content: formData.content,
                likes: 0,
                tags: [],
                replies: [],
            })
        } catch (err) {
            const customError = err as CustomError;
			console.log('Error: ', 'error creating post: ' + customError.message);
			throw error(customError.status, customError.message);
        }
		return { success: true };
	}
};
