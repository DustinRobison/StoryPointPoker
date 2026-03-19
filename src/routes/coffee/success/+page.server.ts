import { env } from '$env/dynamic/private';
import { supabaseServiceRole } from '$lib/supabase.server';
import { redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const sessionId = url.searchParams.get('session_id');

	if (!sessionId) {
		return {
			status: 'error',
			message: 'No session ID provided'
		};
	}

	const stripeSecretKey = env.SECRET_STRIPE_KEY || process.env.SECRET_STRIPE_KEY;
	if (!stripeSecretKey) {
		throw new Error('STRIPE_SECRET_KEY not set');
	}

	const stripe = new Stripe(stripeSecretKey);

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// if session.payment_status is 'paid' store a database record
		if (session.payment_status !== 'paid') {
			return redirect(303, '/coffee/cancel');
		}

		try {
			// Insert donation record in Supabase using service role (bypasses RLS)
			const { data: existingRecord } = await supabaseServiceRole
				.from('donators')
				.select('id')
				.eq('stripe_id', sessionId)
				.maybeSingle();

			if (existingRecord) {
				console.warn('Donation record already exists for this session ID:', sessionId);
				return {
					status: 'paid',
					amount: session.amount_total ? session.amount_total / 100 : 0,
					customerEmail: session.customer_details?.email
				};
			}

			await supabaseServiceRole.from('donators').insert({
				user: locals.user?.id ?? null,
				amount: session.amount_total ? session.amount_total / 100 : 0,
				stripe_id: sessionId
			});
		} catch (error) {
			console.warn('Error storing donation record:', error);
		}
		return {
			status: session.payment_status, // 'paid' if successful
			amount: session.amount_total ? session.amount_total / 100 : 0,
			customerEmail: session.customer_details?.email
		};
	} catch (error) {
		console.error('Error retrieving session:', error);
		return {
			status: 'error',
			message: 'Failed to retrieve payment information'
		};
	}
};
