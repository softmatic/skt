import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { userId } = await request.json();
	const supabaseServiceRole = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE, {
		auth: { persistSession: false }
	});

	// Delete user from auth (users, profiles will cascade)

	const { error } = await supabaseServiceRole.auth.admin.deleteUser(userId);
	if (error) {
		console.error(error);
		return json({ result: 'false' });
	} else {
		console.log('Deleted user: ', userId);
		return json({ result: 'true' });
	}
};
