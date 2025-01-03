// cf.: https://supabase.com/docs/guides/auth/server-side/sveltekit (mod.)

import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),

			// NOTE: Depend "secure" (https) on Vite env, set to false for dev env so that we can access this page over the LAN

			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...options,
						secure: import.meta.env.PROD,
						path: '/'
					});
				});
			}
		}
	});

	if ('suppressGetSessionWarning' in event.locals.supabase.auth) {
		// @ts-expect-error - suppressGetSessionWarning is not part of the official API
		event.locals.supabase.auth.suppressGetSessionWarning = true;
	} else {
		console.warn(
			'SupabaseAuthClient#suppressGetSessionWarning was removed. See https://github.com/supabase/auth-js/issues/888.'
		);
	}

	// NOTE: Need this for account maintenance

	event.locals.supabaseServiceRole = createClient(
		PUBLIC_SUPABASE_URL,
		PRIVATE_SUPABASE_SERVICE_ROLE,
		{ auth: { persistSession: false } }
	);

	if ('suppressGetSessionWarning' in event.locals.supabaseServiceRole.auth) {
		// @ts-expect-error - suppressGetSessionWarning is not part of the official API
		event.locals.supabaseServiceRole.auth.suppressGetSessionWarning = true;
	} else {
		console.warn(
			'SupabaseAuthClient#suppressGetSessionWarning was removed. See https://github.com/supabase/auth-js/issues/888.'
		);
	}

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;
	if (!event.locals.session && event.url.pathname.startsWith('/app')) {
		redirect(302, '/auth/signin');
	}
	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(302, '/app');
	}
	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
