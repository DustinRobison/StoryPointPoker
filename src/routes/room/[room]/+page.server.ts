import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    // Check if the user is authenticated
    const user = locals.user;

    // If the user does not have a name redirect to the profile page
    if (!user || !user.name) {
        return redirect(303, `/profile?room=${params.room}`);
    }
	return {
        user
    };
}) satisfies PageServerLoad;


export const actions = {
    
}