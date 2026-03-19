import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({params, locals}) => {
    const roomName = (params.roomName as string).toLowerCase().trim();

    // Validate the roomName parameter
    if (!roomName || typeof roomName !== 'string' || roomName.length < 3 || roomName.length > 20) {
        return new Response(JSON.stringify({ error: 'Invalid room name' }), { status: 400 });
    }

    try {
        const { data } = await locals.supabase
			.from('rooms')
			.select('id')
			.eq('name', roomName)
			.maybeSingle();

		if (data) {
			return new Response(JSON.stringify({ exists: true }), { status: 200 });
		}
    } catch (error) {
        // Handle other errors
        console.error('Error querying rooms from Supabase:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

	// Not found
	return new Response(JSON.stringify({ exists: false }), { status: 200 });
};