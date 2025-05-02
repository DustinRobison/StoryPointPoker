// src/hooks.server.js
import { dev } from '$app/environment';
import { createServerInstance } from '$lib/pocketbase.server';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ANONYMOUS_USER = {
	is_anonymous: true,
	password: "SuperSecretPassword",
	passwordConfirm: "SuperSecretPassword",
};

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const pb = await createServerInstance();

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
				// Create a new anonymous user
				const uniqueEmail = `anon_${uuidv4()}@example.com`;
				await pb.collection('users').create({...DEFAULT_ANONYMOUS_USER, email: uniqueEmail});
				// Authenticate the anonymouse user to set the auth store
				await pb.collection('users').authWithPassword(uniqueEmail, DEFAULT_ANONYMOUS_USER.password);
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
