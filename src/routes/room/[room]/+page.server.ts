import { urlSafeRegex } from '$lib/form-schema';
import { getAnonymousIdFromCookie } from '$lib/helpers';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    // Check if the user is authenticated
    let user = null;
	if (!locals.pb.authStore.isValid) {
		user = {}
	}
	return {
        user
    };
}) satisfies PageServerLoad;


export const actions = {
    name: async ({ request, params, locals }) => {

        // extract anonymousId from cookie
        const anonymousId = getAnonymousIdFromCookie(request.headers.get('cookie'));
        if (!anonymousId) {
            return fail(400, { form: { error: 'Anonymous ID not found' } });
        }

        // Get room from the request params
        const roomName = params.room
        if (!roomName) {
            return fail(400, { form: { error: 'Room not found' } });
        }

        // extract form data
        const data = await request.formData();
        const username = data.get('name') as string || "" ;

        // Validate username
        const valid = username.length > 1 && username.length < 20 && urlSafeRegex.test(username);
        if (!valid) {
            return fail(400, { form: { error: 'Invalid username' } });
        }

        // Update the user name in pocketbase user table
        const user = await locals.pb.collection('users').update(anonymousId, {
            name: username
        });
        // Get the room data from pocketbase
        const roomData = await locals.pb.collection('rooms').getFirstListItem(`roomName="${roomName}"`);
        if (!roomData) {
            return fail(400, { form: { error: 'Room not found' } });
        }
        
        const roomUsers = roomData.users;
        // Check if the user is already in the room
        const userInRoom = roomUsers.find((user) => user.id === anonymousId);
        if (userInRoom) {
            // Update the user name in the room
            const res = await locals.pb.collection('rooms').update(roomData.id, {
                users: roomUsers.map((user) => {
                    if (user.id === anonymousId) {
                        return {
                            ...user,
                            name: username
                        }
                    }
                    return user;
                }
                )
            });
            return {
                success: true,
                message: 'User name updated successfully',
                room: roomName
            }
        } else {
            // Add the user to the room
            const res = await locals.pb.collection('rooms').update(roomData.id, {
                users: [
                    ...roomUsers,
                    {
                        id: anonymousId,
                        name: username,
                        vote: ''
                    }
                ]
            });
            return {
                success: true,
                message: 'User added to room successfully',
                room: roomName
            }
        }
    }
}