import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    // Get the pubilc stripe key
    const stripePublicKey = env.PUBLIC_STRIPE_KEY || process.env.PUBLIC_STRIPE_KEY;
    if (!stripePublicKey) {
        throw new Error('STRIPE_PUBLIC_KEY not set');
    }

    // Get donators from the database (used on success page / future UI)
    const { data: donators } = await locals.supabase
		.from('donators')
		.select('id,user,amount,stripe_id,created,updated')
		.order('created', { ascending: false })
		.limit(200);

	// Featured donators feed
	const { data: featuredDonators } = await locals.supabase
		.from('featured_donators')
		.select('id,name,link,rank,created,updated')
		.order('rank', { ascending: false })
		.limit(10);

    return {
        stripePublicKey,
        donators: donators ?? [],
        featuredDonators: featuredDonators ?? []
    };
}) satisfies PageServerLoad;