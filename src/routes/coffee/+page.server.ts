import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    // Get Donators from the database
    const pbDonators = await locals.pb.collection('donators').getFullList(200 /* batch size */, {
        sort: '-created'
    });

    // Get donators from patreon



    return {
        donators: [
            ...pbDonators
        ]
    };
}) satisfies PageServerLoad;