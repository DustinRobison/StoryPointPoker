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
    

    // Get featured donators from the database
    const featuredDonators = await locals.pb.collection('featured_donators').getFullList( 10, {
		sort: '-rank',
	});


    return {
        stripePublicKey,
        donators: [
            ...pbDonators
        ],
        featuredDonators
    };
}) satisfies PageServerLoad;