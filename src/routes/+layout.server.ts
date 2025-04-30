import { dev } from '$app/environment';
import { pb } from '$lib/server/pocketbase';

export async function load({ cookies }) {
	const userId = cookies.get('pb_auth');
	const anonymousId = cookies.get('anonymousId');

	if (!userId && !anonymousId) {
		try {
			// Create a new anonymous user in PocketBase
			const res = await pb.collection('users').create({
				is_anonymous: true
			});
			// Store the anonymous ID in a cookie
			cookies.set('anonymousId', res.id, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				httpOnly: false,
				sameSite: 'lax',
				secure: !dev
			}); // 1 year
		} catch (error) {
			console.error('Error creating anonymous user:', error);
		}
	}

	return {
		anonymousId
	};
}
