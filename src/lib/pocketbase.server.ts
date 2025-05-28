import { env } from '$env/dynamic/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ANONYMOUS_USER = {
	is_anonymous: true,
	password: 'SuperSecretPassword',
	passwordConfirm: 'SuperSecretPassword'
};

export async function createInstance() {
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL || 'http://localhost:8090');

	return pb;
}

export const pb = createInstance();

export async function createAnonymousUser(pb: PocketBase) {
	// Create a new anonymous user
	const uniqueEmail = `anon_${uuidv4()}@example.com`;
	const user = await pb
		.collection('users')
		.create({ ...DEFAULT_ANONYMOUS_USER, email: uniqueEmail });
	// Authenticate the anonymouse user to set the auth store
	await pb.collection('users').authWithPassword(uniqueEmail, DEFAULT_ANONYMOUS_USER.password);

	// Create new anonymous user public data
	const publicUser = await pb.collection('users_public').create({
		user: user.id
	});

	// Update the user with the public
	await pb.collection('users').update(user.id, {
		public: publicUser.id
	});
}

export async function getPocketbaseAdmin() {
	try {
		const pbAdmin = await createInstance();
		const pbAdminUsername = env.SECRET_PB_ADMIN_USERNAME || process.env.SECRET_PB_ADMIN_USERNAME;
		const pbAdminPassword = env.SECRET_PB_ADMIN_PASSWORD || process.env.SECRET_PB_ADMIN_PASSWORD;
		if (!pbAdminUsername || !pbAdminPassword) {
			throw new Error('PocketBase admin credentials are not set');
		}
		// Check if the admin user exists
		// log in as admin
		await pbAdmin.collection("_superusers").authWithPassword(pbAdminUsername, pbAdminPassword);
		return pbAdmin;
	} catch (error) {
		console.error('Error creating PocketBase instance:', error);
		throw new Error('Failed to create PocketBase instance or authenticate admin user');
	}
}
