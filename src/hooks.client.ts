import { currentUser } from '$lib/stores/user';

import { supabase } from '$lib/supabase';

// Initialize the currentUser store from the session (if any).
const init = async () => {
	const { data } = await supabase.auth.getUser();
	currentUser.set(data?.user ?? null);
};

init();

// Keep currentUser in sync as Supabase refreshes/updates the session.
if (supabase) {
	supabase.auth.onAuthStateChange(async () => {
		const { data } = await supabase.auth.getUser();
		currentUser.set(data?.user ?? null);
	});
}
