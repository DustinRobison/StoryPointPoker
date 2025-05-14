// src/hooks.server.js
import { dev } from '$app/environment';
import { createInstance } from '$lib/pocketbase';
import { createAnonymousUser } from '$lib/pocketbase.server';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Remove an annoying request from Chrome DevTools
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	// Create a new PocketBase instance
	const pb = await createInstance();

	// load the store data from the request cookie string
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		}
	} catch {
		// clear the auth store on failed refresh
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.record;

	// Create & authenticate anonymous user if no valid user is present
	if (!event.locals.user) {
		try {
			// Check if the client has an anonymous user token in the auth store
			if (!pb.authStore.isValid) {
				await createAnonymousUser(pb);
			}
			event.locals.user = pb.authStore.record;
		} catch (error) {
			console.error('Error creating anonymous user:', error);
		}
	}

	const response = await resolve(event);
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'lax', secure: !dev })
	);

	return response;
}
