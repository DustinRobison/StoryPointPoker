import { pb } from '$lib/server/pocketbase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({params}) => {
    const { roomName } = params;

    // Validate the roomName parameter
    if (!roomName || typeof roomName !== 'string' || roomName.length < 3 || roomName.length > 20) {
        return new Response(JSON.stringify({ error: 'Invalid room name' }), { status: 400 });
    }

    try {
        // Query PocketBase to check if a room with the given name exists
        await pb.collection('rooms').getFirstListItem(`roomName="${roomName}"`);
        return new Response(JSON.stringify({ exists: true }), { status: 200 });
    } catch (error) {
        console.log(error)
        if ((error as { status?: number }).status === 400) {
            // Room does not exist
            return new Response(JSON.stringify({ exists: false }), { status: 200 });
        }
        // Handle other errors
        console.error('Error querying PocketBase:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};