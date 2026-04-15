import { env } from '$env/dynamic/public';
import process from 'node:process';
import type { PageServerLoad } from './$types';

/** Normalize values pasted from .env files (`'pk_live_...'` or `"pk_live_..."`). */
function normalizeEnvString(value: string | undefined): string {
	if (value == null) return '';
	let s = String(value).trim();
	if (
		(s.startsWith("'") && s.endsWith("'") && s.length >= 2) ||
		(s.startsWith('"') && s.endsWith('"') && s.length >= 2)
	) {
		s = s.slice(1, -1).trim();
	}
	return s;
}

/**
 * Stripe publishable keys must be available to SSR + the serverless function runtime.
 * Read from several places: SvelteKit public env, process.env, and Vite's import.meta.env
 * (build-time on Vercel). Also accept a couple of alternate names people configure by mistake.
 */
function readStripePublishableKey(): string {
	const metaEnv = (import.meta as unknown as { env?: Record<string, string | boolean | undefined> })
		.env;
	const candidates = [
		env.PUBLIC_STRIPE_KEY,
		process.env.PUBLIC_STRIPE_KEY,
		process.env['PUBLIC_STRIPE_KEY'],
		metaEnv?.PUBLIC_STRIPE_KEY,
		// Common alternate names (Stripe UI / other frameworks)
		process.env.STRIPE_PUBLISHABLE_KEY,
		process.env.STRIPE_PUBLIC_KEY
	];

	for (const raw of candidates) {
		if (raw === undefined || raw === null || typeof raw === 'boolean') continue;
		const s = normalizeEnvString(String(raw));
		// Real Stripe publishable keys are always pk_… (test or live)
		if (s.startsWith('pk_')) return s;
	}

	return '';
}

export const load = (async ({ locals }) => {
	const stripePublicKey = readStripePublishableKey();
	const stripeConfigured = Boolean(stripePublicKey);

	if (!stripeConfigured) {
		console.warn(
			'Stripe publishable key not found; set PUBLIC_STRIPE_KEY (pk_…) for Production on Vercel. Checkout disabled on /coffee.'
		);
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