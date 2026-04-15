import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const stripePublicKey = (env.PUBLIC_STRIPE_KEY || process.env.PUBLIC_STRIPE_KEY || '').trim();
	const stripeConfigured = Boolean(stripePublicKey);

	if (!stripeConfigured) {
		console.warn('PUBLIC_STRIPE_KEY is not set; Stripe checkout will be disabled on /coffee');
	}

	// Featured donators feed (donators list is not shown on this page; avoid selecting reserved column "user" here)
	const { data: featuredDonators, error: featuredError } = await locals.supabase
		.from('featured_donators')
		.select('id,name,link,rank,created,updated')
		.order('rank', { ascending: false })
		.limit(10);

	if (featuredError) {
		console.error('featured_donators load error:', featuredError.message);
	}

	return {
		stripePublicKey,
		stripeConfigured,
		featuredDonators: featuredDonators ?? []
	};
}) satisfies PageServerLoad;