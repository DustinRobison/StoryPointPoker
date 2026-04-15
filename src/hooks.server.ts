import { createSupabaseServerClient } from '$lib/supabase.server';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Remove an annoying request from Chrome DevTools
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	// Safari / iOS probe for a touch icon; avoids noisy 404s in dev logs when not present in /static.
	if (
		event.url.pathname === '/apple-touch-icon-precomposed.png' ||
		event.url.pathname === '/apple-touch-icon.png'
	) {
		return new Response(null, { status: 204 });
	}

	const supabase = createSupabaseServerClient({ cookies: event.cookies });

	// Ensure we always have an authenticated session (anonymous sign-in).
	try {
		// Prefer getUser() to avoid using `session.user` directly (Supabase warns about this).
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (!userError && userData?.user) {
			event.locals.supabase = supabase;
			event.locals.user = userData.user;
			return resolve(event);
		}

		const { data } = await supabase.auth.signInAnonymously();
		event.locals.supabase = supabase;
		event.locals.user = data?.user ?? null;
		return resolve(event);
	} catch (e) {
		console.error('Supabase auth error (anon sign-in):', e);
	}

	return resolve(event);
}
