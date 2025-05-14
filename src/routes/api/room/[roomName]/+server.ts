import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({params, locals}) => {
    const pb = locals.pb;
    const roomName = (params.roomName as string).toLowerCase().trim();

    // Validate the roomName parameter
    if (!roomName || typeof roomName !== 'string' || roomName.length < 3 || roomName.length > 20) {
        return new Response(JSON.stringify({ error: 'Invalid room name' }), { status: 400 });
    }

    try {
        // Query PocketBase to check if a room with the given name exists
        await pb.collection('rooms').getFirstListItem(`name="${roomName}"`);
        return new Response(JSON.stringify({ exists: true }), { status: 200 });
    } catch (error) {
        if ((error as { status?: number }).status === 404) {
            // Room does not exist
            return new Response(JSON.stringify({ exists: false }), { status: 200 });
        }
        // Handle other errors
        console.error('Error querying PocketBase:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};