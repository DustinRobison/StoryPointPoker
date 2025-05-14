import { userNameSchema } from '$lib/form-schema';
import { validateData } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	name: async ({ request, locals }) => {
		const pb = locals.pb;
		// extract anonymousId from cookie
		const user = locals.user;
		if (!user) {
			return fail(400, { form: { error: 'Anonymous ID not found' } });
		}

		const { formData, errors } = await validateData(
			await request.formData(),
			userNameSchema
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		// Update the user name in pocketbase user table
		await pb.collection('users_public').update(user.public, {
			name: formData.name
		});

		// get url search param redirectTo
		const url = new URL(request.url);
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(303, redirectTo);
		} else {
			return {
				success: true,
				message: 'Username updated successfully'
			}
		}
	}
} satisfies Actions;
