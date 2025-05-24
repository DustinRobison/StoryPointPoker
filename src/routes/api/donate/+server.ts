import { env } from '$env/dynamic/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import process from 'process';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

if (import.meta.env.MODE === 'development') {
	console.log('Running in development mode');
} else {
	console.log('Running in production mode');
}

export const POST: RequestHandler = async ({ request }) => {
	const { amount } = await request.json();
	const stripeSecretKey = env.SECRET_STRIPE_KEY || process.env.SECRET_STRIPE_KEY;
	if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY not set');
  }
	const stripe = new Stripe(stripeSecretKey);

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Donation'
						},
						unit_amount: amount * 100 // Stripe amount is in cents
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${PUBLIC_BASE_URL}/coffee/success`,
			cancel_url: `${PUBLIC_BASE_URL}/coffee/cancel`
		});

		return new Response(JSON.stringify({ sessionId: session.id }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Error creating Stripe session:', err);
		return new Response(JSON.stringify({ error: 'Failed to create Stripe session' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
