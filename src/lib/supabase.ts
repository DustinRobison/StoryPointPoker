import { env } from '$env/dynamic/public';
import { createBrowserClient } from '@supabase/ssr';

const url = env.PUBLIC_SUPABASE_URL;
const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

// Guard for local builds where env vars may not yet be set.
// When env vars are present, this becomes the real browser client.
export const supabase =
	url && anonKey ? createBrowserClient(url, anonKey) : (null as any);
