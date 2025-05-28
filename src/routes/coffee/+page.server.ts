import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    // Get the pubilc stripe key
    const stripePublicKey = env.PUBLIC_STRIPE_KEY || process.env.PUBLIC_STRIPE_KEY;
    if (!stripePublicKey) {
        throw new Error('STRIPE_PUBLIC_KEY not set');
    }

    // Get Donators from the database
    const pbDonators = await locals.pb.collection('donators').getFullList(200 /* batch size */, {
        sort: '-created'
    });

    // Get donators from patreon
    


    return {
        stripePublicKey,
        donators: [
            ...pbDonators
        ]
    };
}) satisfies PageServerLoad;