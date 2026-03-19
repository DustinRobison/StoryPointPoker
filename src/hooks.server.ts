import { createSupabaseServerClient } from '$lib/supabase.server';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Remove an annoying request from Chrome DevTools
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	const supabase = createSupabaseServerClient({ cookies: event.cookies });

	// Ensure we always have an authenticated session (anonymous sign-in).
	try {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			await supabase.auth.signInAnonymously();
		}
	} catch (e) {
		console.error('Supabase auth error:', e);
	}

	const {
		data: { session }
	} = await supabase.auth.getSession();

	event.locals.supabase = supabase;
	event.locals.user = session?.user ?? null;

	return resolve(event);
}
