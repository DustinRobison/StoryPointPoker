import { env } from '$env/dynamic/private';
import { getPocketbaseAdmin } from '$lib/pocketbase.server';
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
			// Store the donation record in PocketBase with server admin privileges
			const adminPb = await getPocketbaseAdmin();
			// Only insert if stripeId is not already present
			const existingRecord = await adminPb
				.collection('donators')
				.getFirstListItem(`stripeId="${sessionId}"`);
			if (existingRecord) {
				console.warn('Donation record already exists for this session ID:', sessionId);
				return {
					status: 'paid',
					amount: session.amount_total ? session.amount_total / 100 : 0,
					customerEmail: session.customer_details?.email
				};
			}
			await adminPb.collection('donators').create({
				user: locals?.user?.id,
				amount: session.amount_total ? session.amount_total / 100 : 0,
				stripeId: sessionId
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
