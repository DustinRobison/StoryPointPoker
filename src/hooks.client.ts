import { currentUser } from '$lib/stores/user';

import { supabase } from '$lib/supabase';

// Initialize the currentUser store from the session (if any).
const init = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	currentUser.set(session?.user ?? null);
};

init();

// Keep currentUser in sync as Supabase refreshes/updates the session.
if (supabase) {
	supabase.auth.onAuthStateChange((_event: string, session: any) => {
		currentUser.set(session?.user ?? null);
	});
}
