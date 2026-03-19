import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/**
 * Request-scoped Supabase client (uses the user's cookies).
 * Used by hooks.server.ts and server load/actions.
 */
export function createSupabaseServerClient(event: any) {
	return createServerClient(publicEnv.PUBLIC_SUPABASE_URL as string, publicEnv.PUBLIC_SUPABASE_ANON_KEY as string, {
		cookies: {
			get: (key: string) => event.cookies.get(key),
			set: (key: string, value: string, options?: Record<string, unknown>) => {
				// Supabase needs cookies available to the server on future requests.
				event.cookies.set(key, value, {
					...options,
					// SvelteKit cookie API generally requires `path` to be set.
					path: options?.path ?? '/'
				});
			},
			remove: (key: string, options?: Record<string, unknown>) => {
				event.cookies.delete(key, {
					...options,
					path: options?.path ?? '/'
				});
			}
		}
	});
}

/**
 * Service role client for server-only admin operations (bypasses RLS).
 * Do NOT use in the browser.
 */
const serviceRoleUrl = publicEnv.PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SECRET_SUPABASE_SERVICE_ROLE_KEY;

// Guard for local builds where env vars may not yet be set.
export const supabaseServiceRole =
	serviceRoleUrl && serviceRoleKey
		? createClient(serviceRoleUrl, serviceRoleKey, { auth: { persistSession: false } })
		: (null as any);

