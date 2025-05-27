import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    let room;
    // Check if the user is authenticated
    const user = locals.user;
    if (!user) {
        return error(401, 'Unauthorized');
    }

    // Get user public data
    const userPublic = await locals.pb.collection('users_public').getOne(user.public);
    // If the user does not exist or is missing a name redirect to the profile page
    if (!userPublic || !userPublic.name) {
        return redirect(303, `/profile?redirectTo=/room/${params.room}`);
    }

    //  Query pocketbase for room by name
    try {
        room = await locals.pb.collection('rooms').getFirstListItem(`name="${params.room}"`);
    } catch {
        return error(404, `Room ${params.room} not found`);
    }
    

    const bannedUsers = room.banned || [];
    // Check if the user is banned from the room
    if (bannedUsers.includes(userPublic.id)) {
        return error(403, 'You are banned from this room');
    }

    // Check if the room has the user in the votes list
    const voteUser = room.votes[userPublic.id];
    if (!voteUser) {
        // If not add the user to the room as a vote
        room = await locals.pb.collection('rooms').update(room.id, {
            'votes': {
                ...room.votes, 
                [userPublic.id]: {
                    'vote': "-",
                    'name': userPublic.name,
                    'avatar': userPublic.avatar,
                } 
            } 
        });
    }
    
	return {
        userId: user.id,
        user: userPublic,
        room: room
    };
}) satisfies PageServerLoad;


export const actions = {
    
}