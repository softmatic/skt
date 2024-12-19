import type { RequestHandler } from './$types';
import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

// NOTE: For this to work, set the URL in the Supabase confirmation template to:
// href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/app';

	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			redirectTo.searchParams.delete('next');
			redirect(302, redirectTo);
		}
	}
	redirectTo.pathname = '/auth/error';
	redirect(302, redirectTo);
};
